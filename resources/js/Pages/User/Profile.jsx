import React from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Modal } from "flowbite-react";
import { Inertia } from "@inertiajs/inertia";   

// Pagina que permite al usuario ver su perfil
export default function Profile(props) {
    const [show, setShow] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const handleChange = (e) => {
        if(password !== confirmPassword) {
            setError('Password does not match');
        } else {
            setError('');
        }
        if(error === '') {
            Inertia.post(route('password.update'), {
                password: password,
                password_confirmation: confirmPassword,
            });
        }
    }
    return (
        <Authenticated auth={props.auth} errors={props.errors} cart={props.cart}>
            <div className="grid grid-cols-5 gap-4 h-[calc(100vh-4rem)]">
                <div className="col-span-1">

                </div>
                <div className="col-span-3">
                    <div className="bg-white dark:bg-gray-800 p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <h1 className="text-2xl font-bold">Datos de la cuenta</h1>
                            </div>
                            <div className="col-span-2">
                                <hr />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Nombre
                                </label>
                                <p className="w-full border border-gray-200 rounded-md p-2">{props.auth.user.name}</p>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Email
                                </label>
                                <p className="w-full border border-gray-200 rounded-md p-2">{props.auth.user.email}</p>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Contraseña
                                </label>
                                <p className="w-full border border-gray-200 rounded-md p-2">********</p>
                            </div>
                            <div className="col-span-2">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShow(true)}>
                                    Cambiar contraseña
                                </button>
                            </div>
                            <div className="col-span-2">
                                <hr />
                            </div>
                            <div className="col-span-2">
                                <h1 className="text-2xl font-bold">Datos de la Empresa</h1>
                            </div>
                            <div className="col-span-2">
                                <hr />
                            </div>
                            {props.companies.map((company) => (
                                <>
                                <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Nombre
                                </label>
                                <p className="w-full border border-gray-200 rounded-md p-2">{company.name}</p>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Email de Contacto
                                </label>
                                <p className="w-full border border-gray-200 rounded-md p-2">{company.email}</p>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Telefono
                                </label>
                                <p className="w-full border border-gray-200 rounded-md p-2">{company.phone}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Direcciones 
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                {company.address.map((address) => (
                                    <p className="w-full border mt-3 border-gray-200 rounded-md p-2">{address.address}, {address.city}, {address.state}, {address.country}, {address.country_code}, {address.zip}</p> 
                                ))}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <hr />
                            </div>
                                </>   
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={show}
                onClose={() => setShow(false)}
                title="Cambiar contraseña"
            >
                <div className="grid grid-cols-2 gap-4 p-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Contraseña
                        </label>
                        <input type="password" className="w-full border border-gray-200 rounded-md p-2" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Confirmar contraseña
                        </label>
                        <input type="password" className="w-full border border-gray-200 rounded-md p-2" onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    {error !== '' && (
                        <p className="text-red-500 col-span-2">{error}</p>
                    )}
                    <div className="col-span-1 flex justify-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-auto rounded" onClick={handleChange}>
                            Cambiar contraseña
                        </button>
                    </div>
                    <div className="col-span-1 flex justify-center">
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShow(false)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>
        </Authenticated>
    );
}