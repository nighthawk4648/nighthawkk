import React from 'react';
import Features from './Features/Features';
import NewAssets from './NewAssets/NewAssets';
import Innovative from '../Innovative/Innovative';

const FeatureAndNewAssets = ({categories, innovatives}) => {
    return (
        <div className=''>
            <Features categories={categories}  />
            <Innovative innovatives={ innovatives} />
            <NewAssets categories={categories}  />
            
        </div>
    );
};

export default FeatureAndNewAssets;