import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Film, UtensilsCrossed, Map, ArrowRight } from "lucide-react";
import { HeroCarousel } from "@/components/HeroCarousel";
import { useInView } from "@/hooks/useInView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Busan Drama Spot & Style — K-Drama Filming Locations Guide" },
      {
        name: "description",
        content:
          "Discover Busan's K-drama and movie filming locations with curated nearby restaurants and smart route planning.",
      },
      { property: "og:title", content: "Busan Drama Spot & Style" },
      {
        property: "og:description",
        content: "Step into K-drama scenes and discover the story of Busan.",
      },
      {
        property: "og:image",
        content: "https://images.unsplash.com/photo-1538485399081-7c8970d28933?w=1200",
      },
    ],
  }),
  component: Landing,
});

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1538485399081-7c8970d28933?w=1600",
    alt: "Cheongsapo coast",
  },
  {
    src: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1600",
    alt: "Gamcheon Culture Village",
  },
  {
    src: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1600",
    alt: "Haeundae Beach",
  },
  {
    src: "https://images.unsplash.com/photo-1580977251946-3acdb22ee70c?w=1600",
    alt: "Huinnyeoul Village",
  },
];

function Landing() {
  const { t } = useTranslation();
  const valueProps = useInView<HTMLElement>();
  const ctaSection = useInView<HTMLElement>();

  const cards = [
    {
      icon: Film,
      title: t("landing.valueProp.spotsTitle"),
      desc: t("landing.valueProp.spotsDesc"),
      bg: "bg-primary/10",
      fg: "text-primary",
    },
    {
      icon: UtensilsCrossed,
      title: t("landing.valueProp.foodTitle"),
      desc: t("landing.valueProp.foodDesc"),
      bg: "bg-secondary/20",
      fg: "text-secondary-foreground",
    },
    {
      icon: Map,
      title: t("landing.valueProp.routeTitle"),
      desc: t("landing.valueProp.routeDesc"),
      bg: "bg-accent/30",
      fg: "text-accent-foreground",
    },
  ];

  return (
    <div className="-mx-4 -my-6 space-y-10 pb-10">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <HeroCarousel images={HERO_IMAGES} />
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-12 text-white">
          <h1 className="animate-fade-up text-4xl font-bold leading-tight tracking-tight drop-shadow-lg sm:text-5xl">
            {t("common.appName")}
          </h1>
          <p
            className="mt-3 max-w-md text-base font-medium text-white/90 drop-shadow animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            {t("landing.tagline")}
          </p>
        </div>
      </section>

      {/* Value props */}
      <section
        ref={valueProps.ref}
        className={`px-4 transition-all duration-700 ${
          valueProps.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {cards.map(({ icon: Icon, title, desc, bg, fg }) => (
            <div
              key={title}
              className="min-w-[70%] flex-shrink-0 rounded-2xl border border-border bg-card p-5 shadow-sm sm:min-w-0"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}
              >
                <Icon className={`h-6 w-6 ${fg}`} />
              </div>
              <h3 className="mt-4 font-bold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section
        ref={ctaSection.ref}
        className={`space-y-3 px-4 transition-all duration-700 ${
          ctaSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Link
          to="/spots"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-[0.97]"
        >
          {t("landing.cta.explore")}
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Link
          to="/style-test"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-background px-6 py-4 text-base font-semibold text-primary transition-transform active:scale-[0.97]"
        >
          {t("landing.cta.style")}
        </Link>
      </section>

      {/* Trust indicators */}
      <section className="px-4">
        <p className="text-center text-xs text-muted-foreground">{t("landing.stats")}</p>
      </section>
    </div>
  );
}
