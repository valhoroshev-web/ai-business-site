export type LeadDelivery = "email" | "telegram" | null;

/**
 * Email is the primary destination when the Resend credentials are present.
 * Telegram remains available for installations without email credentials.
 * This configuration is server-only and must not be imported from client components.
 */
export function getLeadDelivery(): LeadDelivery {
  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.RESEND_TO_EMAIL) return "email";
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) return "telegram";
  return null;
}

export function isLeadFormReady(): boolean {
  return (
    process.env.LEADS_ENABLED === "true" &&
    process.env.LEGAL_POLICY_APPROVED === "true" &&
    Boolean(
      getLeadDelivery() &&
        process.env.TURNSTILE_SECRET_KEY &&
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
        process.env.LEGAL_OPERATOR_NAME &&
        process.env.LEGAL_CONTACT_EMAIL &&
        process.env.LEGAL_OPERATOR_ADDRESS,
    )
  );
}
