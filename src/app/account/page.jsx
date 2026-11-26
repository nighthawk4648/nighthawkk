import { AccountPage } from "@/components/Auth/AuthForms";
import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Your account",
  description: "Your Sketch shaper account and membership.",
  pathname: "/account",
  noIndex: true,
});

export default function Page() {
  return <AccountPage />;
}
