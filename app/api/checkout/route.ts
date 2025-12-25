import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Create a dummy Stripe implementation for development without API keys
class DummyStripe {
  checkout = {
    sessions: {
      create: async (options: any) => {
        // Generate a random session ID
        const sessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
        return {
          id: sessionId,
          url: `/checkout/success?session_id=${sessionId}`,
        };
      }
    }
  };
}

// Use real Stripe when API key is available, otherwise use dummy implementation
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-03-31.basil' })
  : new DummyStripe() as any;

export async function POST(request: Request) {
  try {
    const { items, shippingInfo } = await request.json();
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Format items for Stripe
    const lineItems = items.map((item: any) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            images: [item.product.images[0]],
            metadata: {
              productId: item.product.id,
              color: item.color || null,
              size: item.size || null
            },
          },
          unit_amount: parseInt((item.product.price * 100).toString()), // Stripe uses cents
        },
        quantity: item.quantity,
      };
    });

    // Add shipping fee
    const shippingFee = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Shipping & Handling',
        },
        unit_amount: 999, // $9.99
      },
      quantity: 1,
    };

    lineItems.push(shippingFee);

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      metadata: {
        customerEmail: shippingInfo.email,
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      },
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error in checkout API:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred with the payment' },
      { status: 500 }
    );
  }
}