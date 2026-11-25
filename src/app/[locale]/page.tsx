import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Vision } from "@/components/sections/Vision";
import { WhyVulfax } from "@/components/sections/WhyVulfax";
import { isLocale } from "@/config/i18n";
import { getContent } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <>
      <Navbar locale={locale} nav={content.nav} a11y={content.a11y} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero content={content.hero} />
        <BrandStatement content={content.brand} />
        <Capabilities content={content.capabilities} />
        <Process content={content.process} />
        <WhyVulfax content={content.why} />
        <Vision content={content.vision} />
        <Contact content={content.contact} />
      </main>
      <Footer content={content} />
    </>
  );
}
