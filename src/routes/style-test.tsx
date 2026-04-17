import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/style-test")({
  component: StyleTest,
});

function StyleTest() {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">{t("pages.styleTest")}</h1>
      <p className="text-sm text-muted-foreground">Route: /style-test</p>
    </div>
  );
}
