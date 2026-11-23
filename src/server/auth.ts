import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { env, googleEnabled } from "@/env";
import { db } from "./db";

/**
 * Authentification : e-mail + mot de passe, et Google si configuré.
 * Un compte est toujours un apprenant ; les autres rôles s'ajoutent ensuite.
 */
export const auth = betterAuth({
  baseURL: env().BETTER_AUTH_URL,
  secret: env().BETTER_AUTH_SECRET,
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, minPasswordLength: 8, autoSignIn: true },
  socialProviders: googleEnabled()
    ? { google: { clientId: env().GOOGLE_CLIENT_ID!, clientSecret: env().GOOGLE_CLIENT_SECRET! } }
    : undefined,
  // nextCookies doit rester le dernier plugin : il pose les cookies depuis les Server Actions
  plugins: [nextCookies()],
});
