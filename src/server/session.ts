import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";

/** Session courante, ou null pour un visiteur (l'apprentissage reste possible sans compte). */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Connexion requise.");
  }
}

/** Identifiant de l'apprenant connecté, sinon erreur. Première étape de toute Server Action protégée. */
export async function requireUserId(): Promise<string> {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session.user.id;
}
