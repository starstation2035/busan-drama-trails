import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Link } from "@tanstack/react-router";
const SplitNotFoundComponent = () => /* @__PURE__ */ jsxs("div", { className: "py-20 text-center", children: [
  /* @__PURE__ */ jsx("p", { className: "text-6xl", children: "🔍" }),
  /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg font-semibold", children: "Spot not found" }),
  /* @__PURE__ */ jsx(Link, { to: "/spots", className: "mt-4 inline-block text-primary underline", children: "Back to all spots" })
] });
export {
  SplitNotFoundComponent as notFoundComponent
};
