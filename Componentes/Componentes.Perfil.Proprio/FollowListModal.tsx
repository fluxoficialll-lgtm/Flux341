import React from 'react';

export const FollowListModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-xl mb-4">Followers</h2>
            {/* Add follower list here */}
            <button>Close</button>
        </div>
    </div>
);