/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import json_lottie from './error.json';
import Lottie from 'react-lottie';

export function ErrorAnimation(){

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: json_lottie
    };

    return(
    <>
        <Lottie 
        options={defaultOptions}
        height={200}
        width={200}
        />
    </>
    );
}