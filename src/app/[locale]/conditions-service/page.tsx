import React from 'react';
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
type tParams = Promise<{  locale: string }>;
export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";
  
  const pageTitle = currentLocale === 'es' ? 'Términos y Condiciones' : 'Terms and Conditions';

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/conditions-service`,
    title: pageTitle,
  });
}

export default async function TerminosCondicionesPage({ params }: { params: tParams }) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-2">
            {locale === "es" ? "Términos y Condiciones de Servicio" : "Terms and Conditions"}
          </h1>
          <p className="text-gray-600 text-center">
            {locale === "es" ? "Última actualización: 9 de abril de 2025" : "Last updated: April 9, 2025"}
          </p>
        </div>

        <div className="px-6 py-8 prose prose-gray max-w-none text-gray-700 leading-relaxed">
          <div className="mb-12">
            <p className="text-lg font-medium">
              {locale === "es" ? "Bienvenido a nuestro servicio. Estos Términos y Condiciones (&ldquo;Términos&rdquo;) constituyen un acuerdo legal entre usted y nuestra plataforma de autenticación. Lea detenidamente estos Términos antes de utilizar nuestro sistema de inicio de sesión." : "Welcome to our service. These Terms and Conditions (&ldquo;Terms&rdquo;) constitute a legal agreement between you and our authentication platform. Read these Terms carefully before using our login system."}
            </p>
            <p>
              {locale === "es" ? "Al registrarse, acceder o utilizar nuestros servicios de autenticación, usted acepta estar legalmente vinculado por estos Términos. Si no está de acuerdo con alguna parte de estos Términos, le pedimos que no utilice nuestros servicios." : "By registering, accessing or using our authentication services, you accept being legally bound by these Terms. If you do not agree with any part of these Terms, we ask you not to use our services."}
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">{locale === "es" ? "Definiciones" : "Definitions"}</h2>
            <ul className="space-y-4 pl-5 list-disc">
              <li>
                <span className="font-medium">{locale === "es" ? "Servicio:" : "Service:"}</span> {locale === "es" ? "Sistema de autenticación e inicio de sesión que facilita el acceso a nuestra plataforma mediante credenciales de usuario." : "Authentication and login system that facilitates access to our platform through user credentials."}
              </li>
              <li>
                <span className="font-medium">{locale === "es" ? "Usuario:" : "User:"}</span> {locale === "es" ? "Cualquier persona que acceda, se registre o utilice nuestro sistema de autenticación." : "Any person who accesses, registers or uses our authentication system."}
              </li>
              <li>
                <span className="font-medium">{locale === "es" ? "Credenciales:" : "Credentials:"}</span> {locale === "es" ? "Información que permite identificar y verificar la identidad del usuario, principalmente correo electrónico y contraseña." : "Information that allows identifying and verifying the user's identity, mainly email and password."}
              </li>
              <li>
                <span className="font-medium">{locale === "es" ? "Datos de perfil:" : "Profile data:"}</span> {locale === "es" ? "Información mínima asociada a su cuenta, como correo electrónico e imagen de perfil." : "Minimum information associated with your account, such as email and profile picture."}
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">2. {locale === "es" ? "Registro y Cuenta de Usuario" : "Registration and User Account"}</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">2.1 {locale === "es" ? "Proceso de Registro" : "Registration Process"}</h3>
            <p>
              {locale === "es" ? "Para acceder a nuestros servicios, deberá crear una cuenta proporcionando un correo electrónico válido. El proceso de registro está diseñado para ser simple y requerir únicamente información esencial:" : "To access our services, you must create an account by providing a valid email address. The registration process is designed to be simple and require only essential information:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Un correo electrónico válido que será su identificador principal." : "A valid email address that will be your primary identifier."}</li>
              <li>{locale === "es" ? "Una contraseña que cumpla con nuestros requisitos mínimos de seguridad." : "A password that meets our minimum security requirements."}</li>
              <li>{locale === "es" ? "Opcionalmente, una imagen de perfil que podrá agregar o modificar posteriormente." : "Optionally, a profile picture that you can add or modify later."}</li>
            </ul>
            <p className="mt-4">
              {locale === "es" ? "Al registrarse, usted declara y garantiza que:" : "By registering, you declare and guarantee that:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Tiene al menos 18 años de edad o cuenta con el consentimiento de sus padres o tutores legales." : "You are at least 18 years old or have the consent of your parents or legal guardians."}</li>
              <li>{locale === "es" ? "La información proporcionada es precisa, veraz, actual y completa." : "The information provided is accurate, true, current, and complete."}</li>
              <li>{locale === "es" ? "El correo electrónico proporcionado le pertenece legítimamente." : "The email address provided belongs to you legitimately."}</li>
              <li>{locale === "es" ? "No está suplantando la identidad de otra persona o entidad." : "You are not impersonating another person or entity."}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2.2 {locale === "es" ? "Seguridad de la Cuenta" : "Account Security"}</h3>
            <p>
              {locale === "es" ? "La seguridad de su cuenta es fundamental para nosotros, pero también depende en gran medida de sus acciones. Para mantener su cuenta segura:" : "The security of your account is fundamental for us, but it also depends to a great extent on your actions. To keep your account secure:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Utilice una contraseña única y robusta que no emplee en otros servicios." : "Use a unique and strong password that you do not use in other services."}</li>
              <li>{locale === "es" ? "Mantenga la confidencialidad de sus credenciales de acceso en todo momento." : "Maintain the confidentiality of your access credentials at all times."}</li>
              <li>{locale === "es" ? "No comparta su contraseña o información de inicio de sesión con terceros." : "Do not share your password or login information with third parties."}</li>
              <li>{locale === "es" ? "Cierre sesión después de utilizar nuestros servicios, especialmente en dispositivos compartidos." : "Log out after using our services, especially on shared devices."}</li>
              <li>{locale === "es" ? "Notifíquenos inmediatamente si detecta actividad sospechosa o accesos no autorizados a su cuenta." : "Notify us immediately if you detect suspicious activity or unauthorized access to your account."}</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2.3 {locale === "es" ? "Responsabilidad de la Cuenta" : "Account Responsibility"}</h3>
            <p>
              {locale === "es" ? "Usted es plenamente responsable de todas las actividades realizadas bajo su cuenta. Nos reservamos el derecho de:" : "You are fully responsible for all activities carried out under your account. We reserve the right to:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Suspender o cancelar cuentas con actividades sospechosas o que violen estos Términos." : "Suspend or cancel accounts with suspicious activities or that violate these Terms."}</li>
              <li>{locale === "es" ? "Solicitar información adicional para verificar su identidad en caso de actividades inusuales." : "Request additional information to verify your identity in case of unusual activities."}</li>
              <li>{locale === "es" ? "Implementar medidas de seguridad adicionales como autenticación de dos factores en el futuro." : "Implement additional security measures such as two-factor authentication in the future."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">3. {locale === "es" ? "Sistema de Inicio de Sesión" : "Login System"}</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">3.1 {locale === "es" ? "Proceso de Autenticación" : "Authentication Process"}</h3>
            <p>
              {locale === "es" ? "Nuestro sistema de inicio de sesión está diseñado para ser seguro y sencillo:" : "Our login system is designed to be secure and simple:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "El inicio de sesión requiere únicamente su correo electrónico y contraseña." : "The login process requires only your email address and password."}</li>
              <li>{locale === "es" ? "Podremos implementar métodos adicionales de verificación para proteger su cuenta." : "We may implement additional verification methods to protect your account."}</li>
              <li>{locale === "es" ? "Utilizamos conexiones seguras (HTTPS) para transmitir sus credenciales." : "We use secure connections (HTTPS) to transmit your credentials."}</li>
              <li>{locale === "es" ? "Sus datos de inicio de sesión son procesados mediante técnicas de cifrado modernas." : "Your login data is processed using modern encryption techniques."}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">3.2 {locale === "es" ? "Sesiones Activas" : "Active Sessions"}</h3>
            <p>
              {locale === "es" ? "Para su comodidad y seguridad:" : "For your convenience and security:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Las sesiones tienen un tiempo de expiración por inactividad." : "Sessions have an expiration time due to inactivity."}</li>
              <li>{locale === "es" ? "Podrá ver y gestionar sus sesiones activas en su perfil de usuario." : "You can view and manage your active sessions in your user profile."}</li>
              <li>{locale === "es" ? "Tiene la capacidad de cerrar remotamente sesiones en otros dispositivos." : "You have the ability to remotely close sessions on other devices."}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">3.3 {locale === "es" ? "Recuperación de Acceso" : "Access Recovery"}</h3>
            <p>
              {locale === "es" ? "Si olvida su contraseña o tiene dificultades para acceder:" : "If you forget your password or have difficulty accessing it:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Puede solicitar el restablecimiento de su contraseña en cualquier momento." : "You can request a password reset at any time."}</li>
              <li>{locale === "es" ? "El proceso de recuperación se realiza a través de un enlace seguro enviado a su correo electrónico." : "The recovery process is carried out through a secure link sent to your email address."}</li>
              <li>{locale === "es" ? "Los enlaces de restablecimiento tienen una validez limitada por seguridad." : "The reset links have a limited validity for security."}</li>
              <li>{locale === "es" ? "En caso de no tener acceso a su correo electrónico, contáctenos para asistencia especializada." : "In case you do not have access to your email, contact us for specialized assistance."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">4. {locale === "es" ? "Datos de Usuario y Privacidad" : "User Data and Privacy"}</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">4.1 {locale === "es" ? "Datos Recopilados" : "Collected Data"}</h3>
            <p>
              {locale === "es" ? "Nuestro sistema de autenticación recopila únicamente la información esencial para su funcionamiento:" : "Our authentication system collects only the essential information for its operation:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Correo electrónico como identificador principal de la cuenta." : "Email as the main identifier of the account."}</li>
              <li>{locale === "es" ? "Contraseña (almacenada de forma segura mediante técnicas de hash)." : "Password (stored securely using hash techniques)."}</li>
              <li>{locale === "es" ? "Imagen de perfil (opcional)." : "Profile picture (optional)."}</li>
              <li>{locale === "es" ? "Datos técnicos básicos como dirección IP, tipo de dispositivo y navegador para seguridad y estadísticas." : "Basic technical data such as IP address, device type, and browser for security and statistics."}</li>
              <li>{locale === "es" ? "Registros de inicio de sesión para protección de su cuenta." : "Login records for your account protection."}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4.2 {locale === "es" ? "Uso de los Datos" : "Use of Data"}</h3>
            <p>
              {locale === "es" ? "Los datos recopilados se utilizan exclusivamente para:" : "The collected data is used exclusively for:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Facilitar el proceso de autenticación y acceso seguro." : "Facilitating the authentication process and secure access."}</li>
              <li>{locale === "es" ? "Identificarle dentro de nuestro sistema." : "Identifying you within our system."}</li>
              <li>{locale === "es" ? "Proteger su cuenta de accesos no autorizados." : "Protecting your account from unauthorized access."}</li>
              <li>{locale === "es" ? "Comunicarnos con usted sobre asuntos de seguridad o cambios importantes." : "Communicating with you about security matters or important changes."}</li>
              <li>{locale === "es" ? "Cumplir con obligaciones legales cuando sea necesario." : "Complying with legal obligations when necessary."}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4.3 {locale === "es" ? "Protección de Datos" : "Data Protection"}</h3>
            <p>
              {locale === "es" ? "Su privacidad es importante para nosotros:" : "Your privacy is important to us:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Implementamos medidas técnicas y organizativas para proteger sus datos." : "We implement technical and organizational measures to protect your data."}</li>
              <li>{locale === "es" ? "No compartimos su información con terceros sin su consentimiento explícito." : "We do not share your information with third parties without your explicit consent."}</li>
              <li>{locale === "es" ? "Aplicamos los principios de minimización de datos, recopilando solo lo estrictamente necesario." : "We apply the principles of data minimization, collecting only what is strictly necessary."}</li>
              <li>{locale === "es" ? "Puede solicitar acceso, corrección o eliminación de sus datos personales en cualquier momento." : "You can request access, correction, or deletion of your personal data at any time."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">5. {locale === "es" ? "Uso Aceptable" : "Acceptable Use"}</h2>
            <p>
              {locale === "es" ? "Al utilizar nuestro sistema de autenticación, usted se compromete a:" : "When using our authentication system, you commit to:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "No intentar acceder a cuentas que no le pertenecen." : "Not trying to access accounts that do not belong to you."}</li>
              <li>{locale === "es" ? "No realizar intentos de fuerza bruta u otros ataques contra nuestro sistema." : "Not performing brute force attacks or other attacks against our system."}</li>
              <li>{locale === "es" ? "No utilizar herramientas automatizadas para crear cuentas falsas o iniciar sesión." : "Not using automated tools to create fake accounts or log in."}</li>
              <li>{locale === "es" ? "No utilizar nuestros servicios para actividades ilegales o fraudulentas." : "Not using our services for illegal or fraudulent activities."}</li>
              <li>{locale === "es" ? "No intentar eludir, desactivar o interferir con las medidas de seguridad." : "Not trying to bypass, disable, or interfere with security measures."}</li>
              <li>{locale === "es" ? "No realizar acciones que puedan comprometer la estabilidad o seguridad de nuestro sistema." : "Not performing actions that could compromise the stability or security of our system."}</li>
              <li>{locale === "es" ? "No compartir públicamente sus credenciales de acceso." : "Not sharing your access credentials publicly."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">6. {locale === "es" ? "Modificaciones y Comunicaciones" : "Modifications and Communications"}</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">6.1 {locale === "es" ? "Modificaciones a los Términos" : "Modifications to the Terms"}</h3>
            <p>
              {locale === "es" ? "Nos reservamos el derecho de modificar estos Términos en cualquier momento:" : "We reserve the right to modify these Terms at any time:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Las modificaciones entrarán en vigor al publicarse en esta página." : "Modifications will take effect upon publication on this page."}</li>
              <li>{locale === "es" ? "Para cambios sustanciales, notificaremos a los usuarios mediante el correo electrónico registrado." : "For significant changes, we will notify users via the registered email address."}</li>
              <li>{locale === "es" ? "El uso continuado de nuestros servicios después de dichos cambios constituye su aceptación de los mismos." : "Continued use of our services after such changes constitutes your acceptance of them."}</li>
              <li>{locale === "es" ? "Le recomendamos revisar estos Términos periódicamente." : "We recommend periodically reviewing these Terms."}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">6.2 {locale === "es" ? "Comunicaciones" : "Communications"}</h3>
            <p>
              {locale === "es" ? "Para comunicaciones importantes:" : "For important communications:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Utilizaremos principalmente su correo electrónico registrado." : "We will primarily use your registered email address."}</li>
              <li>{locale === "es" ? "Es su responsabilidad mantener actualizada su dirección de correo electrónico." : "It is your responsibility to keep your email address updated."}</li>
              <li>{locale === "es" ? "Las notificaciones importantes incluyen alertas de seguridad, cambios en los Términos o confirmaciones de acceso." : "Important notifications include security alerts, changes to the Terms, or access confirmations."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">7. {locale === "es" ? "Terminación" : "Termination"}</h2>
            <p>
              {locale === "es" ? "Nos reservamos el derecho de:" : "We reserve the right to:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Suspender o cancelar su cuenta si viola estos Términos." : "Suspend or cancel your account if you violate these Terms."}</li>
              <li>{locale === "es" ? "Restringir el acceso a usuarios que representen un riesgo para la plataforma." : "Restrict access to users who represent a risk to the platform."}</li>
              <li>{locale === "es" ? "Eliminar cuentas inactivas después de un período prolongado de inactividad." : "Delete inactive accounts after a prolonged period of inactivity."}</li>
            </ul>
            <p className="mt-4">
              {locale === "es" ? "Usted puede solicitar la eliminación de su cuenta en cualquier momento, lo que resultará en la eliminación permanente de sus datos de perfil conforme a nuestra política de retención." : "You can request the deletion of your account at any time, which will result in the permanent deletion of your profile data in accordance with our retention policy."}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">8. {locale === "es" ? "Limitación de Responsabilidad" : "Limitation of Liability"}</h2>
            <p>
              {locale === "es" ? "En la máxima medida permitida por la ley aplicable:" : "To the maximum extent permitted by applicable law:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "No garantizamos que el servicio sea ininterrumpido o libre de errores." : "We do not guarantee that the service will be uninterrupted or free of errors."}</li>
              <li>{locale === "es" ? "No somos responsables de pérdidas o daños resultantes del uso o imposibilidad de uso del servicio." : "We are not liable for losses or damages resulting from the use or inability to use the service."}</li>
              <li>{locale === "es" ? "No asumimos responsabilidad por accesos no autorizados cuando se deban a negligencia en la protección de credenciales." : "We do not assume liability for unauthorized access when resulting from negligence in credential protection."}</li>
              <li>{locale === "es" ? "Implementamos medidas de seguridad razonables, pero ningún sistema de seguridad es infalible." : "We implement reasonable security measures, but no security system is infallible."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">9. {locale === "es" ? "Disposiciones Generales" : "General Dispositions"}</h2>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Estos Términos constituyen el acuerdo completo entre usted y nosotros respecto al uso del sistema de autenticación." : "These Terms constitute the complete agreement between you and us regarding the use of the authentication system."}</li>
              <li>{locale === "es" ? "Si alguna disposición de estos Términos se considera inválida, las demás disposiciones seguirán siendo válidas y aplicables." : "If any provision of these Terms is considered invalid, the remaining provisions will remain valid and enforceable."}</li>
              <li>{locale === "es" ? "Nuestro sistema de autenticación está diseñado para ser simple y recopilar solo la información esencial." : "Our authentication system is designed to be simple and collect only essential information."}</li>
              <li>{locale === "es" ? "La falta de ejercicio de un derecho no constituye una renuncia a dicho derecho." : "The failure to exercise a right does not constitute a waiver of such right."}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6">10. {locale === "es" ? "Contacto" : "Contact"}</h2>
            <p>
              {locale === "es" ? "Si tiene preguntas, inquietudes o necesita asistencia relacionada con estos Términos o nuestro sistema de autenticación, puede contactarnos a través de:" : "If you have questions, concerns, or need assistance related to these Terms or our authentication system, you can contact us through:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc mt-4">
              <li>{locale === "es" ? "Nuestro formulario de contacto en la página principal." : "Our contact form on the main page."}</li>
              <li>{locale === "es" ? "Correo electrónico de soporte: soporte@nuestrodominio.com" : "Support email: support@ourdomain.com"}</li>
              <li>{locale === "es" ? "Sección de ayuda dentro de nuestra plataforma." : "Help section within our platform."}</li>
            </ul>
            <p className="mt-4">
              {locale === "es" ? "Nos esforzamos por responder a todas las consultas en un plazo máximo de 48 horas hábiles." : "We strive to respond to all inquiries within a maximum of 48 business hours."}
            </p>
          </section>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-700 font-medium">
              {locale === "es" ? "Al registrarse, acceder o utilizar nuestro sistema de autenticación, usted acepta estos Términos de Servicio en su totalidad." : "By registering, accessing or using our authentication system, you accept these Terms of Service in their entirety."}
            </p>
            <p className="text-gray-600 mt-2">
              {locale === "es" ? "Estos Términos están diseñados específicamente para un sistema de autenticación minimalista que recopila solo información esencial como correo electrónico e imagen de perfil." : "These Terms are specifically designed for a minimal authentication system that collects only essential information such as email and profile picture."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}