"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GameButton } from "@/components/ui/game-button";
import { authClient } from "@/lib/auth-client";

type Mode = "signin" | "signup";

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const signupSchema = signinSchema.extend({
  name: z.string().trim().min(2).max(60),
});
type Values = z.infer<typeof signupSchema>;

export function AuthForm({ mode, google }: { mode: Mode; google: boolean }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(mode === "signup" ? signupSchema : (signinSchema as unknown as typeof signupSchema)),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: Values) => {
    setError(null);
    const result =
      mode === "signup"
        ? await authClient.signUp.email({ name: values.name, email: values.email, password: values.password })
        : await authClient.signIn.email({ email: values.email, password: values.password });
    if (result.error) {
      const code = result.error.code ?? "";
      setError(
        code.includes("USER_ALREADY_EXISTS")
          ? t("errorExists")
          : code.includes("INVALID_EMAIL_OR_PASSWORD")
            ? t("errorCredentials")
            : t("errorGeneric"),
      );
      return;
    }
    router.push("/app");
    router.refresh();
  };

  const field = "w-full rounded-2xl bg-surface px-4 py-3.5 text-lg shadow-[0_0_0_2px_var(--color-line)] outline-none focus:shadow-[0_0_0_3px_var(--color-info-deep)]";

  return (
    <div>
      {google && (
        <>
          <GameButton
            variant="secondary"
            className="w-full"
            onClick={() => void authClient.signIn.social({ provider: "google", callbackURL: "/app" })}
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
              <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h5.9a5 5 0 01-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8.1z" />
              <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0012 23z" />
              <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 010-4.3V7.1H2.1a11 11 0 000 9.9z" />
              <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.6l3.2-3.2A11 11 0 002.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
            </svg>
            {t("google")}
          </GameButton>
          <p className="my-5 text-center text-sm font-bold text-muted">{t("or")}</p>
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {mode === "signup" && (
          <div>
            <label htmlFor="name" className="mb-1.5 block font-bold">
              {t("name")}
            </label>
            <input id="name" autoComplete="nickname" className={field} aria-invalid={Boolean(errors.name)} {...register("name")} />
            {errors.name && <p className="mt-1 text-sm font-bold text-danger-text">{t("nameError")}</p>}
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1.5 block font-bold">
            {t("email")}
          </label>
          <input id="email" type="email" autoComplete="email" inputMode="email" className={field} aria-invalid={Boolean(errors.email)} {...register("email")} />
          {errors.email && <p className="mt-1 text-sm font-bold text-danger-text">{t("emailError")}</p>}
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block font-bold">
            {t("password")}
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className={field}
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password ? (
            <p className="mt-1 text-sm font-bold text-danger-text">{t("passwordError")}</p>
          ) : (
            mode === "signup" && <p className="mt-1 text-sm text-muted">{t("passwordHint")}</p>
          )}
        </div>
        {error && (
          <p role="alert" className="rounded-2xl bg-primary/12 px-4 py-3 font-bold text-danger-text">
            {error}
          </p>
        )}
        <GameButton type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("pending") : mode === "signup" ? t("signupSubmit") : t("signinSubmit")}
        </GameButton>
      </form>

      <p className="mt-6 text-center">
        {mode === "signup" ? t("haveAccount") : t("noAccount")}{" "}
        <Link href={mode === "signup" ? "/connexion" : "/inscription"} className="font-bold text-info-deep underline underline-offset-4">
          {mode === "signup" ? t("toSignin") : t("toSignup")}
        </Link>
      </p>
    </div>
  );
}
