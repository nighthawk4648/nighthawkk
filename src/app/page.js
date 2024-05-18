import Carousel from "@/components/HomePage/Carousel/Carousel";
import FeatureAndNewAssets from "@/components/HomePage/FeatureAndNewAssets/FeatureAndNewAssets";
import Image from "next/image";

export default function Home() {
  return (
    <main  className='container'>
      <Carousel/>
      <FeatureAndNewAssets/>
     
    </main>
  );
}
