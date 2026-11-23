import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/server/auth";

// Point d'entrée de l'authentification (Better Auth) : inscription, connexion, Google, session.
export const { GET, POST } = toNextJsHandler(auth);
