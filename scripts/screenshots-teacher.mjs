// Captures de l'espace enseignant (CI). Suppose le serveur lancé sur :3000 et la base alimentée par `pnpm db:seed`.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

const require = createRequire("/tmp/pw/");
const { chromium } = require("playwright");
const base = "http://localhost:3000";
mkdirSync("screenshots", { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const res = await context.request.post(`${base}/api/auth/sign-in/email`, {
  headers: { Origin: base },
  data: { email: "prof@demo.test", password: "demo-password-123" },
});
if (!res.ok()) throw new Error(`connexion enseignant: ${res.status()}`);

const page = await context.newPage();
await page.goto(`${base}/prof`, { waitUntil: "networkidle" });
await page.screenshot({ path: "screenshots/prof-accueil.png", fullPage: true });

const href = await page.locator('a[href^="/prof/classes/"]').first().getAttribute("href");
if (!href) throw new Error("aucune classe trouvée");
await page.goto(`${base}${href}`, { waitUntil: "networkidle" });
await page.screenshot({ path: "screenshots/prof-etudiants.png", fullPage: true });

await page.getByRole("tab", { name: /Planning/ }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "screenshots/prof-planning.png", fullPage: true });

await page.setViewportSize({ width: 360, height: 780 });
await page.goto(`${base}${href}`, { waitUntil: "networkidle" });
await page.screenshot({ path: "screenshots/prof-etudiants-mobile.png", fullPage: true });

await browser.close();
