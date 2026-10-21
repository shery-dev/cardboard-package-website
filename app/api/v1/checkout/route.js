import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request) {
  try {
    const OrderData = await request.json();
    let lineItems = [];

    for (let i = 0; i < OrderData.orders.length; i++) {
      const order = OrderData.orders[i];
      if (order.name && order.quantity && order.price) {
        lineItems.push({
          price_data: {
            currency: "pkr",
            product_data: {
              name: order.name,
            },
            unit_amount: order.pricePerPiece * 100, // price in paisa
          },
          quantity: order.quantity,
        });
      }
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["PK"],
      },
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    // Return URL in JSON response
    return new Response(
      JSON.stringify({
        url: session.url,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error!",
        status: 500,
      }),
      { status: 500 }
    );
  }
}
