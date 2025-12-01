'use client';

import { useEffect, useRef, useState } from "react";

export const HorizontalBanner = () => {
  const adRef = useRef(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.adsbygoogle && adRef.current) {
      try {
        if (!adRef.current.hasAttribute('data-adsbygoogle-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsAdLoaded(true); // show banner when ad is ready
        }
      } catch (e) {
        console.error("AdSense error:", e);
        setIsAdLoaded(false);
      }
    }
  }, []);

  return (
    <div
      className="w-full flex justify-center items-center bg-gradient-to-br from-gray-900 to-black"
      style={{ minHeight: isAdLoaded ? "150px" : "0" }}
    >
      {isAdLoaded && (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "150px", textAlign: "center" }}
          data-ad-client="ca-pub-5557791257949251"
          data-ad-slot="2114378043"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
};
