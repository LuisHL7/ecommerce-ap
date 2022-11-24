import React from 'react';
import { Head } from '@inertiajs/inertia-react';
import { CarouselMain } from '@/Components/CarouselMain';
import HomeLayout from '@/Layouts/HomeLayout';
import { Modal } from 'flowbite-react';
import { Inertia } from '@inertiajs/inertia';






export default function Home(props) {
    
    const bannerList = [
        '/img/banner1.jpg',
        '/img/banner2.png',
        '/img/banner3.png',
        '/img/banner4.png',
        '/img/banner5.png',
    ];
    
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
        <HomeLayout
            errors={props.errors}
            auth={props.auth}
            cart={props.cart}
        >
            <Head title="Home" />
            {props.auth.user && props.auth.user.check == 0 ? (
                <Modal
                    title="Please change your password"
                    show={true}
                >
                    <div className="grid grid-cols-1 gap-6 mt-4 p-8">
                        <div className="col-span-1 sm:col-span-1">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    autoComplete="password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div className="col-span-1 sm:col-span-1">
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input

                                    type="password"
                                    name="password_confirmation"
                                    id="password_confirmation"
                                    autoComplete="password_confirmation"
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        {error !== '' ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            ''
                        )}
                        <div className="col-span-1 sm:col-span-1">
                            <button
                                type="submit"
                                onClick={handleChange}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </Modal>
            ) : null}

            {/* <Slider images={ bannerList }/> */}
            <CarouselMain images={ bannerList } />


        </HomeLayout>
    );
}
