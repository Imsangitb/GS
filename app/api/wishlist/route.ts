import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Create a Supabase client without the cookie handling
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Missing product ID' },
        { status: 400 }
      );
    }

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Add product to wishlist
    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: session.user.id,
        product_id: productId,
        added_at: new Date().toISOString()
      });

    if (error) {
      // If unique constraint error (already in wishlist), return success
      if (error.code === '23505') {
        return NextResponse.json({ 
          success: true,
          message: 'Product already in wishlist'
        });
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Product added to wishlist'
    });
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred adding to wishlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Missing product ID' },
        { status: 400 }
      );
    }

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Remove product from wishlist
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', session.user.id)
      .eq('product_id', productId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred removing from wishlist' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get wishlist items
    const { data: wishlistItems, error } = await supabase
      .from('wishlist')
      .select('id, product_id, added_at, products(name, price, description, images)')
      .eq('user_id', session.user.id)
      .order('added_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      wishlistItems 
    });
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred fetching wishlist' },
      { status: 500 }
    );
  }
}