"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Trash2,
  Share2,
  Shuffle,
  Download,
  MapPin,
  Footprints,
  Car,
  TrainFront,
  Clock,
  AlertTriangle,
  RefreshCw,
  Instagram,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  Bus,
  Plus,
  Search,
  Check,
  Menu,
  FolderOpen,
  Utensils,
  Coffee,
  Timer,
  Pencil,
  GripVertical,
  Map,
} from "lucide-react";
import { useAppStore, type LangCode } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  classifyFavorites,
  generateCourse,
  totalRouteKm,
  addMinutes,
  spots as allSpots,
  restaurants as allRestaurants,
  cafes as allCafes,
  type TimelineEntry,
  type AnyItem,
} from "@/lib/course";
import { type EditableTimelineEntry } from "@/domain/course";
import { courseService } from "@/application/courseService";
import { STYLE_META, type StyleKey } from "@/data/quiz";
import { supabase } from "@/lib/supabase";
import { toPng } from "html-to-image";
import { Reorder, useDragControls } from "framer-motion";
import dynamic from "next/dynamic";

const CourseMap = dynamic(() => import("@/components/CourseMap"), { ssr: false });

export default function MyCoursePage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "zh-TW") as LangCode;
  const favorites = useAppStore((s) => s.favorites);
  const guestId = useAppStore((s) => s.guestId);
  const initializeGuestId = useAppStore((s) => s.initializeGuestId);
  const setFavorites = useAppStore((s) => s.setFavorites);
  const userStyle = useAppStore((s) => s.userStyle) as StyleKey | null;
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const router = useRouter();

  const { spots, restaurants, cafes } = useMemo(() => classifyFavorites(favorites), [favorites]);

  const [tab, setTab] = useState<"list" | "course">("course");
  const [seed, setSeed] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [editableCourse, setEditableCourse] = useState<EditableTimelineEntry[]>([]);
  const skipRegenRef = useRef(false);

  useEffect(() => {
    if (skipRegenRef.current) {
      skipRegenRef.current = false;
      return;
    }
    if (favorites.length > 0) {
      const generated = generateCourse(favorites) as EditableTimelineEntry[];
      setEditableCourse(generated);
    } else {
      setEditableCourse([]);
    }
  }, [favorites, seed]);

  // Supabase Load Logic
  useEffect(() => {
    initializeGuestId();
  }, [initializeGuestId]);

  // Set default Cheongsapo demo course if favorites is completely empty on first mount
  useEffect(() => {
    const currentFavs = useAppStore.getState().favorites;
    if (!currentFavs || currentFavs.length === 0) {
      setFavorites(["spot_001", "r12", "c7"]);
    }
  }, [setFavorites]);

  useEffect(() => {
    async function loadCourseData() {
      if (!guestId) return;
      const { data, error } = await supabase
        .from("user_courses")
        .select("course_data")
        .eq("guest_id", guestId)
        .single();

      if (data && data.course_data) {
        // Prevent infinite loop by checking if we really need to update
        if (JSON.stringify(data.course_data) !== JSON.stringify(useAppStore.getState().favorites)) {
          setFavorites(data.course_data);
        }
      }
    }
    loadCourseData();
  }, [guestId, setFavorites]);

  const totalKm = useMemo(() => totalRouteKm(editableCourse), [editableCourse]);

  const validMapEntries = useMemo(() => {
    return editableCourse.filter(
      (e) => (e.item as any)?.coords?.lat && (e.item as any)?.coords?.lng
    );
  }, [editableCourse]);

  const getKakaoMapRouteUrl = () => {
    if (validMapEntries.length === 0) return "https://map.kakao.com";
    if (validMapEntries.length === 1) {
      const spot = validMapEntries[0].item as any;
      const name = spot.name[lang] || spot.name["en"] || "";
      return `https://map.kakao.com/link/to/${encodeURIComponent(name)},${spot.coords.lat},${spot.coords.lng}`;
    }
    const start = validMapEntries[0].item as any;
    const end = validMapEntries[validMapEntries.length - 1].item as any;
    const startName = start.name[lang] || start.name["en"] || "";
    const endName = end.name[lang] || end.name["en"] || "";
    return `https://map.kakao.com/?sName=${encodeURIComponent(startName)}&eName=${encodeURIComponent(endName)}`;
  };

  const getNaverMapRouteUrl = () => {
    if (validMapEntries.length < 2) return "https://map.naver.com";
    const start = validMapEntries[0].item as any;
    const end = validMapEntries[validMapEntries.length - 1].item as any;
    const startName = start.name[lang] || start.name["en"] || "";
    const endName = end.name[lang] || end.name["en"] || "";
    return `https://map.naver.com/v5/directions/${start.coords.lng},${start.coords.lat},${encodeURIComponent(startName)}///${end.coords.lng},${end.coords.lat},${encodeURIComponent(endName)}/-/car`;
  };

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="mb-6 text-7xl drop-shadow-xl animate-bounce-slow">🗺️</div>
        <h1 className="text-2xl font-black text-foreground tracking-tight">
          {t("myCourse.title")}
        </h1>
        <p className="mt-3 max-w-xs text-sm font-medium text-muted-foreground/80 leading-relaxed">
          {t("myCourse.empty.message")}
        </p>
        <Button
          asChild
          className="mt-8 h-12 rounded-full px-8 font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Link href="/spots">{t("myCourse.empty.cta")}</Link>
        </Button>
      </div>
    );
  }

  const handleShare = async () => {
    const lines = editableCourse
      .map((e, i) => `${i + 1}. ${e.time} ${e.item.name[lang] ?? e.item.name["en"]}`)
      .join("\n");
    const text = `${t("myCourse.share.header")}\n${lines}\n${typeof window !== "undefined" ? window.location.origin : ""}/my-course`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {}
    }
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(lineUrl, "_blank");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : "");
    toast.success(t("common.copied"));
  };

  const handleShareImage = async (platform?: "kakao" | "instagram" | "line") => {
    const node = document.getElementById("share-card");
    if (!node) {
      toast.error(t("common.shareError", "Share screen not found."));
      return;
    }

    const loadingToast = toast.loading(t("common.shareLoading", "Generating share image..."));

    try {
      // Generate clean high resolution PNG without scale/transform glitches
      const dataUrl = await toPng(node, {
        backgroundColor: undefined,
        style: {
          transform: "scale(1)",
        },
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "my-course.png", { type: "image/png" });

      // Check if Web Share API with files is supported (mostly mobile)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Busan Drama Trail Course",
          text: "내가 만든 부산 드라마 여행 코스야! 🎬✨",
        });
        toast.dismiss(loadingToast);
        toast.success("공유 창이 열렸습니다!");
      } else {
        // Fallback: Download the image and copy to clipboard if supported (mostly desktop)
        const link = document.createElement("a");
        link.download = "my-course.png";
        link.href = dataUrl;
        link.click();

        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ]);
          toast.dismiss(loadingToast);
          toast.success(
            "이미지가 다운로드되고 클립보드에 복사되었습니다! 카톡, 인스타, 라인에 바로 붙여넣기(Ctrl+V) 해보세요! ✨",
            {
              duration: 6000,
            },
          );
        } catch (clipErr) {
          toast.dismiss(loadingToast);
          toast.success(
            "이미지가 성공적으로 다운로드되었습니다! 저장된 이미지를 카톡, 인스타, 라인에 공유해 보세요! 📸",
          );
        }
      }
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(`이미지 생성 실패: ${err.message}`);
    }
  };

  const handleSaveToSupabase = async () => {
    if (!guestId) {
      toast.error("Guest ID가 없습니다.");
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from("user_courses").upsert(
        {
          guest_id: guestId,
          course_data: favorites,
        },
        { onConflict: "guest_id" },
      );
      if (error) throw error;
      toast.success(t("myCourse.actions.saveSuccess", "Course saved successfully!"));
    } catch (err: any) {
      toast.error(t("myCourse.actions.saveFail", `Save failed: ${err.message}`));
    } finally {
      setIsSaving(false);
    }
  };

  const onUpdateMemo = (idx: number, val: string) => {
    skipRegenRef.current = true;
    setEditableCourse((cur) => courseService.updateMemo(cur, idx, val));
  };

  const onUpdateTravelTime = (idx: number, val: number) => {
    skipRegenRef.current = true;
    setEditableCourse((cur) => courseService.updateTravelTime(cur, idx, val));
  };

  const onUpdateTravelMode = (idx: number, mode: "walk" | "taxi" | "subway" | "bus") => {
    skipRegenRef.current = true;
    setEditableCourse((cur) => courseService.updateTravelMode(cur, idx, mode));
  };

  const handleMove = (idx: number, direction: "up" | "down") => {
    skipRegenRef.current = true;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= editableCourse.length) return;

    // Deep clone to avoid mutation and trigger re-render
    const newCourse = editableCourse.map((e) => ({
      ...e,
      travelToNext: e.travelToNext ? { ...e.travelToNext } : undefined,
    }));

    // Swap
    [newCourse[idx], newCourse[targetIdx]] = [newCourse[targetIdx], newCourse[idx]];

    // Re-calculate all times starting from 09:00
    let cursor = "09:00";
    for (let i = 0; i < newCourse.length; i++) {
      newCourse[i].time = cursor;
      cursor = addMinutes(cursor, newCourse[i].durationMin);
      if (i < newCourse.length - 1) {
        // If travel data exists, use it, else default 10min
        const travelMins = newCourse[i].travelToNext?.minutes ?? 10;
        cursor = addMinutes(cursor, travelMins);
      }
    }

    setEditableCourse(newCourse);
    toast.success(t("common.updated", "Updated"));
  };

  const handleReorder = (newCourse: EditableTimelineEntry[]) => {
    skipRegenRef.current = true;

    // Re-calculate all times starting from 09:00
    let cursor = "09:00";
    const updatedCourse = newCourse.map(e => ({ ...e }));
    for (let i = 0; i < updatedCourse.length; i++) {
      updatedCourse[i].time = cursor;
      cursor = addMinutes(cursor, updatedCourse[i].durationMin);
      if (i < updatedCourse.length - 1) {
        // If travel data exists, use it, else default 10min
        const travelMins = updatedCourse[i].travelToNext?.minutes ?? 10;
        cursor = addMinutes(cursor, travelMins);
      } else {
        updatedCourse[i].travelToNext = undefined;
      }
    }

    setEditableCourse(updatedCourse);
  };

  const handleRemoveEntry = (idx: number) => {
    const itemToRemove = editableCourse[idx].item;
    toggleFavorite(itemToRemove.id);
    toast.info(t("myCourse.removed"));
  };

  const handleAddEntry = (item: AnyItem) => {
    // Add to favorites if not already there
    if (!favorites.includes(item.id)) {
      toggleFavorite(item.id);
    }

    skipRegenRef.current = true;
    const newCourse = [...editableCourse];

    // Default duration based on kind
    let duration = 60;
    if (item.kind === "restaurant") duration = 60;
    if (item.kind === "cafe") duration = 45;

    const newEntry: EditableTimelineEntry = {
      time: "00:00", // placeholder
      durationMin: duration,
      item: item as any,
    };

    newCourse.push(newEntry);

    // Re-calculate all times
    let cursor = newCourse[0]?.time || "09:00";
    for (let i = 0; i < newCourse.length; i++) {
      newCourse[i].time = cursor;
      cursor = addMinutes(cursor, newCourse[i].durationMin);
      if (i < newCourse.length - 1) {
        const travelMins = newCourse[i].travelToNext?.minutes ?? 10;
        cursor = addMinutes(cursor, travelMins);
      }
    }

    setEditableCourse(newCourse);
    toast.success(t("common.added", "Added to course"));
    setIsAddSheetOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            {t("myCourse.title")}
          </h1>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Live Preview
          </div>
        </div>
      </header>

      {/* Stats Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-5 shadow-sm animate-fade-up">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">
              {t("myCourse.groups.spots")}
            </p>
            <p className="text-lg font-black">{spots.length}</p>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="grid size-10 place-items-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Utensils className="size-5" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">
              {t("myCourse.groups.restaurants")}
            </p>
            <p className="text-lg font-black">{restaurants.length}</p>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="grid size-10 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Coffee className="size-5" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">
              {t("myCourse.groups.cafes")}
            </p>
            <p className="text-lg font-black">{cafes.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 rounded-2xl bg-muted p-1.5 shadow-inner">
        <button
          type="button"
          onClick={() => setTab("course")}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
            tab === "course"
              ? "bg-background text-foreground shadow-md scale-[1.02]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Shuffle className="size-3.5" />
          {t("myCourse.tabs.course")}
        </button>
        <button
          type="button"
          onClick={() => setTab("list")}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
            tab === "list"
              ? "bg-background text-foreground shadow-md scale-[1.02]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FolderOpen className="size-3.5" />
          {t("myCourse.tabs.list")}
        </button>
      </div>

      {tab === "list" ? (
        <ListView
          spots={spots}
          restaurants={restaurants}
          cafes={cafes}
          lang={lang}
          onRemove={(id) => {
            toggleFavorite(id);
            toast(t("myCourse.removed"));
          }}
          onOpen={(id, kind) => {
            if (kind === "spot") router.push(`/spots/${id}`);
          }}
        />
      ) : (
        <div className="space-y-8">
          {/* AI Optimization Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shuffle className="size-24" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 mb-3">
                <span className="size-2 rounded-full bg-green-400 animate-pulse" />
                AI Optimized Path
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                <h2 className="text-2xl font-black tracking-tight">{t("myCourse.aiBanner.title", "AI 추천 최적 경로")}</h2>
                <div className="flex items-center gap-2">
                  <a
                    href={getKakaoMapRouteUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black rounded-2xl bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] border border-[#FEE500]/10 cursor-pointer shadow-sm no-underline active:scale-95 transition-all"
                  >
                    <span className="font-extrabold text-[8px] bg-black/10 px-1 rounded-sm">KAKAO</span> 길찾기
                  </a>
                  <a
                    href={getNaverMapRouteUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black rounded-2xl bg-[#03C75A] hover:bg-[#03C75A]/90 text-white border border-[#03C75A]/10 cursor-pointer shadow-sm no-underline active:scale-95 transition-all"
                  >
                    <span className="font-extrabold text-[8px] bg-white/20 px-1 rounded-sm">NAVER</span> 길찾기
                  </a>
                </div>
              </div>
              <p className="text-white/80 text-xs leading-relaxed max-w-[80%] font-medium">
                {t("myCourse.aiBanner.subtitle", { km: totalKm.toFixed(1) })}
              </p>
            </div>
          </div>

          <div className="w-full h-[320px] rounded-3xl overflow-hidden border border-border/40 shadow-md relative z-0">
            <CourseMap course={editableCourse} lang={lang} />
          </div>

          <CourseView
            course={editableCourse}
            totalKm={totalKm}
            lang={lang}
            isEditing={isEditing}
            onUpdateMemo={onUpdateMemo}
            onUpdateTravelTime={onUpdateTravelTime}
            onUpdateTravelMode={onUpdateTravelMode}
            onMove={handleMove}
            onRemove={handleRemoveEntry}
            onAdd={() => setIsAddSheetOpen(true)}
            onReorder={handleReorder}
          />
        </div>
      )}

      {/* Add Spot Sheet */}
      <AddSpotSheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        onAdd={handleAddEntry}
        existingIds={editableCourse.map((e) => e.item.id)}
        lang={lang}
      />

      {/* Bottom action bar */}
      <div className="sticky bottom-20 z-10 flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/95 p-2 shadow-xl backdrop-blur-xl md:bottom-4 animate-fade-up">
        {isEditing ? (
          <Button
            variant="default"
            onClick={() => setIsEditing(false)}
            className="flex-1 h-12 gap-2 rounded-xl font-bold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white animate-in zoom-in duration-300"
          >
            <RefreshCw className="h-4 w-4" /> {t("myCourse.actions.editDone")}
          </Button>
        ) : (
          <>
            <BookingSheet course={editableCourse} />
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex-1 h-12 gap-2 rounded-xl border-border/60 font-bold text-muted-foreground hover:text-amber-500 hover:border-amber-500/40 hover:bg-amber-500/10 transition-colors px-0"
              >
                <Pencil className="h-4 w-4 shrink-0" /> <span className="truncate">{t("myCourse.actions.editCourse", "다시 짜기")}</span>
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 h-12 gap-2 rounded-xl border-border/60 font-bold text-muted-foreground hover:text-rose-500 hover:border-rose-500/40 hover:bg-rose-500/10 transition-all active:scale-95 duration-300 px-0"
                  >
                    <Share2 className="h-4 w-4 shrink-0" /> <span className="truncate">{t("myCourse.actions.share")}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[90vh] sm:h-[85vh] w-full max-w-md mx-auto rounded-t-[32px] p-0 overflow-hidden flex flex-col bg-background">
                  <SheetHeader className="p-6 pb-0 shrink-0">
                    <SheetTitle className="text-center font-black tracking-tight">
                      {t("myCourse.actions.share")}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-6 pb-24">
                    <div className="space-y-6 flex flex-col items-center">
                      <div className="w-full max-w-[280px] aspect-[9/16] shrink-0">
                        <ShareLayout course={editableCourse} lang={lang} />
                      </div>

                      <div className="w-full max-w-[360px] space-y-3 shrink-0">
                        <p className="text-xs font-bold text-muted-foreground text-center">
                          {t("myCourse.actions.selectPlatform", "원하는 플랫폼의 이미지 공유 버튼을 선택하세요! 📸")}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            onClick={() => handleShareImage("kakao")}
                            className="h-12 gap-1 rounded-xl bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-bold text-xs border-none shadow-sm active:scale-95 transition-transform"
                          >
                            <MessageCircle className="size-4 fill-current" />
                            카카오톡
                          </Button>
                          <Button
                            onClick={() => handleShareImage("instagram")}
                            className="h-12 gap-1 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-90 text-white font-bold text-xs border-none shadow-sm active:scale-95 transition-transform"
                          >
                            <Instagram className="size-4" />
                            인스타
                          </Button>
                          <Button
                            onClick={() => handleShareImage("line")}
                            className="h-12 gap-1 rounded-xl bg-[#06C755] hover:bg-[#06C755]/90 text-white font-bold text-xs border-none shadow-sm active:scale-95 transition-transform"
                          >
                            <Share2 className="size-4" />
                            라인
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                onClick={handleSaveToSupabase}
                disabled={isSaving}
                className="flex-1 h-12 gap-2 rounded-xl border-border/60 font-bold text-muted-foreground hover:text-indigo-600 hover:border-indigo-600/40 hover:bg-indigo-600/10 transition-colors disabled:opacity-50 px-0"
              >
                {isSaving ? <RefreshCw className="h-4 w-4 shrink-0 animate-spin" /> : <Download className="h-4 w-4 shrink-0" />}
                <span className="font-bold truncate">{t("myCourse.actions.save", "저장")}</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ListView({
  spots,
  restaurants,
  cafes,
  lang,
  onRemove,
  onOpen,
}: {
  spots: ReturnType<typeof classifyFavorites>["spots"];
  restaurants: ReturnType<typeof classifyFavorites>["restaurants"];
  cafes: ReturnType<typeof classifyFavorites>["cafes"];
  lang: LangCode;
  onRemove: (id: string) => void;
  onOpen: (id: string, kind: "spot" | "restaurant" | "cafe") => void;
}) {
  const { t } = useTranslation();
  const groups = [
    {
      key: "spots",
      label: t("myCourse.groups.spots"),
      items: spots,
      icon: MapPin,
      color: "text-primary bg-primary/10",
    },
    {
      key: "restaurants",
      label: t("myCourse.groups.restaurants"),
      items: restaurants,
      icon: Utensils,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      key: "cafes",
      label: t("myCourse.groups.cafes"),
      items: cafes,
      icon: Coffee,
      color: "text-emerald-500 bg-emerald-500/10",
    },
  ] as const;

  return (
    <Accordion type="multiple" defaultValue={["spots"]} className="space-y-4">
      {groups.map((g) =>
        g.items.length ? (
          <AccordionItem key={g.key} value={g.key} className="border-none">
            <AccordionTrigger className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className={`grid size-8 place-items-center rounded-xl ${g.color}`}>
                  <g.icon className="size-4" />
                </div>
                <span className="text-sm font-black tracking-tight">{g.label}</span>
                <span className="text-[10px] font-bold text-muted-foreground/60">
                  ({g.items.length})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <ul className="space-y-3">
                {g.items.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card p-2 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                  >
                    <button
                      type="button"
                      onClick={() => onOpen(it.id, it.kind)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <img
                        src={it.thumbnail}
                        alt=""
                        className="h-14 w-14 rounded-xl object-cover shadow-sm"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-sm font-bold tracking-tight text-foreground">
                          {it.name[lang] ?? it.name["en"]}
                        </span>
                        {it.region && (
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {typeof it.region === "string"
                              ? it.region
                              : (it.region[lang] ?? it.region.ko)}
                          </span>
                        )}
                      </div>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(it.id)}
                      className="size-10 rounded-xl text-muted-foreground hover:bg-rose-50 hover:text-rose-500"
                      aria-label="remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ) : null,
      )}
    </Accordion>
  );
}

function CourseView({
  course,
  totalKm,
  lang,
  isEditing,
  onUpdateMemo,
  onUpdateTravelTime,
  onUpdateTravelMode,
  onMove,
  onRemove,
  onAdd,
  onReorder,
}: {
  course: EditableTimelineEntry[];
  totalKm: number;
  lang: LangCode;
  isEditing: boolean;
  onUpdateMemo: (idx: number, val: string) => void;
  onUpdateTravelTime: (idx: number, val: number) => void;
  onUpdateTravelMode: (idx: number, mode: "walk" | "taxi" | "subway" | "bus") => void;
  onMove: (idx: number, direction: "up" | "down") => void;
  onRemove: (idx: number) => void;
  onAdd: () => void;
  onReorder: (newCourse: EditableTimelineEntry[]) => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  if (course.length === 0) return null;

  if (course.length === 1) {
    const e = course[0];
    return (
      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm animate-fade-up">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">
          {t("myCourse.single.label")}
        </p>
        <h3 className="mt-2 text-xl font-black text-foreground tracking-tight">
          {e.item.name[lang] ?? e.item.name["en"]}
        </h3>
        <p className="mt-3 text-xs font-medium leading-relaxed text-muted-foreground/80">
          {t("myCourse.single.hint")}
        </p>
      </div>
    );
  }

  const tooFar = totalKm > 30;

  return (
    <div className="space-y-4">
      {tooFar && (
        <div className="flex items-start gap-3 rounded-2xl border border-yellow-300/40 bg-yellow-50/50 p-4 text-xs font-medium text-yellow-800 animate-in slide-in-from-top-4 duration-500">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
          <span className="leading-relaxed">
            {t("myCourse.warnings.tooFar", { km: totalKm.toFixed(1) })}
          </span>
        </div>
      )}

      <Reorder.Group axis="y" values={course} onReorder={onReorder} className="relative ml-2">
        <div className="absolute left-[3.2rem] top-3 bottom-10 w-0.5 bg-gradient-to-b from-primary via-muted to-muted opacity-20" />

        {course.map((entry, i) => {
          const item = entry.item;
          const name = item.name[lang] ?? item.name["en"];
          const isLast = i === course.length - 1;

          return (
            <Reorder.Item
              key={`${item.kind}-${item.id}-${i}`}
              value={entry}
              dragListener={isEditing}
              className="relative pb-10 pl-16 outline-none"
            >
              <div className="absolute left-0 top-1 w-12 text-right">
                <span className="text-xs font-black text-foreground tabular-nums tracking-tight">
                  {entry.time}
                </span>
              </div>

              <div
                className="absolute left-[2.9rem] top-1.5 z-10 grid size-3 place-items-center rounded-full border-2 border-background shadow-sm"
                style={{
                  backgroundColor: dotColor(item.kind),
                  boxShadow: `0 0 0 2px ${dotColor(item.kind)}20`,
                }}
              />

              <div className="relative group">
                <div
                  className={`block rounded-3xl border border-border/40 bg-card p-4 shadow-sm transition-all hover:shadow-lg active:scale-[0.99] hover:-translate-y-1 ${item.kind === "spot" ? "cursor-pointer" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    {isEditing && (
                      <div className="flex-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors">
                        <GripVertical className="h-5 w-5" />
                      </div>
                    )}
                    <img
                      onClick={() => !isEditing && item.kind === "spot" && router.push(`/spots/${item.id}`)}
                      src={item.thumbnail}
                      alt=""
                      className="h-16 w-16 rounded-2xl object-cover shadow-sm ring-1 ring-border/10"
                      loading="lazy"
                    />
                    <div
                      className="min-w-0 flex-1 space-y-1"
                      onClick={() => !isEditing && item.kind === "spot" && router.push(`/spots/${item.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                          {kindLabel(item.kind, t)}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60">
                          <Clock className="h-2.5 w-2.5" />
                          {entry.durationMin}m
                        </div>
                      </div>
                      <h4 className="line-clamp-1 text-base font-black tracking-tight text-foreground">
                        {name}
                      </h4>
                    </div>

                    {isEditing && (
                      <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-right-2 duration-300">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={i === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMove(i, "up");
                          }}
                          className="h-8 w-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-20 disabled:bg-muted"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(i);
                          }}
                          className="h-8 w-8 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isLast}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMove(i, "down");
                          }}
                          className="h-8 w-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-20 disabled:bg-muted"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Travel Memo Input */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 px-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                      <Pencil className="h-2.5 w-2.5" />
                      {t("myCourse.memo.label")}
                    </div>
                    <Textarea
                      placeholder={t("myCourse.memo.placeholder")}
                      value={entry.memo || ""}
                      onChange={(e) => onUpdateMemo(i, e.target.value)}
                      className="min-h-[44px] rounded-xl border-none bg-muted/40 text-[11px] font-medium placeholder:text-muted-foreground/30 focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Travel mode & time */}
              {entry.travelToNext && !isLast && (
                <div className="mt-4 ml-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {(["walk", "taxi", "bus", "subway"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => onUpdateTravelMode(i, m)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition-all ${
                          entry.travelToNext?.mode === m
                            ? "bg-primary text-white shadow-md ring-2 ring-primary/20 scale-105"
                            : "bg-transparent text-muted-foreground hover:bg-muted/30"
                        }`}
                      >
                        <ModeIcon mode={m} />
                        <span className="uppercase">{t(`myCourse.travel.${m}`)}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 rounded-full bg-muted/40 px-3 py-1 text-[10px] font-bold text-muted-foreground/80">
                      <span>
                        {entry.travelToNext.minutes} {t("myCourse.customTravel.unit")}
                      </span>
                      <span className="opacity-30">•</span>
                      <span>{entry.travelToNext.km.toFixed(1)} km</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-20 hover:opacity-100 transition-opacity">
                      <Input
                        type="number"
                        min="1"
                        max="300"
                        value={entry.travelToNext.minutes}
                        onChange={(e) => onUpdateTravelTime(i, parseInt(e.target.value) || 1)}
                        className="h-6 w-14 rounded-lg border-border/40 bg-background px-1.5 text-center text-[10px] font-black focus-visible:ring-primary/30"
                      />
                      <Timer className="h-3 w-3 text-muted-foreground/60" />
                    </div>
                  </div>
                </div>
              )}
            </Reorder.Item>
          );
        })}

        {isEditing && (
          <div className="relative pl-16 animate-in fade-in slide-in-from-left-4 duration-500 pb-10">
            <Button
              variant="outline"
              onClick={onAdd}
              className="w-full h-16 rounded-3xl border-dashed border-2 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 gap-2 font-bold"
            >
              <Plus className="size-5" />
              {t("myCourse.actions.addSpot")}
            </Button>
          </div>
        )}
      </Reorder.Group>

      <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
        <span className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          {t("myCourse.totals.distance", { km: totalKm.toFixed(1) })}
        </span>
        <span>{t("myCourse.totals.stops", { count: course.length })}</span>
      </div>
    </div>
  );
}

/* ---------- Add Spot Sheet Component ---------- */
function AddSpotSheet({
  isOpen,
  onClose,
  onAdd,
  existingIds,
  lang,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: AnyItem) => void;
  existingIds: string[];
  lang: LangCode;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"spots" | "restaurants" | "cafes">("spots");

  const filteredItems = useMemo(() => {
    const data =
      activeTab === "spots" ? allSpots : activeTab === "restaurants" ? allRestaurants : allCafes;
    const q = query.toLowerCase();
    return data.filter(
      (it) => it.name[lang]?.toLowerCase().includes(q) || it.name["en"]?.toLowerCase().includes(q),
    );
  }, [activeTab, query, lang]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-[32px] p-0 overflow-hidden flex flex-col"
      >
        <SheetHeader className="p-6 pb-2 shrink-0">
          <SheetTitle className="text-left font-black tracking-tight flex items-center gap-2">
            <Plus className="size-5 text-primary" />
            {t("myCourse.actions.addSpot")}
          </SheetTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <Input
              placeholder={t("common.search", "Search spots...")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-11 rounded-xl bg-muted/50 border-none focus-visible:ring-primary/20"
            />
          </div>
        </SheetHeader>

        <div className="px-6 py-2 shrink-0">
          <div className="flex gap-1 rounded-xl bg-muted p-1">
            {(["spots", "restaurants", "cafes"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {t(`myCourse.groups.${tab}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                {t("common.noResults", "No results found")}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isAdded = existingIds.includes(item.id);
              const kind =
                activeTab === "spots"
                  ? "spot"
                  : activeTab === "restaurants"
                    ? "restaurant"
                    : "cafe";

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 rounded-2xl border border-border/40 bg-card p-2 shadow-sm transition-all ${
                    isAdded ? "opacity-60 bg-muted/20" : "hover:shadow-md active:scale-[0.98]"
                  }`}
                >
                  <img src={item.thumbnail} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold tracking-tight truncate">
                      {item.name[lang] ?? item.name["en"]}
                    </p>
                    <p className="text-[10px] font-medium text-muted-foreground">
                      {item.region
                        ? typeof item.region === "string"
                          ? item.region
                          : (item.region[lang as keyof typeof item.region] ?? item.region.ko)
                        : ""}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={isAdded ? "ghost" : "default"}
                    disabled={isAdded}
                    onClick={() => !isAdded && onAdd({ ...item, kind } as any)}
                    className={`rounded-xl px-4 h-9 font-bold ${isAdded ? "" : "shadow-md"}`}
                  >
                    {isAdded ? <Check className="size-4" /> : t("common.add", "Add")}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ---------- Social Share View (Instagram/Line Style) ---------- */
function ShareLayout({ course, lang }: { course: EditableTimelineEntry[]; lang: LangCode }) {
  const { t } = useTranslation();

  return (
    <div
      id="share-card"
      className="relative aspect-[9/16] w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#003d99] via-[#0077cc] to-[#33ccff] p-6 text-white shadow-2xl flex flex-col justify-between"
    >
      {/* Decorative Blur Spheres */}
      <div className="absolute -top-10 -right-10 h-60 w-60 rounded-full bg-white/10 blur-[80px]" />
      <div className="absolute top-1/2 -left-20 h-80 w-80 rounded-full bg-blue-400/20 blur-[100px]" />

      {/* Header */}
      <div className="relative z-10 space-y-2 pt-2 text-center flex-none">
        <div className="mx-auto w-fit rounded-full bg-white/20 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10">
          Personal Trip
        </div>
        <h2 className="text-3xl font-black tracking-tighter drop-shadow-2xl">
          {t("myCourse.share.layoutTitle")}
        </h2>
        <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-60">
          <span>{new Date().toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US")}</span>
          <span className="size-1 rounded-full bg-white/40" />
          <span>{course.length} Spots</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 flex-1 my-4 flex flex-col justify-center space-y-4 overflow-hidden">
        <div className="absolute left-[1.5rem] top-4 bottom-4 w-px bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
        <div className="space-y-4">
          {course.slice(0, 4).map((entry, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-center animate-slide-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="relative flex-none">
                <img
                  src={entry.item.thumbnail}
                  className="h-12 w-12 rounded-[14px] object-cover shadow-md border border-white/20"
                  alt=""
                />
                <div className="absolute -bottom-1 -right-1 bg-black/75 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md backdrop-blur-sm border border-white/10 tabular-nums">
                  {entry.time}
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="line-clamp-1 text-sm font-black tracking-tight leading-none">
                  {entry.item.name[lang] ?? entry.item.name["en"]}
                </h3>
                <div className="flex items-center gap-2 text-[9px] font-bold opacity-60 uppercase tracking-wider">
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[8px]">
              {t(`myCourse.kinds.${entry.item.kind}`)}
                  </span>
                  {entry.memo && <span className="line-clamp-1 italic">— {entry.memo}</span>}
                </div>
              </div>
            </div>
          ))}
          {course.length > 4 && (
            <div className="pl-[3.5rem] text-[9px] font-black uppercase tracking-[0.2em] opacity-40 animate-pulse">
              + {course.length - 4} more places
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 flex-none pt-2 border-t border-white/10 flex flex-col items-center gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
          {t("common.appName")}
        </p>
        <div className="flex gap-4 opacity-40">
          <Instagram className="h-4 w-4" />
          <MessageCircle className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function dotColor(kind: "spot" | "restaurant" | "cafe"): string {
  if (kind === "spot") return "hsl(var(--primary))";
  if (kind === "restaurant") return "#f59e0b"; // amber-500
  return "#10b981"; // emerald-500
}

function kindLabel(kind: "spot" | "restaurant" | "cafe", t: (k: string) => string): string {
  return t(`myCourse.kinds.${kind}`);
}

function ModeIcon({ mode }: { mode: "walk" | "taxi" | "subway" | "bus" }) {
  if (mode === "walk") return <Footprints className="h-3.5 w-3.5" />;
  if (mode === "taxi") return <Car className="h-3.5 w-3.5" />;
  if (mode === "bus") return <Bus className="h-3.5 w-3.5" />;
  return <TrainFront className="h-3.5 w-3.5" />;
}

function BookingSheet({ course }: { course: EditableTimelineEntry[] }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [travelDate, setTravelDate] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [requests, setRequests] = useState("");
  
  const courseCount = course.length;
  const extraCount = Math.max(0, courseCount - 3);
  const totalCost = 249000 + (extraCount * 50000);

  const isValid = travelDate && name.trim() && contact.trim();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="w-full h-12 sm:h-14 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all active:scale-[0.98] text-[13px] sm:text-base"
        >
          {t("myCourse.booking.trigger", "이 코스대로 여행 예약하기 ✨")}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] sm:h-[85vh] w-full max-w-md mx-auto rounded-t-[32px] p-0 flex flex-col bg-background">
        <SheetHeader className="p-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-xl font-black">{t("myCourse.booking.title", "여행 예약하기")}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">{t("myCourse.booking.nameLabel", "예약자 성함")} <span className="text-destructive">*</span></label>
            <Input 
              type="text" 
              placeholder={t("myCourse.booking.namePlaceholder", "홍길동")}
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">{t("myCourse.booking.contactLabel", "연락처")} <span className="text-destructive">*</span></label>
            <Input 
              type="tel" 
              placeholder={t("myCourse.booking.contactPlaceholder", "010-0000-0000")}
              value={contact} 
              onChange={(e) => setContact(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">{t("myCourse.booking.dateLabel", "여행 날짜 선택")} <span className="text-destructive">*</span></label>
            <Input 
              type="date" 
              value={travelDate} 
              onChange={(e) => setTravelDate(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">{t("myCourse.booking.requestsLabel", "추가 요청사항")}</label>
            <Textarea 
              placeholder={t("myCourse.booking.requestsPlaceholder", "알러지, 휠체어 등 픽업 관련 특별한 요청사항이 있다면 남겨주세요.")}
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
              className="min-h-[100px] rounded-xl resize-none"
            />
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-bold text-foreground">{t("myCourse.booking.costTitle", "예약 비용 안내")}</h3>
            <div className="rounded-2xl bg-muted/30 p-4 space-y-3 text-sm">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>{t("myCourse.booking.baseCourse", "기본 코스 (최대 3곳)")}</span>
                <span className="font-medium">249,000원</span>
              </div>
              {extraCount > 0 && (
                <div className="flex justify-between items-center text-muted-foreground animate-in fade-in">
                  <span>{t("myCourse.booking.extraCourse", { defaultValue: "추가 코스 ({{count}}곳)", count: extraCount })}</span>
                  <span className="font-medium">+{ (extraCount * 50000).toLocaleString() }원</span>
                </div>
              )}
              <div className="pt-3 mt-3 border-t flex justify-between items-center font-black text-lg text-primary">
                <span>{t("myCourse.booking.totalCost", "총 예약 비용")}</span>
                <span>{totalCost.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          <Button 
            className="w-full h-14 rounded-2xl text-base font-bold bg-primary text-white"
            disabled={!isValid}
            onClick={() => {
              toast.success(t("myCourse.booking.successMsg", "예약이 성공적으로 접수되었습니다!"));
              setIsOpen(false);
            }}
          >
            {t("myCourse.booking.payButton", "결제하기")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
