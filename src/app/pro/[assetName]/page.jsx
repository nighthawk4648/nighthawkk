import { SketchShaperProFiles } from '@/components/SketchShaperProFiles/SketchShaperProFiles';
import getData from '@/utils/getData';


export async function generateMetadata({ params }) {
    const { assetName } = params;
    const categoryId = assetName?.split("-").slice(-1);

    const metaSettings = await getData(`sketchshaper-pro-categories/${categoryId}`);
    const metaTitle = metaSettings?.data?.meta_title;
    const metaDescription = metaSettings?.data?.meta_description;

    return {
        title: `${metaTitle}`,
        description: `${metaDescription}`,
    };
}

const Page = async ({ params }) => {

    const { assetName } = params;
    const categoryId = assetName?.split("-").slice(-1);


    return (
        <div>
            <SketchShaperProFiles categoryId={categoryId} />
        </div>

    );
};

export default Page;