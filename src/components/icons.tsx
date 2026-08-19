import {
  BookOpen,
  Briefcase,
  Building,
  Car,
  Gavel,
  Globe,
  IdCard,
  Landmark,
  Newspaper,
  ReceiptText,
  Scale,
  ScrollText,
  Shield,
  Stamp,
  Truck,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  "id-card": IdCard,
  "scroll-text": ScrollText,
  "book-open": BookOpen,
  car: Car,
  truck: Truck,
  landmark: Landmark,
  shield: Shield,
  stamp: Stamp,
  newspaper: Newspaper,
  scale: Scale,
  "receipt-text": ReceiptText,
  briefcase: Briefcase,
  globe: Globe,
  gavel: Gavel,
  building: Building,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = MAP[name] ?? BookOpen;
  return <Icon className={className} strokeWidth={1.75} />;
}
