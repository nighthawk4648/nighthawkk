import { Suspense } from "react";
import { ExtensionConnectForm } from "@/components/Auth/AuthForms";
import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Connect to SketchUp",
  description: "Connect the Sketch shaper extension to your account.",
  pathname: "/extension/connect",
  noIndex: true,
});

// useSearchParams in the form needs a Suspense boundary
export default function Page() {
  return (
    <Suspense>
      <ExtensionConnectForm />
    </Suspense>
  );
}
