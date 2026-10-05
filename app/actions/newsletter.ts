"use server";

import type { NewsletterState } from "@/lib/forms";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function subscribeToNewsletter(
  _previous: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "invalid", message: "That does not look like a valid email address." };
  }

  // No list provider or database is wired up yet. Returning an explicit state
  // keeps the form honest instead of showing a confirmation for a signup that
  // never happened. Replace this body once persistence exists.
  return {
    status: "unavailable",
    message:
      "Thanks — that address is valid, but newsletter delivery isn't connected in this build. Nothing was stored or sent.",
  };
}