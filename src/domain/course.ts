import { type AnyItem } from "@/lib/course";

export interface TravelInfo {
  minutes: number;
  mode: "walk" | "taxi" | "subway" | "bus";
  km: number;
}

export interface EditableTimelineEntry {
  time: string;
  durationMin: number;
  item: AnyItem;
  memo?: string;
  travelToNext?: TravelInfo;
}

export interface CourseMetadata {
  title: string;
  shareTitle: string;
}
