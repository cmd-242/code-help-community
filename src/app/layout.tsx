import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SoundProvider } from "@/features/sound/sound-provider";
import { fredoka, jetbrains, nunito, signal } from "./fonts";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: { default: t("title"), template: `%s · ${t("short")}` },
    description: t("description"),
  };
}

export const viewport: Viewport = {
  themeColor: "#2ec4d6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" data-universe="archipel" className={`${fredoka.variable} ${nunito.variable} ${jetbrains.variable} ${signal.variable} h-full antialiased`}>
      <body className="min-h-full">
        <NextIntlClientProvider>
          <SoundProvider>{children}</SoundProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
