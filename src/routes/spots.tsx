import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { z } from "zod";
import { SpotCard, type Spot } from "@/components/SpotCard";
import spotsData from "@/data/spots.json";
import { useTranslation } from "react-i18next";
import { useAppStore, type LangCode } from "@/stores/useAppStore";

const searchSchema = z.object({
  tab: z.enum(["drama", "tour"]).optional().catch("drama"),
});

export const Route = createFileRoute("/spots")({
  validateSearch: (search) => searchSchema.parse(search),
  component: SpotsContainer,
});

function SpotsContainer() {
  const childMatches = useChildMatches();
  const { t } = useTranslation();
  const lang = (useAppStore((s) => s.lang) ?? "ko") as LangCode;

  // If there are child routes (like /spots/$id), render ONLY the outlet
  if (childMatches.length > 0) {
    return <Outlet />;
  }

  const allSpots = spotsData as Spot[];
  const filmingSites = allSpots.filter(s => (s as any).category === "drama");
  const landmarks = allSpots.filter(s => (s as any).category === "landmark");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <section className="px-6 pt-12 pb-8 bg-gradient-to-b from-primary/10 to-background">
        <h1 className="text-4xl font-black mb-3 tracking-tight">
          Explore Busan
        </h1>
        <p className="text-muted-foreground text-base max-w-md">
          영화 속 그 장면부터 부산의 숨은 명소까지, 당신의 특별한 여정을 시작하세요.
        </p>
      </section>

      {/* Movie Filming Sites Section */}
      <section className="px-6 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              🎬 영화 촬영지
            </h2>
            <p className="text-xs text-muted-foreground mt-1">드라마와 영화 속 감동을 직접 느껴보세요.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
          {filmingSites.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>

      {/* Landmarks Section */}
      <section className="px-6 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              🌊 부산 명소
            </h2>
            <p className="text-xs text-muted-foreground mt-1">부산에 왔다면 꼭 가봐야 할 필수 코스입니다.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
          {landmarks.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>
    </div>
  );
}
