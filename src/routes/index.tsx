import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">{t("pages.landing")}</h1>
      <p className="text-sm text-muted-foreground">Route: /</p>
    </div>
  );
}
