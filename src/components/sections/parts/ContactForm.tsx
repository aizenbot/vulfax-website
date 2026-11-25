"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "motion/react";
import { CircleAlert, CircleCheck, Info, LoaderCircle, Send } from "lucide-react";
import { useId, useState } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { EASE_OUT_EXPO } from "@/lib/constants";
import { cn, openExternalUrl } from "@/lib/utils";
import {
  buildMailtoHref,
  contactSchema,
  isContactErrorCode,
  type ContactData,
  type ContactInput,
} from "@/lib/validation";
import type { ContactFormCopy } from "@/types/content";
import type { ContactStatus } from "@/types/site";

interface ContactFormProps {
  copy: ContactFormCopy;
  /** True when the server has an email provider configured. */
  deliveryEnabled: boolean;
  /** Public inbox used for the mailto fallback; null when not configured. */
  contactEmail: string | null;
  subjectPrefix: string;
}

const inputClasses =
  "w-full rounded-xl border bg-bg/60 px-4 py-3 text-[0.95rem] text-fg placeholder:text-muted/60 transition-[border-color,box-shadow] duration-300 outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgb(101_117_255/0.18)] focus-visible:outline-none";

/**
 * Contact form. Delivery strategy, in order:
 * 1. POST /api/contact when an email provider is configured on the server.
 * 2. Otherwise open the visitor's email app (mailto) if a public inbox is set.
 * 3. Otherwise tell the visitor honestly that the channel is not set up yet.
 * It never claims a message was sent unless the server confirmed it.
 */
export function ContactForm({ copy, deliveryEnabled, contactEmail, subjectPrefix }: ContactFormProps) {
  const formId = useId();
  const [status, setStatus] = useState<ContactStatus>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", company: "", message: "", website: "" },
  });

  function errorText(error: FieldError | undefined): string | undefined {
    if (!error) return undefined;
    return isContactErrorCode(error.message) ? copy.errors[error.message] : copy.errors.nameRequired;
  }

  async function onSubmit(data: ContactData) {
    setStatus("idle");
    if (data.website) {
      // Honeypot tripped: behave as if nothing happened.
      return;
    }

    if (deliveryEnabled) {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          setStatus("sent");
          reset();
          return;
        }
      } catch {
        // fall through to the fallbacks below
      }
      setStatus(contactEmail ? "mailto" : "failed");
      if (contactEmail) openExternalUrl(buildMailtoHref(contactEmail, data, subjectPrefix));
      return;
    }

    if (contactEmail) {
      openExternalUrl(buildMailtoHref(contactEmail, data, subjectPrefix));
      setStatus("mailto");
      return;
    }

    setStatus("unconfigured");
  }

  const fields = {
    name: `${formId}-name`,
    email: `${formId}-email`,
    company: `${formId}-company`,
    message: `${formId}-message`,
  };

  const statusTone = status === "sent" ? "success" : status === "failed" ? "error" : "info";

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" data-testid="contact-form">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={fields.name} label={copy.nameLabel} error={errorText(errors.name)}>
          <input
            id={fields.name}
            type="text"
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${fields.name}-error` : undefined}
            className={cn(inputClasses, errors.name ? "border-danger/70" : "border-line")}
            {...register("name")}
          />
        </Field>
        <Field id={fields.email} label={copy.emailLabel} error={errorText(errors.email)}>
          <input
            id={fields.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            placeholder={copy.emailPlaceholder}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${fields.email}-error` : undefined}
            className={cn(inputClasses, "rtl:text-right", errors.email ? "border-danger/70" : "border-line")}
            {...register("email")}
          />
        </Field>
      </div>

      <Field id={fields.company} label={copy.companyLabel} hint={copy.optional}>
        <input
          id={fields.company}
          type="text"
          autoComplete="organization"
          placeholder={copy.companyPlaceholder}
          className={cn(inputClasses, "border-line")}
          {...register("company")}
        />
      </Field>

      <Field id={fields.message} label={copy.messageLabel} error={errorText(errors.message)}>
        <textarea
          id={fields.message}
          rows={5}
          placeholder={copy.messagePlaceholder}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${fields.message}-error` : undefined}
          className={cn(inputClasses, "min-h-36 resize-y", errors.message ? "border-danger/70" : "border-line")}
          {...register("message")}
        />
      </Field>

      {/* Honeypot — hidden from people and assistive tech. */}
      <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0 [clip-path:inset(50%)]">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input id={`${formId}-website`} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto" data-testid="contact-submit">
          {isSubmitting ? (
            <>
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
              {copy.sending}
            </>
          ) : (
            <>
              {copy.submit}
              <Send aria-hidden className="size-4 rtl:-scale-x-100" />
            </>
          )}
        </Button>
      </div>

      <div aria-live="polite" role="status" className="min-h-0">
        <AnimatePresence mode="wait">
          {status !== "idle" ? (
            <m.p
              key={status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              data-testid="contact-status"
              data-status={status}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
                statusTone === "success" && "border-success/30 bg-success/10 text-success",
                statusTone === "error" && "border-danger/30 bg-danger/10 text-danger",
                statusTone === "info" && "border-primary/30 bg-primary/10 text-fg",
              )}
            >
              {statusTone === "success" ? (
                <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
              ) : statusTone === "error" ? (
                <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              ) : (
                <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
              )}
              <span>{copy.status[status]}</span>
            </m.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline gap-2 text-sm font-medium text-fg/90">
        {label}
        {hint ? <span className="text-xs font-normal text-muted">({hint})</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs text-danger">
          <CircleAlert aria-hidden className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
