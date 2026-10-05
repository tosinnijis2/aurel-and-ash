"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import type { NewsletterState } from "@/lib/forms";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight } from "@/components/ui/icons";

const INITIAL: NewsletterState = { status: "idle", message: "" };

export function Newsletter() {
  const [state, action, pending] = useActionState(subscribeToNewsletter, INITIAL);

  return (
    <section id="newsletter" className="scroll-mt-24 border-b border-stone py-20 lg:py-28">
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="text-[11px] tracking-[0.24em] text-ash uppercase">Newsletter</p>
            <h2 className="mt-5 max-w-lg text-[clamp(1.75rem,4.2vw,2.9rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance">
              First look at every run, before it goes up.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
              One message per release. Fabric weights, production numbers and restock dates
              included. No countdown timers.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <form action={action} noValidate className="mt-2 lg:mt-8">
              <label
                htmlFor="newsletter-email"
                className="block text-[11px] tracking-[0.2em] text-ash uppercase"
              >
                Email address
              </label>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  aria-describedby="newsletter-status"
                  aria-invalid={state.status === "invalid"}
                  className="h-12 w-full border border-stone bg-bone px-4 text-[15px] text-ink placeholder:text-ash/70 focus:border-ink focus:outline-none aria-[invalid=true]:border-clay"
                />
                <Button type="submit" disabled={pending} className="shrink-0">
                  {pending ? "Checking" : "Subscribe"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <p
                id="newsletter-status"
                role="status"
                aria-live="polite"
                className={`mt-4 min-h-[1.25rem] text-[13px] leading-relaxed ${
                  state.status === "invalid" ? "text-clay" : "text-ink-soft"
                }`}
              >
                {state.message}
              </p>
            </form>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}