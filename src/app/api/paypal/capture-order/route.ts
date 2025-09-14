// app/api/paypal/capture-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getPaypalAccessToken, capturePaypalOrder } from "../paypalHelpers";

// For debugging purposes - remove in production
const DEBUG = process.env.NODE_ENV !== 'production';

export async function POST(request: NextRequest) {
  try {
    const { paypalOrderId, orderId } = await request.json();
    if (!paypalOrderId || !orderId) {
      return NextResponse.json({ error: "Missing arguments" }, { status: 400 });
    }

    if (DEBUG) {
      console.log(`Processing PayPal order capture: ${paypalOrderId} for order ID: ${orderId}`);
    }

    try {
      //1) Capturar la orden en PayPal
      const accessToken = await getPaypalAccessToken();
      const captureResult = await capturePaypalOrder({
        accessToken,
        paypalOrderId
      });

      if (DEBUG) {
        console.log('Capture result:', JSON.stringify(captureResult, null, 2));
      }

      //Evalúa si fue exitosa
      if (captureResult.status !== "COMPLETED") {
        return NextResponse.json({ 
          status: "FAILED", 
          details: DEBUG ? captureResult : undefined 
        }, { status: 400 });
      }

      // 2) Actualizar la orden en la BD a 'paid'
      const { error: updateOrderError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          payment_reference: paypalOrderId
        })
        .eq("id", orderId)
        .select();

      if (updateOrderError) {
        console.error("Error updating order:", updateOrderError);
        return NextResponse.json({ error: `Error updating order: ${updateOrderError.message}` }, { status: 500 });
      }

      if (DEBUG) {
        console.log(`Order ${orderId} updated successfully`);
      }

      // Note: user_tickets functionality removed as table doesn't exist in current schema

      return NextResponse.json({ status: "COMPLETED" }, { status: 200 });
    } catch (paypalError: unknown) {
      console.error('PayPal API error:', paypalError);
      const errorMessage = paypalError instanceof Error ? paypalError.message : 'Unknown PayPal error';
      return NextResponse.json({ 
        error: `PayPal API error: ${errorMessage}`,
        details: DEBUG ? paypalError : undefined
      }, { status: 500 });
    }
  } catch (err: unknown) {
    console.error("Error in capture-order route:", err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
