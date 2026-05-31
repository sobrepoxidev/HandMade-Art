
import PayPalCardMethod from "./PayPalCardMethod";
import { notify } from "@/components/ui/notify";

type PaymentMethod = "sinpe" | "paypal" | "transfer" | "card";
type Banco = {
    nombre: string;
    sms?: string;
    permiteSMS: boolean;
};
const bancos = [
    { nombre: "Banco Nacional de Costa Rica (BNCR)", sms: "+2627", permiteSMS: true },
    { nombre: "Banco de Costa Rica (BCR)", sms: "+2276 (Solo Kolbi)", permiteSMS: true },
    { nombre: "BAC Credomatic", sms: "+7070-1222", permiteSMS: true },
    { nombre: "Banco Popular", permiteSMS: false },
    { nombre: "Davivienda", sms: "+7070 o +7474", permiteSMS: true },
    { nombre: "Scotiabank", permiteSMS: false },
    { nombre: "Banco Promerica", sms: "+6223 o +2450", permiteSMS: true },
    { nombre: "Banco Lafise", sms: "+9091", permiteSMS: true },
];

export default function PaymentForm({
    paymentMethod,
    bancoSeleccionado,
    setBancoSeleccionado,
    ultimos4,
    setUltimos4,
    total,
    onFinalize,
    checkoutOrderId,
    checkoutToken,
    createCheckoutOrder,
    serverError,
    onPaymentError,
    locale,

  }: {
    paymentMethod: PaymentMethod | null;
  
    bancoSeleccionado: Banco | null;
    setBancoSeleccionado: (v: Banco | null) => void;
    ultimos4: string;
    setUltimos4: (v: string) => void;
    total: number;
    onFinalize: () => Promise<void>;
    checkoutOrderId: number | null;
    checkoutToken: string | null;
    createCheckoutOrder: (paymentMethod: "paypal" | "sinpe") => Promise<{ orderId: number; checkoutToken: string } | null>;
    serverError: string | null;
    onPaymentError: (message: string) => void;
    locale: string;

}) {
    const copiarMensaje = () => {
        if (bancoSeleccionado?.permiteSMS) {
            const mensaje = `PASE ${total.toFixed(2)} 85850000 HM-ART`;
            navigator.clipboard.writeText(mensaje);
            notify.success("Mensaje SINPE copiado al portapapeles");
        }
    };
    const handleBancoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const banco = bancos.find((b) => b.nombre === e.target.value);
        setBancoSeleccionado(banco || null);
    };
    // Render condicional según método
    const renderPaymentForm = () => {
        switch (paymentMethod) {
            case "sinpe":
                return (
                    <div className="mt-4 bg-[#FAF6EF] border border-[#E8E4E0] rounded-sm p-5 shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)]">
                        <p className="text-sm mb-3 text-[#4A4A4A]">
                            {locale === "es" ? "Monto total" : "Total amount"}: <b className="text-[#C9A962]">${total.toFixed(2)} USD</b>.
                            {" "}{locale === "es" ? "Envia tu pago vía SINPE con la siguiente info:" : "Send your payment via SINPE with the following info:"}
                        </p>
                        <label className="block mb-1.5 text-sm font-medium text-[#2D2D2D]">{locale === "es" ? "Selecciona Banco:" : "Select Bank:"}</label>
                        <select
                            value={bancoSeleccionado?.nombre || ""}
                            onChange={handleBancoChange}
                            className="w-full p-3 border border-[#E8E4E0] rounded-sm mb-3 text-[#2D2D2D] bg-white focus:ring-2 focus:ring-[#A08848]/25 focus:border-[#A08848] outline-none transition-colors"
                        >
                            <option value="">-- {locale === "es" ? "Selecciona Banco" : "Select Bank"} --</option>
                            {bancos.map((b, idx) => (
                                <option key={idx} value={b.nombre}>
                                    {b.nombre}
                                </option>
                            ))}
                        </select>
                        {/* Instrucciones dinámicas */}
                        {bancoSeleccionado && (
                            <div className="mt-3 p-4 border border-[#C9A962]/30 bg-[#FAF6EF] rounded-sm text-sm shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)]">
                                {bancoSeleccionado.permiteSMS ? (
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[#4A4A4A]">
                                                {locale === "es" ? "Enviar SMS a:" : "Send SMS to:"} <b className="text-[#2D2D2D]">{bancoSeleccionado.sms}</b>
                                            </p>
                                            <p className="text-[#4A4A4A]">
                                                {locale === "es" ? "Mensaje:" : "Message:"}: <b className="text-[#2D2D2D]">PASE {total.toFixed(2)} 85850000 HM-ART</b>
                                            </p>
                                        </div>
                                        <button
                                            onClick={copiarMensaje}
                                            className="mt-2 sm:mt-0 sm:w-auto text-sm bg-[#4A7C59] hover:bg-[#2F5F3E] text-[#F5F1EB] font-semibold py-2.5 px-4 rounded-sm transition-colors min-h-[44px]"
                                        >
                                            {locale === "es" ? "Copiar Mensaje" : "Copy Message"}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-[#4A4A4A]">
                                        📱 {locale === "es" ? "Realiza la transferencia desde la app o banca en línea de" : "Make the transfer from the app or online bank of"} <b className="text-[#2D2D2D]">{bancoSeleccionado.nombre}</b>.
                                    </p>
                                )}
                            </div>
                        )}

                        <label className="block mt-4 mb-1.5 text-sm font-medium text-[#2D2D2D]">{locale === "es" ? "Últimos 4 dígitos del recibo:" : "Last 4 digits of the receipt:"}</label>
                        <input
                            type="text"
                            maxLength={4}
                            placeholder="1234"
                            value={ultimos4}
                            onChange={(e) => setUltimos4(e.target.value)}
                            className="w-full p-3 border border-[#E8E4E0] rounded-sm mb-3 text-[#2D2D2D] bg-white focus:ring-2 focus:ring-[#A08848]/25 focus:border-[#A08848] outline-none transition-colors"
                        />
                        <button
                            onClick={() => void onFinalize()}
                            className="w-full mt-4 bg-[#2D2D2D] hover:bg-[#1A1A1A] text-[#F5F1EB] font-semibold py-3.5 px-5 rounded-sm shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)] transition-colors duration-300 min-h-[44px]"
                        >
                            {locale === "es" ? "Confirmar y Finalizar" : "Confirm and Finalize"}
                        </button>
                    </div>
                );
            case "paypal":
                return (
                    <div className="mt-4 p-5 bg-[#FAF6EF] border border-[#E8E4E0] rounded-sm text-center shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)]">
                        <PayPalCardMethod
                            checkoutOrderId={checkoutOrderId}
                            checkoutToken={checkoutToken}
                            createCheckoutOrder={createCheckoutOrder}
                            onPaymentError={onPaymentError}
                        />
                    </div>
                );
            default:
                return (
                    <div className="mt-4 p-5 bg-[#FAF6EF] border border-[#E8E4E0] rounded-sm text-center shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)]">
                        <p className="text-sm md:text-base text-[#6B6459]">{locale === "es" ? "Aquí se mostrará el formulario de pago" : "Here the payment form will be displayed"}</p>
                    </div>
                );
        }
    };

    return (
        <section className="text-[#2D2D2D] w-full mt-4">
            {serverError && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="mb-4 rounded-sm border border-[#C44536] bg-[#FAF6EF] px-4 py-3 text-sm font-medium text-[#9F2D24]"
                >
                    {serverError}
                </div>
            )}
            {renderPaymentForm()}
        </section>
    );
}
