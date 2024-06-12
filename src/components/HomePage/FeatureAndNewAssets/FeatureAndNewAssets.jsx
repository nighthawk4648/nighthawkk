import React from 'react';
import Features from './Features/Features';
import NewAssets from './NewAssets/NewAssets';

const FeatureAndNewAssets = ({categories}) => {
    return (
        <div className='bg-primary pt-10'>
            <Features categories={categories}  />
            <NewAssets categories={categories}  />
            
        </div>
    );
};

export default FeatureAndNewAssets;