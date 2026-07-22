import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Img,
} from "@react-email/components";
import React from "react";

interface VerificationEmailProps {
  name: string;
  url: string;
}

export const VerificationEmail = ({ name, url }: VerificationEmailProps) => {
  const logoUrl = "https://nvewxsj7lc.ufs.sh/f/KBFRuJIDuGZHZhiJqnXvEK0O3V9lqQ6iMHhvsAcofty2xRpT";

  return (
    <Html>
      <Head />
      <Preview>Basic Education Care-এ আপনার ইমেইল ভেরিফাই করুন</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Brand Logo Header */}
          <Section style={header}>
            <Img
              src={logoUrl}
              alt="Basic Education Care Logo"
              width="150"
              height="auto"
              style={logo}
            />
          </Section>

          {/* Card Content */}
          <Section style={card}>
            <Text style={heading}>ইমেইল এড্রেসটি ভেরিফাই করুন</Text>
            
            <Text style={paragraph}>প্রিয় {name},</Text>
            
            <Text style={paragraph}>
              Basic Education Care-এ যুক্ত হওয়ার জন্য আপনাকে আন্তরিক অভিনন্দন! আপনার অ্যাকাউন্টটি সক্রিয় করতে এবং মূল ড্যাশবোর্ডে প্রবেশ করতে নিচের বোতামটিতে ক্লিক করে আপনার ইমেইল এড্রেসটি ভেরিফাই করে নিন:
            </Text>

            <Section style={buttonContainer}>
              <a href={url} style={button}>
                ইমেইল ভেরিফাই করুন
              </a>
            </Section>

            <Text style={paragraph}>
              যদি উপরের বোতামটি কাজ না করে, তাহলে নিচের লিংকটি কপি করে আপনার ব্রাউজারে পেস্ট করুন:
            </Text>
            
            <Text style={linkParagraph}>
              <Link href={url} style={link}>
                {url}
              </Link>
            </Text>

            <Text style={disclaimer}>
              আপনার নিরাপত্তার স্বার্থে এই ভেরিফিকেশন লিংকটির মেয়াদ মাত্র ১ ঘণ্টা থাকবে। আপনি যদি নিজে অ্যাকাউন্ট তৈরি না করে থাকেন, তাহলে এই ইমেইলটি উপেক্ষা করতে পারেন।
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © ২০২৬ Basic Education Care। সর্বস্বত্ব সংরক্ষিত।
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;

// Styling
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px 48px",
  maxWidth: "560px",
};

const header = {
  padding: "24px 0",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
  display: "block",
  borderRadius: "8px",
};

const card = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "40px 30px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
};

const heading = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#0f172a",
  lineHeight: "1.4",
  margin: "0 0 24px 0",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#334155",
  margin: "0 0 20px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#0284c7",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
  boxShadow: "0 2px 4px rgba(2, 132, 199, 0.2)",
};

const linkParagraph = {
  fontSize: "13px",
  margin: "0 0 24px 0",
  wordBreak: "break-all" as const,
};

const link = {
  color: "#0284c7",
  textDecoration: "underline",
};

const disclaimer = {
  fontSize: "13px",
  lineHeight: "1.5",
  color: "#64748b",
  borderTop: "1px solid #f1f5f9",
  paddingTop: "20px",
  margin: "24px 0 0 0",
};

const footer = {
  textAlign: "center" as const,
  padding: "24px 0 0",
};

const footerText = {
  fontSize: "12px",
  color: "#94a3b8",
  lineHeight: "1.5",
};
