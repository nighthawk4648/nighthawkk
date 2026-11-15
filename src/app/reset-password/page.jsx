import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/Auth/AuthForms";
import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Choose a new password",
  description: "Your Sketch shaper account.",
  pathname: "/reset-password",
  noIndex: true,
});

// useSearchParams in the form needs a Suspense boundary
export default function Page() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
