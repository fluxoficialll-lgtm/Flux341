
import React from 'react';

interface Props {
    text?: string;
}

export const LoadingScreen: React.FC<Props> = ({ text }) => {
    return (
        <div className="min-h-screen bg-[#0c0f14] flex flex-col items-center justify-center text-white">
            <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#00c2ff]"></i>
            {text && <p className="mt-4 text-sm font-bold tracking-wider">{text}</p>}
        </div>
    );
};
