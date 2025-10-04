import React from 'react';
import { buildMetadata } from '@/lib/metadata';
import type { Metadata } from "next";
type tParams = Promise<{ id: string, locale: string }>;
export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";
  const title = currentLocale === "es" ? "Política de Privacidad" : "Privacy policy";
  
  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/privacy-policies`,
    title: title,
  });
}

export default async function PoliticaPrivacidadPage({ params }: { params: tParams }) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-2">
            {locale === "es" ? "Política de Privacidad" : "Privacy policy"}
          </h1>
          <p className="text-gray-600 text-center">
            {locale === "es" ? "Última actualización: 9 de abril de 2025" : "Last updated: April 9, 2025"}
          </p>
        </div>

        <div className="px-6 py-8 prose prose-gray max-w-none text-gray-700 leading-relaxed">
          <div className="mb-12">
            <p className="text-lg font-medium">
              {locale === "es" ? "En nuestra plataforma, respetamos su privacidad y nos comprometemos a proteger los datos personales que nos proporciona. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos su información cuando utiliza nuestro sistema de inicio de sesión y servicios relacionados." : "In our platform, we respect your privacy and we commit to protecting the personal data you provide. This Privacy Policy describes how we collect, use and protect your information when you use our login system and related services."}
            </p>
            <p>
              {locale === "es" ? "Por favor, lea detenidamente esta política para entender nuestras prácticas con respecto a sus datos personales y cómo los trataremos. Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta Política de Privacidad." : "Please read this policy carefully to understand our practices regarding your personal data and how we will handle it. By using our services, you accept the practices described in this Privacy Policy."}
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">1. {locale === "es" ? "Información que recopilamos" : "Information we collect"}</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">1.1 {locale === "es" ? "Datos proporcionados directamente" : "Directly provided data"}</h3>
            <p>
              {locale === "es" ? "Recopilamos la siguiente información mínima necesaria para gestionar su cuenta y proporcionar nuestros servicios:" : "We collect the following minimum information necessary to manage your account and provide our services:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li><span className="font-medium">Email:</span> {locale === "es" ? "Utilizado como identificador principal de su cuenta y para comunicaciones esenciales." : "Used as the primary identifier for your account and for essential communications."}</li>
              <li><span className="font-medium">{locale === "es" ? "Contraseña:" : "Password:"}</span> {locale === "es" ? "Almacenada de forma segura mediante técnicas avanzadas de encriptación y hash." : "Stored securely using advanced encryption and hash techniques."}</li>
              <li><span className="font-medium">{locale === "es" ? "Imagen de perfil (opcional):" : "Profile picture (optional):"}</span> {locale === "es" ? "Si decide cargar una imagen para personalizar su cuenta." : "If you choose to upload an image to customize your account."}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">1.2 {locale === "es" ? "Datos asociados a su actividad" : "Data associated with your activity"}</h3>
            <p>
              {locale === "es" ? "Para proporcionar funcionalidad y mejorar la seguridad, también recopilamos:" : "To provide functionality and improve security, we also collect:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li><span className="font-medium">{locale === "es" ? "Registros de inicio de sesión:" : "Login records:"}</span> {locale === "es" ? "Fecha, hora y dispositivo utilizado para acceder a su cuenta." : "Date, time and device used to access your account."}</li>
              <li><span className="font-medium">{locale === "es" ? "Datos de pedidos:" : "Order data:"}</span> {locale === "es" ? "Información relacionada con sus pedidos y transacciones para asociarlos a su perfil." : "Information related to your orders and transactions to associate them with your profile."}</li>
              <li><span className="font-medium">{locale === "es" ? "Información sobre preferencias:" : "Preference information:"}</span> {locale === "es" ? "Configuraciones y ajustes que usted establece en su cuenta." : "Settings and adjustments you make to your account."}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">1.3 {locale === "es" ? "Datos recopilados automáticamente" : "Automatically collected data"}</h3>
            <p>
              {locale === "es" ? "Recopilamos cierta información técnica cuando utiliza nuestros servicios:" : "We collect certain technical information when you use our services:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li><span className="font-medium">{locale === "es" ? "Dirección IP:" : "IP address:"}</span> {locale === "es" ? "Para seguridad y prevención de fraudes." : "For security and fraud prevention."}</li>
              <li><span className="font-medium">{locale === "es" ? "Información del dispositivo:" : "Device information:"}</span> {locale === "es" ? "Tipo de dispositivo, sistema operativo y navegador." : "Device type, operating system and browser."}</li>
              <li><span className="font-medium">{locale === "es" ? "Cookies y tecnologías similares:" : "Cookies and similar technologies:"}</span> {locale === "es" ? "Para mantener su sesión activa y mejorar la experiencia de usuario." : "To keep your session active and improve the user experience."}</li>
              <li><span className="font-medium">{locale === "es" ? "Datos de uso:" : "Usage data:"}</span> {locale === "es" ? "Patrones de interacción con nuestra plataforma para mejorar la funcionalidad." : "Patterns of interaction with our platform to improve functionality."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">2. {locale === "es" ? "Cómo utilizamos su información" : "How we use your information"}</h2>
            <p>
              {locale === "es" ? "Utilizamos su información personal exclusivamente para los siguientes propósitos:" : "We use your personal information exclusively for the following purposes:"}
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">2.1 {locale === "es" ? "Propósitos esenciales" : "Essential purposes"}</h3>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li><span className="font-medium">{locale === "es" ? "Gestión de su cuenta:" : "Account management:"}</span> {locale === "es" ? "Crear y mantener su cuenta, permitir el inicio de sesión y verificar su identidad." : "Create and maintain your account, allow login and verify your identity."}</li>
              <li><span className="font-medium">{locale === "es" ? "Procesamiento de pedidos:" : "Order processing:"}</span> {locale === "es" ? "Asociar sus pedidos a su perfil y facilitar su seguimiento." : "Associate your orders with your profile and facilitate tracking."}</li>
              <li><span className="font-medium">{locale === "es" ? "Comunicaciones de servicio:" : "Service communications:"}</span> {locale === "es" ? "Enviarle notificaciones importantes sobre su cuenta, pedidos o cambios en nuestros servicios." : "Send you important notifications about your account, orders or changes in our services."}</li>
              <li><span className="font-medium">{locale === "es" ? "Seguridad:" : "Security:"}</span> {locale === "es" ? "Proteger su cuenta contra accesos no autorizados y detectar actividades sospechosas." : "Protect your account against unauthorized access and detect suspicious activities."}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2.2 {locale === "es" ? "Mejora del servicio" : "Improving the service"}</h3>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li><span className="font-medium">{locale === "es" ? "Personalización:" : "Personalization:"}</span> {locale === "es" ? "Adaptar y personalizar aspectos de nuestro servicio según sus preferencias." : "Adapt and personalize aspects of our service according to your preferences."}</li>
              <li><span className="font-medium">{locale === "es" ? "Análisis y estadísticas:" : "Analysis and statistics:"}</span> {locale === "es" ? "Realizar análisis internos para mejorar la funcionalidad y usabilidad de nuestra plataforma." : "Perform internal analysis to improve the functionality and usability of our platform."}</li>
              <li><span className="font-medium">{locale === "es" ? "Soporte técnico:" : "Technical support:"}</span> {locale === "es" ? "Ayudarle a resolver problemas técnicos o dudas sobre su cuenta." : "Help you resolve technical problems or questions about your account."}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2.3 {locale === "es" ? "Cumplimiento legal" : "Legal compliance"}</h3>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li><span className="font-medium">{locale === "es" ? "Obligaciones legales:" : "Legal obligations:"}</span> {locale === "es" ? "Cumplir con nuestras obligaciones legales y normativas." : "Comply with our legal obligations and regulations."}</li>
              <li><span className="font-medium">{locale === "es" ? "Resolución de disputas:" : "Dispute resolution:"}</span> {locale === "es" ? "Resolver disputas y hacer cumplir nuestros acuerdos legales." : "Resolve disputes and enforce our legal agreements."}</li>
              <li><span className="font-medium">{locale === "es" ? "Prevención de fraudes:" : "Fraud prevention:"}</span> {locale === "es" ? "Proteger contra actividades fraudulentas o abusivas." : "Protect against fraudulent or abusive activities."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">3. {locale === "es" ? "Base legal para el procesamiento" : "Legal basis for processing"}</h2>
            <p>
              {locale === "es" ? "Procesamos sus datos personales en base a las siguientes bases legales:" : "We process your personal data based on the following legal bases:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li><span className="font-medium">{locale === "es" ? "Ejecución del contrato:" : "Contract execution:"}</span> {locale === "es" ? "El procesamiento es necesario para la gestión de su cuenta y la prestación de nuestros servicios." : "The processing is necessary for the management of your account and the provision of our services."}</li>
              <li><span className="font-medium">{locale === "es" ? "Consentimiento:" : "Consentimiento:"}</span> {locale === "es" ? "Cuando nos ha proporcionado su consentimiento explícito para procesamiento específico." : "When you explicitly consent to specific processing."}</li>
              <li><span className="font-medium">{locale === "es" ? "Intereses legítimos:" : "Legitimate interests:"}</span> {locale === "es" ? "Cuando el procesamiento es necesario para nuestros intereses legítimos, como mejorar nuestros servicios o garantizar la seguridad." : "When the processing is necessary for our legitimate interests, such as improving our services or ensuring security."}</li>
              <li><span className="font-medium">{locale === "es" ? "Obligación legal:" : "Legal obligation:"}</span> {locale === "es" ? "Cuando estamos obligados por ley a procesar su información." : "When we are legally obligated to process your information."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">4. {locale === "es" ? "Compartición de información" : "Information sharing"}</h2>
            <p>
              {locale === "es" ? "Nos comprometemos a no vender, alquilar o comercializar sus datos personales. Compartimos su información únicamente en las siguientes circunstancias:" : "We commit to not sell, rent, or commercialize your personal data. We share your information only in the following circumstances:"}
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">4.1 {locale === "es" ? "Proveedores de servicios" : "Service providers"}</h3>
            <p>
              {locale === "es" ? "Podemos compartir su información con proveedores de servicios que nos ayudan a operar nuestra plataforma:" : "We may share your information with service providers that help us operate our platform:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Proveedores de servicios de alojamiento y servidores." : "Service providers of hosting and servers."}</li>
              <li>{locale === "es" ? "Servicios de autenticación y seguridad." : "Authentication and security services."}</li>
              <li>{locale === "es" ? "Procesadores de pagos (sin compartir credenciales de inicio de sesión)." : "Payment processors (without sharing login credentials)."}</li>
              <li>{locale === "es" ? "Servicios de análisis para mejorar nuestro rendimiento." : "Analysis services to improve our performance."}</li>
            </ul>
            <p className="mt-4">
              {locale === "es" ? "Todos estos proveedores están obligados contractualmente a proteger su información y utilizarla únicamente para los fines específicos acordados." : "All these providers are contractually obligated to protect your information and use it exclusively for the specific purposes agreed upon."}
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4.2 {locale === "es" ? "Requisitos legales" : "Legal requirements"}</h3>
            <p>
              {locale === "es" ? "Podemos divulgar su información cuando sea requerido por ley:" : "We may disclose your information when required by law:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "En respuesta a solicitudes legales de autoridades públicas." : "In response to legal requests from public authorities."}</li>
              <li>{locale === "es" ? "Para proteger nuestros derechos legales o defender contra reclamaciones legales." : "To protect our legal rights or defend against legal claims."}</li>
              <li>{locale === "es" ? "Para investigar, prevenir o tomar medidas respecto a actividades ilegales." : "To investigate, prevent, or take measures regarding illegal activities."}</li>
              <li>{locale === "es" ? "En circunstancias excepcionales para proteger la seguridad personal de usuarios o del público." : "In exceptional circumstances to protect the personal security of users or the public."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">5. {locale === "es" ? "Seguridad de los datos" : "Data security"}</h2>
            <p>
              {locale === "es" ? "Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales:" : "We implement appropriate technical and organizational measures to protect your personal data:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li><span className="font-medium">{locale === "es" ? "Encriptación:" : "Encryption:"}</span> {locale === "es" ? "Utilizamos tecnología de encriptación para proteger sus datos sensibles, especialmente las contraseñas." : "We use encryption technology to protect your sensitive data, especially your password."}</li>
              <li><span className="font-medium">{locale === "es" ? "Acceso restringido:" : "Restricted access:"}</span> {locale === "es" ? "Limitamos el acceso a su información personal a empleados que necesitan conocerla." : "We limit access to your personal information to employees who need to know it."}</li>
              <li><span className="font-medium">{locale === "es" ? "Monitoreo de seguridad:" : "Security monitoring:"}</span> {locale === "es" ? "Supervisamos nuestros sistemas para detectar vulnerabilidades y posibles brechas." : "We monitor our systems to detect vulnerabilities and possible breaches."}</li>
              <li><span className="font-medium">{locale === "es" ? "Actualizaciones regulares:" : "Regular updates:"}</span> {locale === "es" ? "Mantenemos nuestros sistemas actualizados con los parches de seguridad más recientes." : "We keep our systems updated with the latest security patches."}</li>
              <li><span className="font-medium">{locale === "es" ? "Auditorías:" : "Audits:"}</span> {locale === "es" ? "Realizamos evaluaciones periódicas de nuestras prácticas de seguridad." : "We conduct periodic evaluations of our security practices."}</li>
            </ul>
            <p className="mt-4">
              {locale === "es" ? "Aunque implementamos salvaguardias razonables, ningún sistema de seguridad es completamente impenetrable. No podemos garantizar la seguridad absoluta de su información." : "Although we implement reasonable safeguards, no security system is completely impenetrable. We cannot guarantee absolute security of your information."}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">6. {locale === "es" ? "Retención de datos" : "Data retention"}</h2>
            <p>
              {locale === "es" ? "Conservamos su información personal únicamente durante el tiempo necesario para los fines establecidos en esta Política de Privacidad:" : "We keep your personal information only for as long as necessary for the purposes set forth in this Privacy Policy:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Mantenemos su información de cuenta mientras su cuenta permanezca activa." : "We maintain your account information while your account remains active."}</li>
              <li>{locale === "es" ? "Los datos de pedidos se conservan durante el período requerido por las leyes fiscales y comerciales aplicables." : "Order data is retained for the period required by applicable tax and commercial laws."}</li>
              <li>{locale === "es" ? "Los registros de inicio de sesión se conservan por un período limitado para fines de seguridad." : "Login records are retained for a limited period for security purposes."}</li>
              <li>{locale === "es" ? "Tras la eliminación de su cuenta, algunos datos pueden mantenerse en forma anonimizada para análisis estadísticos." : "After deleting your account, some data may be retained in an anonymous form for statistical analysis."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">7. {locale === "es" ? "Sus derechos" : "Your rights"}</h2>
            <p>
              {locale === "es" ? "Dependiendo de su ubicación, puede tener diversos derechos con respecto a sus datos personales:" : "Depending on your location, you may have various rights regarding your personal data:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li><span className="font-medium">{locale === "es" ? "Acceso:" : "Access:"}</span> {locale === "es" ? "Derecho a solicitar una copia de su información personal." : "Right to request a copy of your personal information."}</li>
              <li><span className="font-medium">{locale === "es" ? "Rectificación:" : "Rectification:"}</span> {locale === "es" ? "Derecho a solicitar la corrección de información inexacta o incompleta." : "Right to request the correction of inaccurate or incomplete information."}</li>
              <li><span className="font-medium">{locale === "es" ? "Eliminación:" : "Elimination:"}</span> {locale === "es" ? "Derecho a solicitar la eliminación de su información personal en determinadas circunstancias." : "Right to request the deletion of your personal information in certain circumstances."}</li>
              <li><span className="font-medium">{locale === "es" ? "Restricción:" : "Restriction:"}</span> {locale === "es" ? "Derecho a solicitar la limitación del procesamiento de su información." : "Right to request the limitation of the processing of your information."}</li>
              <li><span className="font-medium">{locale === "es" ? "Portabilidad:" : "Portability:"}</span> {locale === "es" ? "Derecho a recibir su información personal en un formato estructurado y transferible." : "Right to receive your personal information in a structured and transferable format."}</li>
              <li><span className="font-medium">{locale === "es" ? "Objeción:" : "Objection:"}</span> {locale === "es" ? "Derecho a oponerse al procesamiento de su información personal." : "Right to object to the processing of your personal information."}</li>
              <li><span className="font-medium">{locale === "es" ? "Revocación del consentimiento:" : "Revocation of consent:"}</span> {locale === "es" ? "Derecho a retirar su consentimiento en cualquier momento." : "Right to withdraw your consent at any time."}</li>
            </ul>
            <p className="mt-4">
              {locale === "es" ? "Para ejercer cualquiera de estos derechos, contacte con nosotros utilizando la información proporcionada al final de esta política." : "To exercise any of these rights, contact us using the information provided at the end of this policy."}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">8. {locale === "es" ? "Cookies y tecnologías similares" : "Cookies and similar technologies"}</h2>
            <p>
              {locale === "es" ? "Utilizamos cookies y tecnologías similares para varios propósitos relacionados con la funcionalidad de nuestra plataforma:" : "We use cookies and similar technologies for various purposes related to the functionality of our platform:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li><span className="font-medium">{locale === "es" ? "Cookies esenciales:" : "Essential cookies:"}</span> {locale === "es" ? "Necesarias para el funcionamiento básico del sitio y el sistema de inicio de sesión." : "Necessary for the basic operation of the site and the login system."}</li>
              <li><span className="font-medium">{locale === "es" ? "Cookies de sesión:" : "Session cookies:"}</span> {locale === "es" ? "Mantienen su sesión activa mientras utiliza nuestros servicios." : "Maintain your active session while using our services."}</li>
              <li><span className="font-medium">{locale === "es" ? "Cookies de seguridad:" : "Security cookies:"}</span> {locale === "es" ? "Ayudan a detectar actividades fraudulentas y proteger su cuenta." : "Help detect fraudulent activities and protect your account."}</li>
              <li><span className="font-medium">{locale === "es" ? "Cookies analíticas:" : "Analytics cookies:"}</span> {locale === "es" ? "Nos permiten comprender cómo los usuarios interactúan con nuestra plataforma." : "Allow us to understand how users interact with our platform."}</li>
            </ul>
            <p className="mt-4">
              {locale === "es" ? "Puede gestionar sus preferencias de cookies a través de la configuración de su navegador, aunque deshabilitar ciertas cookies puede afectar a la funcionalidad de nuestros servicios." : "You can manage your cookie preferences through your browser settings, although disabling certain cookies may affect the functionality of our services."}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">9. {locale === "es" ? "Privacidad de menores" : "Children's privacy"}</h2>
            <p>
              {locale === "es" ? "Nuestros servicios no están dirigidos a personas menores de 18 años. No recopilamos conscientemente información personal de menores. Si descubrimos que hemos recopilado información personal de un menor sin verificación del consentimiento parental, tomaremos medidas para eliminar esa información lo antes posible." : "Our services are not directed to persons under the age of 18. We do not knowingly collect personal information from minors. If we discover that we have collected personal information from a minor without parental consent, we will take measures to delete that information as soon as possible."}
            </p>
            <p className="mt-4">
              {locale === "es" ? "Si es padre o tutor y cree que su hijo nos ha proporcionado información personal, contáctenos para que podamos tomar las medidas apropiadas." : "If you are a parent or guardian and believe that your child has provided personal information to us, please contact us so that we can take the appropriate measures."}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">10. {locale === "es" ? "Transferencias internacionales de datos" : "International data transfers"}</h2>
            <p>
              {locale === "es" ? "Sus datos personales pueden ser transferidos y procesados en países distintos a aquel en el que reside. Estos países pueden tener leyes de protección de datos diferentes a las de su país." : "Your personal data may be transferred and processed in countries different from the one in which you reside. These countries may have different data protection laws than those of your country."}
            </p>
            <p className="mt-4">
              {locale === "es" ? "Cuando transferimos sus datos a otros países, implementamos salvaguardias apropiadas para garantizar que su información siga protegida de acuerdo con esta Política de Privacidad, como:" : "When we transfer your data to other countries, we implement appropriate safeguards to ensure that your information remains protected in accordance with this Privacy Policy, such as:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Transferencias a países con decisiones de adecuación." : "Transfers to countries with adequacy decisions."}</li>
              <li>{locale === "es" ? "Utilización de cláusulas contractuales estándar aprobadas." : "Use of approved standard contractual clauses."}</li>
              <li>{locale === "es" ? "Implementación de medidas adicionales técnicas y organizativas cuando sea necesario." : "Implementation of additional technical and organizational measures when necessary."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">11. {locale === "es" ? "Cambios a esta política" : "Changes to this policy"}</h2>
            <p>
              {locale === "es" ? "Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas o por otros motivos operativos, legales o regulatorios." : "We may periodically update this Privacy Policy to reflect changes in our practices or for other operational, legal, or regulatory reasons."}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Las modificaciones entrarán en vigor una vez publicada la Política de Privacidad actualizada." : "Modifications will take effect once the updated Privacy Policy is published."}</li>
              <li>{locale === "es" ? "Para cambios significativos, le notificaremos mediante un aviso visible en nuestra plataforma o enviando un correo electrónico." : "For significant changes, we will notify you through a visible notice on our platform or by sending an email."}</li>
              <li>{locale === "es" ? "Le recomendamos revisar esta política periódicamente para estar informado sobre cómo protegemos su información." : "We recommend reviewing this policy periodically to stay informed about how we protect your information."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">12. {locale === "es" ? "Contacto" : "Contact"}</h2>
            <p>
              {locale === "es" ? "Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el procesamiento de sus datos personales, puede contactarnos a través de:" : "If you have questions, concerns, or requests related to this Privacy Policy or the processing of your personal data, you can contact us through:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Correo electrónico: info@handmadeart.store" : "Email: info@handmadeart.store"}</li>
              <li>{locale === "es" ? "Formulario de contacto en nuestra plataforma" : "Contact form on our platform"}</li>
              <li>{locale === "es" ? "Dirección postal: [Dirección física de la empresa]" : "Postal address: [Physical address of the company]"}</li>
            </ul>
            <p className="mt-4">
              {locale === "es" ? "Nos comprometemos a responder a cualquier consulta o solicitud dentro de un plazo razonable y, en cualquier caso, dentro de los plazos establecidos por la ley aplicable." : "We commit to responding to any inquiries or requests within a reasonable time frame and, in any case, within the time limits established by applicable law."}
            </p>
          </section>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-700 font-medium">
              {locale === "es" ? "Al utilizar nuestros servicios, usted reconoce que ha leído y comprendido esta Política de Privacidad." : "By using our services, you acknowledge that you have read and understood this Privacy Policy."}
            </p>
            <p className="text-gray-600 mt-2">
              {locale === "es" ? "Esta política está específicamente diseñada para un sistema minimalista de inicio de sesión que asocia su perfil únicamente con información básica como pedidos y preferencias." : "This policy is specifically designed for a minimal login system that associates your profile uniquely with basic information such as orders and preferences."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}