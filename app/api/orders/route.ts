import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { userId, orderData } = await request.json();

    if (!orderData || !userId) {
      return NextResponse.json(
        { error: 'Missing required order information' },
        { status: 400 }
      );
    }

    // Insert the order into the orders table
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        order_id: orderData.id,
        total: orderData.total,
        status: 'processing',
        shipping_address: orderData.shippingAddress,
        payment_method: orderData.paymentMethod,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving order:', error);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Insert order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: data.id,
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      color: item.color || null,
      size: item.size || null,
      image: item.product.images[0] || '/placeholder.jpg'
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error saving order items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to save order items' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      orderId: orderData.id 
    });
  } catch (error: any) {
    console.error('Error in orders API:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred processing your order' },
      { status: 500 }
    );
  }
}