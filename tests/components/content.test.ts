import { describe, expect, it } from "vitest";
import { locales } from "@/config/i18n";
import { navItems, primaryCta } from "@/config/navigation";
import { sectionIds } from "@/config/sections";
import { ar } from "@/content/ar";
import { en } from "@/content/en";
import { getContent } from "@/lib/i18n";

/** Returns the structural "shape" of an object: keys and array lengths, not values. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, shape(v)]),
    );
  }
  return typeof value;
}

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

describe("content", () => {
  it("English and Arabic dictionaries have identical structure", () => {
    expect(shape(ar)).toEqual(shape(en));
  });

  it("list items share the same ids across locales", () => {
    const ids = (c: typeof en) => ({
      capabilities: c.capabilities.items.map((i) => i.id),
      process: c.process.steps.map((s) => s.id),
      why: c.why.items.map((i) => i.id),
    });
    expect(ids(ar)).toEqual(ids(en));
  });

  it("has no empty strings in any locale", () => {
    for (const locale of locales) {
      const empty = collectStrings(getContent(locale)).filter((s) => s.trim() === "");
      expect(empty, `empty strings in ${locale}`).toHaveLength(0);
    }
  });

  it("ids inside each list are unique", () => {
    for (const list of [en.capabilities.items, en.process.steps, en.why.items]) {
      const ids = list.map((i) => i.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("does not contain unverifiable numeric claims (stats, client counts)", () => {
    for (const locale of locales) {
      const text = collectStrings(getContent(locale)).join(" ");
      expect(text).not.toMatch(/\b\d{2,}\s*(\+|%|clients|customers|projects|years)/i);
    }
  });
});

describe("navigation", () => {
  it("every nav item points at an existing section id", () => {
    for (const item of navItems) {
      expect(sectionIds).toContain(item.id);
      expect(item.href).toBe(`#${item.id}`);
    }
    expect(sectionIds).toContain(primaryCta.target);
  });

  it("section ids are unique", () => {
    expect(new Set(sectionIds).size).toBe(sectionIds.length);
  });

  it("every section has a nav label in every locale", () => {
    for (const locale of locales) {
      for (const id of sectionIds) {
        expect(getContent(locale).nav.labels[id]).toBeTruthy();
      }
    }
  });
});
