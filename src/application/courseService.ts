import { type EditableTimelineEntry } from "@/domain/course";
import { addMinutes, modeSpecificEstimate } from "@/lib/course";

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

  /**
   * Moves an entry up or down and recalculates the timeline.
   */
  moveEntry(
    course: EditableTimelineEntry[],
    index: number,
    direction: "up" | "down",
  ): EditableTimelineEntry[] {
    const newCourse = [...course];
    const targetIdx = direction === "up" ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= newCourse.length) return course;

    // Swap items
    [newCourse[index], newCourse[targetIdx]] = [newCourse[targetIdx], newCourse[index]];

    // Recalculate times starting from 09:00 (or the first entry's original time)
    return this.recalculateTimeline(newCourse, "09:00");
  },

  /**
   * Updates the travel mode and automatically updates the travel time.
   */
  updateTravelMode(
    course: EditableTimelineEntry[],
    index: number,
    mode: "walk" | "taxi" | "subway" | "bus",
  ): EditableTimelineEntry[] {
    const newCourse = [...course];
    const entry = newCourse[index];
    if (!entry.travelToNext) return course;

    // Calculate new minutes based on mode
    const newMinutes = modeSpecificEstimate(entry.travelToNext.km, mode);

    // Update entry with new mode and time
    newCourse[index] = {
      ...entry,
      travelToNext: { ...entry.travelToNext, mode, minutes: newMinutes },
    };

    // Recalculate subsequent times
    return this.updateTravelTime(newCourse, index, newMinutes);
  },
};
