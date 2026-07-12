// components/MaterialCard.jsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MaterialCard = ({ imageSrc, title, href }) => {
    return (
        <Link href={href} className="block overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.02]">
            <div className="relative w-full h-64">
                <Image
                    src={imageSrc}
                    alt={title || "Material image"}
                    fill
                    className="object-cover"
                />

                {title && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center">
                            <h3 className="text-2xl font-bold uppercase tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                                {title.split('\n').map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </h3>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default MaterialCard;