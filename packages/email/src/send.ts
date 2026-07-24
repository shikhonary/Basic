import { resend } from "./client";
import { WelcomeEmail } from "./emails/WelcomeEmail";
import { VerificationEmail } from "./emails/VerificationEmail";
import { ResetPasswordEmail } from "./emails/ResetPasswordEmail";
import React from "react";

// Use custom verified domain if provided, otherwise fallback to Resend testing domain
const DEFAULT_FROM = process.env.EMAIL_FROM || process.env.RESEND_FROM || "onboarding@resend.dev";

export const sendWelcomeEmail = async ({
  to,
  name,
}: {
  to: string;
  name: string;
}) => {
  try {
    const response = await resend.emails.send({
      from: DEFAULT_FROM,
      to,
      subject: "Welcome to our platform!",
      react: React.createElement(WelcomeEmail, { name }),
    });
    if (response.error) {
      console.error("[Resend Error] Failed to send welcome email:", response.error);
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: { message: error?.message || String(error) } };
  }
};

export const sendVerificationEmail = async ({
  to,
  name,
  url,
}: {
  to: string;
  name: string;
  url: string;
}) => {
  try {
    console.log(`[Email] Sending verification email to ${to} from ${DEFAULT_FROM}...`);
    const response = await resend.emails.send({
      from: DEFAULT_FROM,
      to,
      subject: "Verify your email address",
      react: React.createElement(VerificationEmail, { name, url }),
    });
    if (response.error) {
      console.error("[Resend Error] Failed to send verification email:", response.error);
      return { success: false, error: response.error };
    }
    console.log(`[Email] Verification email sent successfully to ${to}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return { success: false, error: { message: error?.message || String(error) } };
  }
};

export const sendResetPasswordEmail = async ({
  to,
  name,
  url,
}: {
  to: string;
  name: string;
  url: string;
}) => {
  try {
    const response = await resend.emails.send({
      from: DEFAULT_FROM,
      to,
      subject: "Reset your password",
      react: React.createElement(ResetPasswordEmail, { name, url }),
    });
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error sending reset password email:", error);
    return { success: false, error: { message: error?.message || String(error) } };
  }
};

