import Image from "next/image";


const MaterialCard = ({ title, image, aspectRatio = "square", isGridImage = false }) => {
    return (
        <div className="relative overflow-hidden rounded-lg transition-all hover:scale-[1.02] cursor-pointer">
            {isGridImage ? (
                <div className="relative aspect-square overflow-hidden">
                    <div className="grid grid-cols-4 grid-rows-4 h-full w-full">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className="relative overflow-hidden">
                                <div
                                    className="w-full h-full bg-gray-400"
                                // style={{
                                //     // backgroundColor: getRandomWoodColor()
                                //     backgroundColor: "gray"
                                // }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        {title.split(' ').map((word, i) => (
                            <span key={i} className="block text-white font-bold text-xl md:text-2xl leading-tight">
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={`relative overflow-hidden ${aspectRatio === "square" ? "aspect-square" : "aspect-[4/3]"}`}>
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${image})`,
                            minHeight: '200px'
                        }}
                    ></div>
                    {title && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <h3 className="font-bold text-xl md:text-2xl text-white">{title}</h3>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MaterialCard;