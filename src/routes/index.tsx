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
        content: "https://image.tmdb.org/t/p/original/cQ6bU0C7hFkPqS06rR13M3eP6z4.jpg",
      },
    ],
  }),
  component: Landing,
});

const HERO_IMAGES = [
  {
    src: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/original/aK640gWriIscSoSf30MNqtsvseo.jpg",
    alt: "Pachinko Official Poster",
  },
  {
    src: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/original/bsAGeRXh26KbtwekKVxtpZQkLoU.jpg",
    alt: "Friend Official Poster",
  },
  {
    src: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/original/v2PhLwwWkeodAuF1ePtlIn5m2VI.jpg",
    alt: "The Glory Official Poster",
  },
  {
    src: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/original/yv57TccCkgdy3St7rspBPKROeRK.jpg",
    alt: "Extraordinary Attorney Woo Official Poster",
  },
];

function Landing() {
  const { t } = useTranslation();
  const ctaSection = useInView<HTMLElement>();

  return (
    <div className="-mx-4 -my-6 space-y-12 pb-10">
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[480px] w-full overflow-hidden">
        <HeroCarousel images={HERO_IMAGES} />
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 text-white">
          <h1 className="animate-fade-up text-5xl font-black leading-tight tracking-tight drop-shadow-2xl sm:text-7xl">
            {t("common.appName")}
          </h1>
          <p
            className="mt-4 max-w-lg text-lg font-semibold text-white/95 drop-shadow-lg animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            {t("landing.tagline")}
          </p>
        </div>
      </section>

      {/* CTAs */}
      <section
        ref={ctaSection.ref}
        className={`flex flex-col gap-4 px-6 transition-all duration-700 max-w-xl mx-auto ${
          ctaSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Link
          to="/spots"
          className="group flex w-full items-center justify-center gap-3 rounded-[2rem] bg-primary px-8 py-5 text-lg font-bold text-primary-foreground shadow-[0_10px_40px_-10px_rgba(var(--primary-rgb),0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {t("landing.cta.explore")}
          <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          to="/style-test"
          className="flex w-full items-center justify-center gap-3 rounded-[2rem] border-2 border-primary/20 bg-background/50 backdrop-blur-sm px-8 py-5 text-lg font-bold text-primary transition-all hover:bg-primary/5 hover:border-primary/40 active:scale-[0.98]"
        >
          ✨ {t("landing.cta.style")}
        </Link>
      </section>

      {/* Trust indicators */}
      <section className="px-6 pb-4">
        <p className="text-center text-sm font-medium text-muted-foreground/60 tracking-widest uppercase">
          {t("landing.stats")}
        </p>
      </section>
    </div>
  );
}
