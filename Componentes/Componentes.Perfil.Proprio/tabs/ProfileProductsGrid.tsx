import React from 'react';

export const ProfileProductsGrid = ({ products }) => (
    <div className="grid grid-cols-2 gap-4 p-4">
        {products.map(product => (
            <div key={product.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="aspect-square bg-gray-600 rounded-lg mb-2"></div>
                <p>Product {product.id}</p>
            </div>
        ))}
    </div>
);