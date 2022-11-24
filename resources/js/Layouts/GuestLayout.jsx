import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/inertia-react';
import { IntlProvider } from 'react-intl';
import Spanish from '../lang/es.json';
import English from '../lang/en.json';
import Italian from '../lang/it.json';

export default function Guest({ children }) {
    const [locale, setLocale] = React.useState(window.navigator.language.split(/[-_]/)[0]);
    return (
        <IntlProvider locale={locale === 'es' ? 'es' : locale === 'it' ? 'it' : 'en'} messages={locale === 'es' ? Spanish : locale === 'it' ? Italian : English}>   
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div>
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
        </IntlProvider>
    );
}
