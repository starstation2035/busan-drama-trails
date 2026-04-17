import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/spots")({
  component: Spots,
});

function Spots() {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">{t("pages.spots")}</h1>
      <p className="text-sm text-muted-foreground">Route: /spots</p>
    </div>
  );
}
