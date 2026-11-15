import { Suspense } from "react";
import { LoginForm } from "@/components/Auth/AuthForms";
import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Sign in",
  description: "Your Sketch shaper account.",
  pathname: "/login",
  noIndex: true,
});

// useSearchParams in the form needs a Suspense boundary
export default function Page() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
