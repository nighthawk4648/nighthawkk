'use client';

import { useEffect, useRef } from "react";

export const CategoryAds = () => {
  const adRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.adsbygoogle && adRef.current) {
      try {
        // Check if ad has already been initialized on this <ins> element
        if (!adRef.current.hasAttribute('data-adsbygoogle-status')) {
          window.adsbygoogle.push({});
        }
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  return (
   <div className="w-full h-[150px] flex justify-center items-center bg-gradient-to-br from-gray-900 to-black py-2 border-b-2 border-t-2 border-gray-500 ">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "150px", textAlign: "center" }}
        data-ad-client="ca-pub-5557791257949251"
        data-ad-slot="2114378043"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};