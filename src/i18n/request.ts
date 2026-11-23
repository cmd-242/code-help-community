import { getRequestConfig } from "next-intl/server";

// Français uniquement pour l'instant ; l'anglais viendra en phase 3.
export default getRequestConfig(async () => {
  const locale = "fr";
  return {
    locale,
    timeZone: "Africa/Lagos",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
