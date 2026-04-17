import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/spots/$id")({
  component: SpotDetail,
});

function SpotDetail() {
  const { t } = useTranslation();
  const { id } = Route.useParams();
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">{t("pages.spotDetail")}</h1>
      <p className="text-sm text-muted-foreground">Route: /spots/{id}</p>
    </div>
  );
}
