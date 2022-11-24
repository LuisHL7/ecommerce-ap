import { TablesProducts } from '@/Components/TablesProducts';
import { Inertia } from '@inertiajs/inertia';
import { Modal } from 'flowbite-react';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export const DetailsProducts = ( props ) => {
    const [ openModal, setOpenModal ] = useState( false );

    const paymentMethodDisplay = ( paymentMethod ) => {
        switch ( paymentMethod ) {
            case 'receipt':
                return <FormattedMessage id="receipt" defaultMessage="Receipt" />;
            case 'transfer':
                return <FormattedMessage id="transfer" defaultMessage="Transfer" />;
            case 'check':
                return <FormattedMessage id="check" defaultMessage="Check" />;
        }
    };
    return (
        <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
                <TablesProducts data={ props }/>
            </div>
            <div className="col-span-1">
                <div className="bg-white dark:bg-gray-800 dark:border-gray-700 border rounded-lg p-4">
                <div className='display-2 p-10 text-center'>
                    <img className='mx-auto d-block w-32' src="/img/check.svg" alt="" />
                    <h1 className="p-10 text-4xl ">¡Felicidades tu pedido ha sido realizado con éxito!</h1>
                </div>
                <div className="border border-primary border-3 opacity-75">
                    <hr />
                </div>
                <div className="p-10">
                    <button className="bg-gray-800 dark:bg-gray-800 dark:text-gray-200 text-white font-bold py-2 px-4 rounded-lg w-full" onClick={ () => setOpenModal( true ) }>Ver detalles del pedido</button>
                    <a href={route('orders.index')} >
                    <button className="bg-gray-800 dark:bg-gray-800 dark:text-gray-200 text-white font-bold py-2 px-4 rounded-lg w-full mt-2" >
                        Ver pedidos
                    </button>
                    </a>
                </div>
            </div>
            </div>
            <Modal show={ openModal } onClose={ () => setOpenModal( false ) }>
                <div className="p-5">
                    <h1 className="text-2xl text-center font-bold">Detalles del pedido</h1>
                    <div className="border border-primary border-3 opacity-75 mt-5">
                        <hr />
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Fecha de entrega estimada
                                </label>
                                <p className="w-full border border-gray-200 rounded-md p-2">{props.products.dueDate}</p>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Método de pago
                                </label>
                                <p className="w-full border border-gray-200 rounded-md p-2">{paymentMethodDisplay( props.products.paymentMethod )}</p>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Dirección de entrega
                                </label>
                                <p className="w-full border border-gray-200 rounded-md p-2">{props.products.address}, {props.products.city}, {props.products.state}, {props.products.country}, {props.products.countryCode}, {props.products.zip}</p>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Notas
                                </label>
                                <p className="w-full border border-gray-200 rounded-md p-2">{props.products.notes}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-primary border-3 opacity-75 mt-5">
                        <hr />
                    </div>
                    <div className="p-5">
                        <button className="bg-gray-800 dark:bg-gray-800 dark:text-gray-200 text-white font-bold py-2 px-4 rounded-lg w-full mt-2" onClick={ () => setOpenModal( false ) }>
                            Cerrar
                        </button>
                    </div>
                </div>
            </Modal> 
        </div>
    )
}