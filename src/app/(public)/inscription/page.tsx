import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthPage } from "@/features/account/auth-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("signupTitle") };
}

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
