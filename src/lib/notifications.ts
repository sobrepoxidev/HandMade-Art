/**
 * Internal notification targets shared by the quote pipeline
 * (create-interest-request, update-quote, send-quote-email).
 *
 * Set MANAGER_NOTIFICATION_EMAIL in Vercel to point notifications at the
 * real owner inbox; falls back to the legacy address so nothing breaks
 * before it is configured.
 */
export function getManagerNotificationEmail(): string {
  return process.env.MANAGER_NOTIFICATION_EMAIL || "sobrepoxidev@gmail.com";
}
