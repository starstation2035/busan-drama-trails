import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/my-course")({
  component: MyCourse,
});

function MyCourse() {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">{t("pages.myCourse")}</h1>
      <p className="text-sm text-muted-foreground">Route: /my-course</p>
    </div>
  );
}
