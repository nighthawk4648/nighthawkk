import React from 'react';

const AboutUs = ({ aboutUs }) => {
    return (
        <div className='bg-thirdColor p-5'>
            {aboutUs?.title && <h1 className='text-center font-semibold text-2xl'>{aboutUs?.title}</h1>}

            {
                aboutUs?.short_description && <p className='text-center mt-2'>{aboutUs?.short_description}</p>
            }

            {  aboutUs?.content && <div dangerouslySetInnerHTML={{ __html: aboutUs?.content }} ></div>}

        </div>
    );
};

export default AboutUs;