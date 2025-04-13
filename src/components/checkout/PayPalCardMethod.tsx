"use client";
import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const NEXT_PUBLIC_PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;

export default function PayPalCardMethod({
    createdOrderId, // ID de la orden en tu BD
    onPaymentSuccess,
    onPaymentError
}: {
    createdOrderId: number;
    onPaymentSuccess: () => void;
    onPaymentError: (msg: string) => void;
}) {
    const [loading, setLoading] = useState(false);

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            
            {loading && <p className="text-gray-600">Procesando...</p>}
            <PayPalScriptProvider
                options={{
                    "clientId": NEXT_PUBLIC_PAYPAL_CLIENT_ID,   // <---- usa "client-id" con guion
                    currency: "USD",
                    intent: "capture"
                  }}
            >
                <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={async () => {
                        // Llamar a tu API para crear la orden en PayPal
                        setLoading(true);
                        const res = await fetch("/api/paypal/create-order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ orderId: createdOrderId })
                        });
                        const data = await res.json();
                        setLoading(false);

                        if (data.error) {
                            onPaymentError(data.error);
                            throw new Error(data.error);
                        }
                        return data.paypalOrderId; // Devuelves el ID de la orden generada en PayPal
                    }}
                    onApprove={async (data) => {
                        // PayPal devolvió: data.orderID
                        const paypalOrderId = data.orderID;
                        setLoading(true);

                        // Capturar la orden en PayPal
                        const res = await fetch("/api/paypal/capture-order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                paypalOrderId: paypalOrderId,
                                orderId: createdOrderId
                            })
                        });
                        const result = await res.json();
                        setLoading(false);

                        if (result.status === "COMPLETED") {
                            onPaymentSuccess();
                        } else {
                            onPaymentError("La transacción no pudo completarse.");
                        }
                    }}
                    onCancel={async () => {
                        
                        console.log("PayPal Order Canceled");
                        
                    }}
                    onError={(err) => {
                        console.error("PayPal Error:", err);
                        onPaymentError("Ocurrió un error con PayPal.");
                    }}
                />
            </PayPalScriptProvider>


        </div>
    );
}