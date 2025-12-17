
import PayPalCardMethod from "./PayPalCardMethod";
import toast from "react-hot-toast";

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
    createdOrderId,
    locale,

  }: {
    paymentMethod: PaymentMethod | null;
  
    bancoSeleccionado: Banco | null;
    setBancoSeleccionado: (v: Banco | null) => void;
    ultimos4: string;
    setUltimos4: (v: string) => void;
    total: number;
    onFinalize: () => void;
    createdOrderId: number | null;
    locale: string;

}) {
    const copiarMensaje = () => {
        if (bancoSeleccionado?.permiteSMS) {
            const mensaje = `PASE 1000 8888-9999`;
            navigator.clipboard.writeText(mensaje);
            toast.success("Mensaje copiado al portapapeles", {
                duration: 3000,
                position: "top-center",
                style: {
                    background: "#4A7C59",
                    color: "white",
                    fontWeight: "500"
                },
                icon: "📋"
            });
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
                    <div className="mt-4 bg-[#FAF8F5] border border-[#E8E4E0] rounded-xl p-5 shadow-sm">
                        <p className="text-sm mb-3 text-[#4A4A4A]">
                            {locale === "es" ? "Monto total" : "Total amount"}: <b className="text-[#C9A962]">₡{total}</b>.
                            {" "}{locale === "es" ? "Envia tu pago vía SINPE con la siguiente info:" : "Send your payment via SINPE with the following info:"}
                        </p>
                        <label className="block mb-1.5 text-sm font-medium text-[#2D2D2D]">{locale === "es" ? "Selecciona Banco:" : "Select Bank:"}</label>
                        <select
                            value={bancoSeleccionado?.nombre || ""}
                            onChange={handleBancoChange}
                            className="w-full p-3 border border-[#E8E4E0] rounded-lg mb-3 text-[#2D2D2D] bg-white focus:ring-2 focus:ring-[#C9A962]/30 focus:border-[#C9A962] outline-none transition-colors"
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
                            <div className="mt-3 p-4 border border-[#C9A962]/30 bg-white rounded-lg text-sm shadow-sm">
                                {bancoSeleccionado.permiteSMS ? (
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[#4A4A4A]">
                                                {locale === "es" ? "Enviar SMS a:" : "Send SMS to:"} <b className="text-[#2D2D2D]">{bancoSeleccionado.sms}</b>
                                            </p>
                                            <p className="text-[#4A4A4A]">
                                                {locale === "es" ? "Mensaje:" : "Message:"}: <b className="text-[#2D2D2D]">PASE {total} 85850000 HM-ART</b>
                                            </p>
                                        </div>
                                        <button
                                            onClick={copiarMensaje}
                                            className="mt-2 sm:mt-0 sm:w-auto text-sm bg-[#4A7C59] hover:bg-[#3D6B4A] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
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
                            className="w-full p-3 border border-[#E8E4E0] rounded-lg mb-3 text-[#2D2D2D] bg-white focus:ring-2 focus:ring-[#C9A962]/30 focus:border-[#C9A962] outline-none transition-colors"
                        />
                        <button
                            onClick={onFinalize}
                            className="w-full mt-4 bg-gradient-to-r from-[#C9A962] to-[#A08848] hover:from-[#D4C4A8] hover:to-[#C9A962] text-[#1A1A1A] font-bold py-3.5 rounded-xl shadow-lg transition-all duration-300"
                        >
                            {locale === "es" ? "Confirmar y Finalizar" : "Confirm and Finalize"}
                        </button>
                    </div>
                );
            case "paypal":
                return (
                    <div className="mt-4 p-5 bg-[#FAF8F5] border border-[#E8E4E0] rounded-xl text-center shadow-sm">
                        {createdOrderId && (
                            <PayPalCardMethod
                                createdOrderId={createdOrderId}
                                onPaymentSuccess={() => {
                                    onFinalize();
                                }}
                                onPaymentError={(msg) => {
                                    console.error(msg);
                                }}
                            />
                        )}
                    </div>
                );
            case "transfer":
                return (
                    <div className="mt-4 p-5 bg-[#FAF8F5] border border-[#E8E4E0] rounded-xl text-center shadow-sm">
                        <p className="text-sm md:text-base text-[#4A4A4A]">{locale === "es" ? "Instrucciones para transferencia bancaria." : "Instructions for bank transfer."}</p>
                    </div>
                );
            case "card":
                return (
                    <div className="mt-4 p-5 bg-[#FAF8F5] border border-[#E8E4E0] rounded-xl text-center shadow-sm">
                        <p className="text-sm md:text-base text-[#4A4A4A]">{locale === "es" ? "Formulario de tarjeta de crédito/débito (Stripe, etc.)." : "Credit/debit card form (Stripe, etc.)."}</p>
                    </div>
                );
            default:
                return (
                    <div className="mt-4 p-5 bg-[#FAF8F5] border border-[#E8E4E0] rounded-xl text-center shadow-sm">
                        <p className="text-sm md:text-base text-[#9C9589]">{locale === "es" ? "Aquí se mostrará el formulario de pago" : "Here the payment form will be displayed"}</p>
                    </div>
                );
        }
    };

    return (
        <section className="text-[#2D2D2D] w-full mt-4">
            {renderPaymentForm()}
        </section>
    );
}