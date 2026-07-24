import { Resend } from "resend";

function createResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not defined in environment. Email functionality will be unavailable until set.");
  }
  return new Resend(apiKey || "re_dummy_key_for_build");
}

let _resend: Resend | null = null;

export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    if (!_resend) {
      _resend = createResendClient();
    }
    const value = (_resend as any)[prop];
    if (typeof value === "function") {
      return value.bind(_resend);
    }
    return value;
  },
});

