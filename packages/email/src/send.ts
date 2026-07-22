import { resend } from "./client";
import { WelcomeEmail } from "./emails/WelcomeEmail";
import { VerificationEmail } from "./emails/VerificationEmail";
import { ResetPasswordEmail } from "./emails/ResetPasswordEmail";
import React from "react";

// For testing purposes, we use the default resend testing domain
const DEFAULT_FROM = "onboarding@resend.dev";

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
    const response = await resend.emails.send({
      from: DEFAULT_FROM,
      to,
      subject: "Verify your email address",
      react: React.createElement(VerificationEmail, { name, url }),
    });
    if (response.error) {
      return { success: false, error: response.error };
    }
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

