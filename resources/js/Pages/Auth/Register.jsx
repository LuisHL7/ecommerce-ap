import React, { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { FormattedMessage } from 'react-intl';

export default function Register(props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        company: '',
        password: '',
        password_confirmation: '',
    });
    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel forInput="name" value={<FormattedMessage id="name" defaultMessage="Name" />} />

                    <TextInput
                        type="text"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        handleChange={onHandleChange}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel forInput="email" value={<FormattedMessage id="email" defaultMessage="Email" />} />

                    <TextInput
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        handleChange={onHandleChange}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel forInput="company" value={<FormattedMessage id="company" defaultMessage="Company" />} />

                    <TextInput
                        type="text"
                        name="company"
                        className="mt-1 block w-full"
                        autoComplete="company"
                        handleChange={(e) => setData('company', props.companies.find((company) => company.name === e.target.value)?.id)}
                        required
                        list="companies"
                    />
                    <datalist id="companies">
                        {props.companies.map((company) => (
                            <option key={company.id} value={company.name} />
                        ))}
                    </datalist>

                    <InputError message={errors.company} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel forInput="password" value={<FormattedMessage id="password" defaultMessage="Password" />} />

                    <TextInput
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        handleChange={onHandleChange}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel forInput="password_confirmation" value={<FormattedMessage id="password_confirmation" defaultMessage="Confirm Password" />} />

                    <TextInput
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        handleChange={onHandleChange}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link href={route('login')} className="underline text-sm text-gray-600 hover:text-gray-900">
                        <FormattedMessage id="already_registered" defaultMessage="Already registered?" />
                    </Link>

                    <PrimaryButton className="ml-4" processing={processing}>
                        <FormattedMessage id="register" defaultMessage="Register" />
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
