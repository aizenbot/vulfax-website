import {
  Cloud,
  CodeXml,
  Compass,
  Cpu,
  Gauge,
  Globe,
  Layers,
  Palette,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/types/content";

/** Maps content-config icon names to Lucide components (keeps content serializable). */
const icons: Record<IconName, LucideIcon> = {
  code: CodeXml,
  globe: Globe,
  smartphone: Smartphone,
  cloud: Cloud,
  sparkles: Sparkles,
  palette: Palette,
  layers: Layers,
  shield: ShieldCheck,
  gauge: Gauge,
  users: Users,
  compass: Compass,
  cpu: Cpu,
};

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden strokeWidth={1.6} {...props} />;
}
