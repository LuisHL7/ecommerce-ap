import React from 'react'
import { Card } from 'flowbite-react';

export const ProductsList = (props) => {
    return (
        <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-5 px-5">
            {props.products.map((product) => (
                <button className="w-full" onClick={() => props.handleProductFilter(product.id)}>
                <Card
                    key={product.id}
                    title={product.name}
                    imgSrc={product.main_HD ?? product.main_image}
                    imgAlt={product.name}
                >
                    <div className="grid grid-cols-2 gap-1">
                        <div className="col-span-2">
                            <p className="text-gray-500 text-sm">{product.name}</p>
                        </div>
                    </div>
                </Card>
                </button>
            ))}
        </div>
    )
}
