import MaterialCard from "../MaterialCard/MaterialCard";


function MaterialCardsGrid() {
    return (
        <div className="text-white p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Wood Floor Materials Card */}
                <MaterialCard
                    title="LUMION 2023 150 WOOD FLOOR MATERIALS LIBRARY"
                    image="/public/assets/blog/images/img2.jpeg"
                    isGridImage={true}
                />

                {/* Pavement Texture Card */}
                <MaterialCard
                    title="Pavement"
                    image="/public/assets/blog/images/img3.jpeg"
                    aspectRatio="landscape"
                />

                {/* Wood Wall Interior Card */}
                <MaterialCard
                    title="Wood Wall"
                    image="/public/assets/blog/blogTwo.png"
                    aspectRatio="landscape"
                />

                {/* City Buildings Card */}
                <MaterialCard
                    title="City"
                    image="/placeholder.svg?height=400&width=400"
                    aspectRatio="landscape"
                />

                {/* Sand/Terrain Card */}
                <MaterialCard
                    title="LUMION"
                    image="/placeholder.svg?height=400&width=400"
                    aspectRatio="landscape"
                />

                {/* Stone Pavement Card */}
                <MaterialCard
                    title="Stone"
                    image="/placeholder.svg?height=400&width=400"
                    aspectRatio="landscape"
                />

                {/* Brick Sphere Card */}
                <MaterialCard
                    title="Brick Sphere"
                    image="/placeholder.svg?height=400&width=400"
                    aspectRatio="landscape"
                />

                {/* Stone Sphere Card */}
                <MaterialCard
                    title="Stone Sphere"
                    image="/placeholder.svg?height=400&width=400"
                    aspectRatio="landscape"
                />
            </div>
        </div>
    );
}

export default MaterialCardsGrid;