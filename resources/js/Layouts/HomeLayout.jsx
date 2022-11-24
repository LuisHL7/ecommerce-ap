import React, { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { ShoppingCart } from 'react-feather';
import { Link } from '@inertiajs/inertia-react';
import { Footer } from 'flowbite-react';
import { FormattedMessage } from 'react-intl';


export default function HomeLayout({header, children, auth, errors, cart}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="sticky top-0 w-full bg-white z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shadow-sm">
                {/* <div className=" mx-auto px-4 sm:px-6 lg:px-8 shadow-sm"> */}
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto text-gray-500" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href={route('home')} active={route().current('home')}>
                                    <FormattedMessage id="Home" defaultMessage="Home" />
                                </NavLink>

                                <NavLink href={route('products.index')} active={route().current('products.*')}>
                                    <FormattedMessage id="Products" defaultMessage="Products" />
                                </NavLink>

                                <NavLink href={route('orders.index')} active={route().current('orders.*')}>
                                    <FormattedMessage id="Orders" defaultMessage="Orders" />
                                </NavLink>
                            </div>
                        </div>

                        { auth.user ? (
                             <div className="hidden sm:flex sm:items-center sm:ml-6">
                             {/* Shopping Cart Button */}
                             <NavLink href={route('cart.index')} active={route().current('cart.*')}>
                                 <ShoppingCart className="h-4 w-4" />
                                 <span className="ml-1">{cart}</span>
                             </NavLink>
 
                             {/* Profile dropdown */}
                             <div className="ml-3 relative">
                                 <Dropdown>
                                     <Dropdown.Trigger>
                                         <span className="inline-flex rounded-md">
                                             <button
                                                 type="button"
                                                 className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                             >
                                                 {auth.user.email}
 
                                                 <svg
                                                     className="ml-2 -mr-0.5 h-4 w-4"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                     viewBox="0 0 20 20"
                                                     fill="currentColor"
                                                 >
                                                     <path
                                                         fillRule="evenodd"
                                                         d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                         clipRule="evenodd"
                                                     />
                                                 </svg>
                                             </button>
                                         </span>
                                     </Dropdown.Trigger>
 
                                     <Dropdown.Content>
                                        <Dropdown.Link href={route('user.profile')} method="get">
                                            <FormattedMessage id="Profile" defaultMessage="Profile" />
                                        </Dropdown.Link>
                                         <Dropdown.Link href={route('logout')} method="post" as="button">
                                            <FormattedMessage id="Logout" defaultMessage="Logout" />
                                         </Dropdown.Link>
                                     </Dropdown.Content>
                                 </Dropdown>
                             </div>
                         </div>
                        ) : (
                            <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {/* Login and Register Buttons */}
                            <div className="ml-3 relative">
                                <a href={route('login')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition duration-150 ease-in-out">
                                    <FormattedMessage id="Login" defaultMessage="Login" />
                                </a>
                            </div>
                            </div>
                        )}

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('home')} active={route().current('home')}>
                            <FormattedMessage id="Home" defaultMessage="Home" />
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('products.index')} active={route().current('products.*')}>
                            <FormattedMessage id="Products" defaultMessage="Products" />
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('orders.index')} active={route().current('orders.*')}>
                            <FormattedMessage id="Orders" defaultMessage="Orders" />
                        </ResponsiveNavLink>
                    </div>

                    {auth.user ? (
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        {/* Shopping Cart Button */}
                        <ResponsiveNavLink href={route('cart.index')} active={route().current('cart.*')}>
                            <ShoppingCart className="h-4 w-4" />
                            <span className="ml-1">{cart}</span>
                        </ResponsiveNavLink>
                        {/* Profile dropdown */}
                        <div className="px-4">
                            <div className="font-medium text-sm text-gray-500">{auth.user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                <FormattedMessage id="Logout" defaultMessage="Logout" />
                            </ResponsiveNavLink>
                        </div>
                    </div>
                    ) : (
                        <div className="pt-4 pb-1 border-t border-gray-200">
                        {/* Login and Register Links */}
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('login')}>
                                <FormattedMessage id="Login" defaultMessage="Login" />
                            </ResponsiveNavLink>
                        </div>
                    </div>
                    )}
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main className='bg-white' >{children}</main>

            <Footer container={true}>
                <div className="w-full">
                    <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
                      <div>
                        <ApplicationLogo className="block h-10 w-auto fill-current text-gray-600" />
                      </div>
                      <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
                        
                      </div>
                    </div>
                    <Footer.Divider />
                    <div className="w-full sm:flex sm:items-center sm:justify-between">
                      <Footer.Copyright
                        href="#"
                        by="Alberto Palatchi"
                        year={2022}
                      />
                      {/* Socials */}
                      <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                      </div>
                    </div>
                </div>
            </Footer>
        </div>
    );
}
