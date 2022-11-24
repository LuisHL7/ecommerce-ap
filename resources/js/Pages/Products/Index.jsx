import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/inertia-react';
import { Card, TextInput } from 'flowbite-react';
import React, { useState } from "react";
import { Search } from 'react-feather';
import { FormattedMessage } from 'react-intl';

export default function Index(props) {
    console.log(props);
    const [filters, setFilters] = useState({
        search: '',
    });
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            cart={props.cart}
        >
            <Head title="Products" />
            {/* Search Input */}
            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
                <div className="col-span-1">

                </div>
                <div className="col-span-1">
                    <TextInput
                        className="w-full"
                        placeholder="Search"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
            </div>
            <hr  className="mb-6 border-gray-200" />
            {/* Products */}
            <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-5 px-5">
                {filters.search !== '' ? props.products.filter(product => product.name.toLowerCase().includes(filters.search.toLowerCase())).map(product => (
                    <Card
                        key={product.id}
                        title={product.name}
                        imgSrc={product.main_HD ? product.main_HD : product.main_image}
                        imgAlt={product.name}
                        href={route('products.show', product.id)}
                    >
                         <div className="grid grid-cols-5 grid-rows-2 gap-4"> 
                            <div className="col-span-5 row-span-1 text-center">
                                <p className=" text-sm">{product.name}</p>
                            </div>
                            <div className="col-span-2 row-span-1 text-center">
                                <p className="text-gray-500 text-sm  bg-gray-200 rounded-md p-1">{product.season}</p>
                            </div>
                            <div className="col-span-3 row-span-1 text-center">
                                <p className="text-gray-500 text-sm bg-gray-200 rounded-md p-1"><FormattedMessage id='op' defaultMessage='OP' /> {product.dosier.slice(0, product.dosier.length - 1)}</p>
                            </div>
                            
                        </div>
                    </Card>
                )) : props.products.map(product => (
                    <Card
                        key={product.id}
                        title={product.name}
                        imgSrc={product.main_HD ? product.main_HD : product.main_image}
                        imgAlt={product.name}
                        href={route('products.show', product.id)}
                    >
                        <div className="grid grid-cols-5 grid-rows-2 gap-4"> 
                            <div className="col-span-5 row-span-1 text-center">
                                <p className=" text-sm">{product.name}</p>
                            </div>
                            <div className="col-span-2 row-span-1 text-center">
                                <p className="text-gray-500 text-sm  bg-gray-200 rounded-md p-1">{product.season}</p>
                            </div>
                            <div className="col-span-3 row-span-1 text-center">
                                <p className="text-gray-500 text-sm bg-gray-200 rounded-md p-1"><FormattedMessage id='op' defaultMessage='OP' /> {product.dosier.slice(0, product.dosier.length - 1)}</p>
                            </div>
                            
                        </div>
                    </Card>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}