/* eslint-disable react/react-in-jsx-scope */
import lottie_json from './success.json';
import Lottie from 'react-lottie';

export function SuccessAnimation(){

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: lottie_json
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