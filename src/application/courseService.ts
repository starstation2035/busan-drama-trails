import { type EditableTimelineEntry } from "@/domain/course";
import { addMinutes } from "@/lib/course";

export const courseService = {
  /**
   * Updates the memo of a specific entry in the course.
   */
  updateMemo(
    course: EditableTimelineEntry[],
    index: number,
    memo: string,
  ): EditableTimelineEntry[] {
    const newCourse = [...course];
    newCourse[index] = { ...newCourse[index], memo };
    return newCourse;
  },

  /**
   * Updates the travel time and shifts subsequent entries.
   */
  updateTravelTime(
    course: EditableTimelineEntry[],
    index: number,
    minutes: number,
  ): EditableTimelineEntry[] {
    const newCourse = [...course];
    const entry = newCourse[index];
    if (!entry.travelToNext) return course;

    // Update travel time
    newCourse[index] = {
      ...entry,
      travelToNext: { ...entry.travelToNext, minutes },
    };

    // Re-calculate times from the next entry onwards
    let currentStartTime = addMinutes(entry.time, entry.durationMin + minutes);
    
    for (let i = index + 1; i < newCourse.length; i++) {
      newCourse[i] = { ...newCourse[i], time: currentStartTime };
      
      const nextTravel = newCourse[i].travelToNext?.minutes || 0;
      currentStartTime = addMinutes(currentStartTime, newCourse[i].durationMin + nextTravel);
    }

    return newCourse;
  },

  /**
   * Re-calculates all times based on a start time.
   */
  recalculateTimeline(
    course: EditableTimelineEntry[],
    startTime: string = "09:00",
  ): EditableTimelineEntry[] {
    let current = startTime;
    return course.map((entry) => {
      const updated = { ...entry, time: current };
      const travel = entry.travelToNext?.minutes || 0;
      current = addMinutes(current, entry.durationMin + travel);
      return updated;
    });
  },
};
