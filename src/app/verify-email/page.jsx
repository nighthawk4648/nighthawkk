import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/Auth/AuthForms";
import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Confirm your email",
  description: "Your Sketch shaper account.",
  pathname: "/verify-email",
  noIndex: true,
});

// useSearchParams in the form needs a Suspense boundary
export default function Page() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
