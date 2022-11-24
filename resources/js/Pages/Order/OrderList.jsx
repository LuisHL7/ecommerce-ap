import React from 'react';
import { Accordion } from 'flowbite-react';
import { FormattedNumber ,FormattedMessage } from 'react-intl';
import { ShoppingCart } from 'react-feather';
import moment from 'moment/moment';
import { Inertia } from '@inertiajs/inertia';

export const OrderList = (props) => {
    const orderList = props.orders.slice((props.page - 1) * props.perPage, props.page * props.perPage);
    return (
        <Accordion alwaysOpen={true} defaultValue={false}>

            {orderList.map((order) => (
                <Accordion.Panel>
                    <Accordion.Title>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            <FormattedMessage id="order.order_number" defaultMessage="Order number"/>: {order.docNumber}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <FormattedMessage id="order.order_date" defaultMessage="Order date"/>: {moment(order.order_date).format('DD.MM.YYYY')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="text-sm font-medium text-gray-900">
                                    <FormattedMessage id="total" defaultMessage="Total"/>: 
                                </div>
                                <div className="text-sm text-gray-500">
                                    <FormattedNumber value={order.total} style="currency" currency='EUR'/>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="text-sm font-medium text-gray-900">
                                    <FormattedMessage id="order.order_shipping" defaultMessage="Shipping address"/>: 
                                </div>
                                {typeof order.address == 'object' ?
                                (
                                    <div className="text-sm text-gray-500">
                                        {order.address.address}, {order.address.city}, {order.address.state}, {order.address.country}, {order.address.country_code}, {order.address.zip}
                                    </div>
                                )
                                : (
                                <div className="text-sm text-gray-500">
                                {order.address}, {order.city}, {order.state}, {order.country}, {order.country_code}, {order.zip}
                                </div>)}
                            </div>
                        </div>
                    </Accordion.Title>
                    <Accordion.Content>
                        {order.variants.map((variant) =>
                        <div className="grid grid-cols-6 gap-4 mb-5">
                        <div className="col-span-1">
                            <img src={order.products.find(product => product.id === variant.products_id).main_HD ?? order.products.find(product => product.id === variant.products_id).main_image} alt={order.products.find(product => product.id === variant.products_id).name} className=" object-cover"/>
                        </div>
                        <div className="col-span-3 pt-20">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-3">
                                    <p className="text-sm ">{order.products.find(product => product.id === variant.products_id).name}</p>
                                    <p className="text-sm text-gray-500">{variant.name}</p>
                                    <p className="text-sm text-gray-500">{variant.description}</p>
                                    <p className="text-sm text-gray-500">{variant.color}</p>
                                    <p className="text-sm text-gray-500"><FormattedMessage id='op' defaultMessage='OP'/>: {variant.dosier}</p>
                                    <p className="text-sm text-gray-500">{order.products.find(product => product.id === variant.products_id).season}</p>
                                    <p className="text-sm text-gray-500"><FormattedMessage id="size" defaultMessage="Size" />: {variant.size == 'N/A' ? '-' : variant.size}</p>
                                    <p className="text-sm text-gray-500"><FormattedMessage id="quantity" defaultMessage="Qty" />: {variant.pivot.quantity}</p>
                                </div>
                                <div className="col-span-1 text-right">
                                    <p className="text-sm text-gray-500">PVM: <FormattedNumber value={variant.price_spain} style="currency" currency="EUR" /></p>
                                    <p className="text-sm text-gray-500">PVP: <FormattedNumber value={variant.pvp_spain} style="currency" currency="EUR" /></p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2 justify-center flex items-center">
                            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" onClick={() => Inertia.get(route('orders.addToCart', variant.id))}>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                <span><FormattedMessage id="add_to_cart" defaultMessage="Add to cart" /></span>
                            </button>
                        </div>
                    </div>
                        )}

                    </Accordion.Content>
                </Accordion.Panel>
            ))}
        </Accordion >
    )
}
