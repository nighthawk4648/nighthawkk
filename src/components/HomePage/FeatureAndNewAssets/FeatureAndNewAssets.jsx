import React from 'react';
import Features from './Features/Features';
import NewAssets from './NewAssets/NewAssets';

const FeatureAndNewAssets = () => {
    return (
        <div className='bg-primary pt-10'>
            <Features/>
            <NewAssets/>
            
        </div>
    );
};

export default FeatureAndNewAssets;