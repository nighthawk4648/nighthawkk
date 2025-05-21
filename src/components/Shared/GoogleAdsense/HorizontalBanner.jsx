'use client';

import { useEffect, useRef } from "react";

export const HorizontalBanner = () => {
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
    <div className="my-[1px] w-full bg-primary flex justify-center items-center">
      <div className="max-w-2xl w-full"> {/* This wrapper controls the width */}
        <ins
          ref={adRef}
          className="adsbygoogle mx-auto"
          style={{ 
            display: "block", 
            width: "100%", 
            height: "150px",
            textAlign: "center" 
          }}
          data-ad-client="ca-pub-5557791257949251"
          data-ad-slot="2114378043"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};