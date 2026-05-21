import { Resend } from 'resend';

export function createResendClient() {
  return new Resend(process.env.RESEND_API_KEY ?? '');
}

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'hello@example.com';
