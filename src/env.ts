import "server-only";
import { z } from "zod";

/**
 * Variables d'environnement, validées à la première utilisation (règle n°6).
 * Lecture paresseuse : le build ne casse pas si une variable optionnelle manque.
 */
const schema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(16, "BETTER_AUTH_SECRET doit faire au moins 16 caractères"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof schema>;

let cached: Env | null = null;

export function env(): Env {
  if (!cached) {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
      throw new Error(`Configuration invalide :\n${parsed.error.issues.map((i) => `- ${i.path.join(".")} : ${i.message}`).join("\n")}`);
    }
    cached = parsed.data;
  }
  return cached;
}

/** La connexion Google est proposée seulement si ses identifiants sont configurés. */
export function googleEnabled(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
