import { Suspense } from "react";
import { SignUpForm } from "@/components/Auth/AuthForms";
import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Create your account",
  description: "Your Sketch shaper account.",
  pathname: "/signup",
  noIndex: true,
});

// useSearchParams in the form needs a Suspense boundary
export default function Page() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
