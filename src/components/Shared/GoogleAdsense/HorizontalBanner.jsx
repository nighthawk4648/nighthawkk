import { useEffect } from "react";

// Replace the problematic section with this
export  const HorizontalBanner = () => {
    useEffect(() => {
      try {
        // Initialize ads when component mounts
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }, []);
  
    return (
      <div className="my-[1px] w-full h-[150px] bg-primary ">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-5557791257949251"
          data-ad-slot="2114378043"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  };