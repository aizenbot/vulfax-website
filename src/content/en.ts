import type { SiteContent } from "@/types/content";

/**
 * English copy.
 * PLACEHOLDER COPY: every headline, capability, process step and
 * differentiator below is a draft written for layout and tone. Replace with
 * approved VULFAX messaging before launch. No statistics, clients or
 * testimonials are included on purpose — add only verifiable ones.
 */
export const en: SiteContent = {
  meta: {
    title: "VULFAX — Software & Digital Engineering",
    description:
      "VULFAX designs, builds and runs software for ambitious companies: web platforms, mobile apps, cloud infrastructure and AI features, delivered by one team.",
  },
  a11y: {
    skipToContent: "Skip to content",
    mainNav: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchLanguage: "اقرأ الموقع بالعربية",
    home: "VULFAX home",
  },
  nav: {
    labels: {
      home: "Home",
      about: "About",
      capabilities: "Capabilities",
      process: "Process",
      why: "Why VULFAX",
      vision: "Vision",
      contact: "Contact",
    },
    cta: "Start a project",
  },
  hero: {
    eyebrow: "Software & digital engineering",
    titleLines: ["Engineering the systems", "your next decade runs on."],
    description:
      "Web platforms, mobile apps, cloud infrastructure and AI features — designed, built and operated by one team, from the first sketch to production traffic.",
    primaryCta: "Start a project",
    secondaryCta: "Explore capabilities",
    scrollHint: "Scroll",
  },
  brand: {
    eyebrow: "Our philosophy",
    statement:
      "Good technology disappears into the work. It loads before you notice, scales before you need it, and stays readable to the next engineer who opens it.",
    body: "We design every system for the size you plan to reach — not only the size you are today — so growth becomes a configuration change instead of a rebuild.",
  },
  capabilities: {
    eyebrow: "Capabilities",
    title: "One team across the whole stack",
    description:
      "From interface to infrastructure, each discipline works from the same plan, so nothing gets lost between handoffs.",
    items: [
      {
        id: "software",
        icon: "code",
        title: "Custom software",
        description:
          "Internal tools, business systems and APIs shaped around how your teams actually work.",
        tags: ["APIs", "Integrations", "Automation"],
      },
      {
        id: "web",
        icon: "globe",
        title: "Web platforms",
        description:
          "Fast, accessible websites and web apps built to rank, convert and stay maintainable.",
        tags: ["Next.js", "Performance", "SEO"],
      },
      {
        id: "mobile",
        icon: "smartphone",
        title: "Mobile apps",
        description: "iOS and Android apps that feel native, work offline and ship on a steady cadence.",
        tags: ["iOS", "Android", "Cross-platform"],
      },
      {
        id: "cloud",
        icon: "cloud",
        title: "Cloud & DevOps",
        description:
          "Infrastructure as code, CI/CD pipelines and monitoring so releases are routine, not risky.",
        tags: ["CI/CD", "Observability", "Scaling"],
      },
      {
        id: "ai",
        icon: "sparkles",
        title: "AI integration",
        description:
          "Language models and automation wired into real workflows, with guardrails and measurable results.",
        tags: ["LLMs", "Workflows", "Evaluation"],
      },
      {
        id: "design",
        icon: "palette",
        title: "Product design",
        description:
          "Research, UX and interface design that turns complex products into clear, usable ones.",
        tags: ["UX research", "UI systems", "Prototyping"],
      },
    ],
  },
  process: {
    eyebrow: "How we work",
    title: "A clear path from idea to production",
    description: "Four stages, each ending in something you can see, test and approve before the next begins.",
    outcomeLabel: "You get",
    steps: [
      {
        id: "discover",
        title: "Discover",
        description: "We map your goals, users and constraints, and agree on what success looks like.",
        outcome: "A scoped plan with priorities",
      },
      {
        id: "design",
        title: "Design",
        description: "Architecture and interface are designed together and validated with clickable prototypes.",
        outcome: "Approved prototype and technical blueprint",
      },
      {
        id: "build",
        title: "Build",
        description: "Short iterations with working software at the end of each, reviewed with you as it grows.",
        outcome: "Tested releases you can try",
      },
      {
        id: "evolve",
        title: "Launch & evolve",
        description: "We ship, monitor real usage and keep improving the product as your needs change.",
        outcome: "A live product and a roadmap",
      },
    ],
  },
  why: {
    eyebrow: "Why VULFAX",
    title: "Built to be the partner you keep",
    description: "What working with us is designed to feel like.",
    items: [
      {
        id: "one-team",
        icon: "users",
        title: "One accountable team",
        description: "Design, engineering and operations under one roof — one conversation, one owner.",
      },
      {
        id: "scale",
        icon: "layers",
        title: "Architecture for scale",
        description: "Modular foundations that let you add pages, products and markets without starting over.",
      },
      {
        id: "visibility",
        icon: "compass",
        title: "Progress you can see",
        description: "Regular demos and plain-language updates, so you always know where the work stands.",
      },
      {
        id: "security",
        icon: "shield",
        title: "Secure by default",
        description: "Security, privacy and accessibility are part of the definition of done, not an add-on.",
      },
    ],
  },
  vision: {
    eyebrow: "Future vision",
    lines: ["The future", "is built in software,", "and we build it with you."],
    body: "We are building VULFAX to be the engineering partner businesses grow with — across platforms, languages and markets.",
    cta: "Build it with us",
  },
  contact: {
    eyebrow: "Start a project",
    title: "Tell us what you are building",
    description:
      "Share a few lines about your idea, product or problem. A short message is enough to start the conversation.",
    emailLabel: "Or email us directly",
    form: {
      nameLabel: "Name",
      emailLabel: "Work email",
      companyLabel: "Company",
      messageLabel: "Project details",
      optional: "optional",
      namePlaceholder: "Your full name",
      emailPlaceholder: "you@company.com",
      companyPlaceholder: "Company name",
      messagePlaceholder: "What are you building, and where do you want it to go?",
      submit: "Send message",
      sending: "Sending…",
      errors: {
        nameRequired: "Please enter your name.",
        emailInvalid: "Please enter a valid email address.",
        messageShort: "Please write at least 20 characters.",
        messageLong: "Please keep your message under 2000 characters.",
      },
      status: {
        sent: "Thank you — your message has been sent. We will reply by email.",
        mailto: "Your email app should now open with your message ready to send.",
        unconfigured:
          "Thanks for your interest. Our contact channel is still being set up — please check back soon.",
        failed: "Something went wrong while sending. Please try again in a moment.",
      },
    },
  },
  footer: {
    tagline: "Software and digital engineering for companies building what comes next.",
    navTitle: "Explore",
    contactTitle: "Contact",
    contactCta: "Start a project",
    rights: "All rights reserved.",
    backToTop: "Back to top",
  },
  notFound: {
    title: "Page not found",
    body: "The page you are looking for does not exist or has moved.",
    back: "Back to home",
  },
};
