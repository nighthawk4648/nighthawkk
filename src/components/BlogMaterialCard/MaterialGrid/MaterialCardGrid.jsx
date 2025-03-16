// components/MaterialGrid.jsx
import React from 'react';
import MaterialCard from '../MaterialCard/MaterialCard';
import Link from 'next/link';

const MaterialCardGrid = ({ materials }) => {
    return (
        <Link href='/blog-details' className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {materials.map((material, index) => (
                <MaterialCard
                    key={index}
                    imageSrc={material.imageSrc}
                    title={material.title}
                    href={material.href}
                />
            ))}
        </Link>
    );
};

export default MaterialCardGrid;