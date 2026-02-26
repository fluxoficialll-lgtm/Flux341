import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainHeader } from '../layout/MainHeader';

export const ProfileHeader = () => {
    const navigate = useNavigate();

    return (
        <MainHeader 
            leftContent={
                <button className="bg-none border-none text-[#00c2ff] text-lg cursor-pointer">
                    <i className="fa-solid fa-trophy"></i>
                </button>
            }
            rightContent={
                <button 
                    onClick={() => navigate('/settings')} 
                    className="bg-none border-none text-[#00c2ff] text-lg cursor-pointer"
                >
                    <i className="fa-solid fa-gear"></i>
                </button>
            }
        />
    );
};