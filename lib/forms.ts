/** Shape shared between the newsletter server action and its client form. */
export interface NewsletterState {
  readonly status: "idle" | "invalid" | "unavailable";
  readonly message: string;
}