import { Pro } from "@/components/Pro/Pro";

export async function generateMetadata() {
  
    const metaTitle = "Sketchshaper pro-3d premium assets Library"
    const metaDescription = "Support the future of details assets and unlock The Pro version of sketchshaper"

    return {
        title: `${metaTitle}`,
        description: `${metaDescription}`,
    };
}

const Page = () => {

  return (
    <Pro />
  );
};

export default Page;
