import React from 'react'
import { OrderList } from './OrderList'
import { Tabs } from 'flowbite-react';
import { ProductsList } from './ProductsList';
import { X } from 'react-feather';
import { FormattedMessage } from 'react-intl';

export const TabsOrders = (props) => {
    const [page, setPage] = React.useState(1);
    const perPage = 3;
    const [productFilter, setProductFilter] = React.useState('');
    const handleProductFilter = (id) => {
        setProductFilter(id);
    }
    return (
        <div className="px-20">
            <Tabs.Group aria-label="Tabs with icons" style="underline" >
                <Tabs.Item active={true} title={<FormattedMessage id="Orders" defaultMessage="Orders"/>}>
                    <OrderList orders={props.orders} page={page} perPage={perPage} />
                    {props.orders.length > 3 &&
                    <div className="flex justify-center mt-5">
                        <div className="flex items-center">
                        <button className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setPage(page - 1)} disabled={page === 1}>
                            Previous
                        </button>
                        {Array.from(Array(Math.ceil(props.orders.length / perPage)).keys()).map((index) => (
                            <button className={`px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 ${page === index + 1 ? 'bg-gray-50' : ''}`} onClick={() => setPage(index + 1)}>{index + 1}</button>
                        ))}
                        <button className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setPage(page + 1)} disabled={page === Math.ceil(props.orders.length / perPage)}>
                            Next
                        </button>
                    </div>
                </div>
            }
                </Tabs.Item>
                <Tabs.Item title={<FormattedMessage id="Products" defaultMessage="Products"/>}>
                    {(productFilter === '') ?
                    <ProductsList products={props.products} handleProductFilter={handleProductFilter} /> 
                    :
                    <>
                    <button className="grid grid-cols-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setProductFilter('')}>
                        <div className="col-span-1">
                            <X size={20} />
                        </div>
                        <div className="col-span-1">
                        {props.products.find(product => product.id === productFilter).name}
                        </div>  
                    </button>
                    <hr  className="border-gray-300 my-5"/>
                    <OrderList orders={props.orders.filter((order) => order.products.map((product) => product.id).includes(productFilter))} page={page} perPage={perPage} />
                    </>
                    }
                </Tabs.Item>
            </Tabs.Group>
        </div>

    )
}
