import React from 'react';
import Features from './Features/Features';
import NewAssets from './NewAssets/NewAssets';

const FeatureAndNewAssets = ({categories}) => {
    return (
        <div className=''>
            <Features categories={categories}  />
            <NewAssets categories={categories}  />
            
        </div>
    );
};

export default FeatureAndNewAssets;