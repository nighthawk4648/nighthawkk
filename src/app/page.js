import Carousel from "@/components/HomePage/Carousel/Carousel";
import Explore from "@/components/HomePage/Explore/Explore";
import FeatureAndNewAssets from "@/components/HomePage/FeatureAndNewAssets/FeatureAndNewAssets";
import getData from "@/utils/getData";

export default async function Home() {

  const carousels = await getData('sliders');

  const categories = await getData('categories');
 

  return (
    <main  className='container'>
      <Carousel carousels={carousels?.data}  />
      <FeatureAndNewAssets categories={categories?.data} />
      <Explore  categories={categories?.data} />
     
    </main>
  );
}
