"use client";

import { createAuthClient } from "better-auth/react";

/** Client d'authentification côté navigateur (même origine que l'application). */
export const authClient = createAuthClient();
