
import React from 'react';

import { Gallery } from '../../components/Gallery/Gallery';

export async function generateMetadata() {
  
    const metaTitle = "Render Gallery • Sketch shaper"
    const metaDescription = "Artwork submitted by dozens of users, created using our assets."

    return {
        title: `${metaTitle}`,
        description: `${metaDescription}`,
    };
}

const Page = () => {
  return (
   <Gallery />
  );
};

export default Page;
