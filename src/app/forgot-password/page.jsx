import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/Auth/AuthForms";
import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Forgot your password",
  description: "Your Sketch shaper account.",
  pathname: "/forgot-password",
  noIndex: true,
});

// useSearchParams in the form needs a Suspense boundary
export default function Page() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
