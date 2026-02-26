import React from 'react';

export const ProfileReelsGrid = ({ reels }) => (
    <div className="grid grid-cols-3 gap-1">
        {reels.map(reel => (
            <div key={reel.id} className="aspect-square bg-gray-700"></div>
        ))}
    </div>
);