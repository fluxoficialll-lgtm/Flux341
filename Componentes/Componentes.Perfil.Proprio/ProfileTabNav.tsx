import React from 'react';

export const ProfileTabNav = ({ activeTab, setActiveTab, hasProducts }) => (
    <div className="flex justify-around bg-gray-800 p-2">
        <button onClick={() => setActiveTab('posts')} className={`${activeTab === 'posts' ? 'text-white' : 'text-gray-400'}`}>Posts</button>
        {hasProducts && <button onClick={() => setActiveTab('products')} className={`${activeTab === 'products' ? 'text-white' : 'text-gray-400'}`}>Products</button>}
        <button onClick={() => setActiveTab('fotos')} className={`${activeTab === 'fotos' ? 'text-white' : 'text-gray-400'}`}>Fotos</button>
        <button onClick={() => setActiveTab('reels')} className={`${activeTab === 'reels' ? 'text-white' : 'text-gray-400'}`}>Reels</button>
    </div>
);