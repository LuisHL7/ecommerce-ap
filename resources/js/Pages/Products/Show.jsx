import React, { useEffect } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/inertia-react';
import { Inertia } from "@inertiajs/inertia";
import { FormattedNumber, FormattedMessage } from 'react-intl';
import { Modal } from "flowbite-react";
import { User, X } from "react-feather";

export default function Show(props) {
    console.log(props);
    const [selectedImage, setSelectedImage] = React.useState(props.product.main_HD);
    const [dosier, setDosier] = React.useState(props.preselected ? props.preselected.dosier : props.variants[0].dosier);
    const [filters, setFilters] = React.useState({
        color: props.preselected ? props.preselected.color : '',
        size: '',
        name: props.preselected ? props.preselected.name : props.variants[0].name,
        description: props.preselected ? props.preselected.description : props.variants[0].description,
    });
    const [showModal, setShowModal] = React.useState(false);
    const [selectedVariant, setSelectedVariant] = React.useState(null);
    const [images, setImages] = React.useState([
        props.product.main_HD,
        props.product.second_HD,
        props.product.third_HD,
    ])
    let usedVariants = [];
    let usedVariants2 = [];
    let usedColors = [];
    let usedSizes = [];
    let usedDosiers = [];
    useEffect(() => {
        if(filters.name == 'COLA/TRAIN') {
            
            setSelectedVariant(props.variants.find((variant) => variant.color === filters.color && variant.size === "N/A" && variant.name === filters.name && variant.description === filters.description));
          
        }   
        props.variants.filter((variant) => variant.color === filters.color && variant.size === filters.size && variant.name === filters.name && variant.description === filters.description).map((variant) => {
            setSelectedVariant(variant);
        });
    }, [filters]);

    useEffect(() => {
        setFilters({
            ...filters,
            name: props.variants.find((variant) => variant.dosier == dosier)?.name,
            description: props.variants.find((variant) => variant.dosier == dosier)?.description,
            color: props.variants.find((variant) => variant.dosier == dosier)?.color,
        });
    }, [dosier]);
    
    const handleAddToCart = (e) => {
        e.preventDefault();
        Inertia.post(route('cart.store'), {
            id: selectedVariant.id,
            name: selectedVariant.name,
            price: props.companies[0].currency == 'eur' && props.companies[0].language == 'es' ? selectedVariant.price_spain : props.companies[0].currency != 'eur' && props.companies[0].language !== 'es' ? selectedVariant.price_gb : selectedVariant.price_fai,
            product_id: selectedVariant.products_id,
        });
    }

    
            
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            cart={props.cart}
        >
            <Head title={props.product.name} />

            <div className="grid grid-cols-6 md:grid-cols-8 gap-4 bg-white">
                <div className="col-span-4">
                    <div className="grid grid-cols-4 gap-1">
                        <div className="col-span-1 space-y-1">
                            {images.map((image) => (
                                <img
                                    key={image}
                                    src={image}
                                    alt={props.product.name}
                                    className="object-cover"
                                    onMouseOver={() => setSelectedImage(image)}
                                />
                            ))}
                        </div>
                        <div className="col-span-3">
                            <img
                                src={selectedImage}
                                alt={props.product.name}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-4 px-28">
                    <div className="grid grid-cols-1 gap-4 my-4">
                        {/* <div className="col-span-1 text-right">
                            {props.ids.includes(props.product.id -1) ? (<a href={route('products.show', props.product.id - 1)} className="text-gray-500 hover:text-gray-700 text-sm"><FormattedMessage id="products.show.previous" defaultMessage="Previous" /></a>) : null}
                            <span className="mx-2">|</span>
                            {props.ids.includes(props.product.id + 1) ? (<a href={route('products.show', props.product.id + 1)} className="text-gray-500 hover:text-gray-700 text-sm"><FormattedMessage id="products.show.next" defaultMessage="Next" /></a>) : null}
                        </div> */}
                        {/* <hr className="col-span-1 border-gray-200 border-b" /> */}
                        <div className="col-span-1">
                            <h1 className="text-2xl font-bold">{props.product.name}</h1>
                            <div className="text-gray-500 text-sm">
                                <FormattedMessage id="op" defaultMessage="OP" />: 
                                <select
                                    className="border border-gray-200 rounded-md px-2 py-1 w-24"
                                    value={dosier}
                                    onChange={(e) => setDosier(e.target.value)}
                                >
                                    {props.variants.map((variant) => {
                                        if(!usedDosiers.includes(variant.dosier)) {
                                            usedDosiers.push(variant.dosier)
                                            return (
                                                <option key={variant.dosier} value={variant.dosier}>{variant.dosier}</option>
                                            )
                                        }
                                    })}
                                </select>
                            </div>
                        </div>
                        
                        <div className="col-span-1">
                            <select className="form-select w-full rounded-md shadow-sm border-gray-300" onChange={(e) => {
                                setFilters({
                                    ...filters,
                                    name: e.target.value
                                })
                                setDosier(props.variants.find((variant) => variant.name == e.target.value && variant.color == filters.color && variant.description == filters.description)?.dosier);
                            }}>
                                {props.variants.filter((variant) => variant.description === filters.description).map((variant) => {
                                    if (!usedVariants2.includes(variant.name)) {
                                        usedVariants2.push(variant.name);
                                        if (variant.name == filters.name) {
                                            return (
                                                <option key={variant.name} value={variant.name} selected>{variant.name}</option>
                                            )
                                        }
                                        return (
                                            <option key={variant.id}>{variant.name}</option>
                                        )
                                    }
                                })}
                            </select>
                        </div>
                        <div className="col-span-1">
                            <select className="form-select w-full rounded-md shadow-sm border-gray-300" onChange={(e) => {
                                setFilters({
                                    ...filters,
                                    description: e.target.value
                                })
                                setDosier(props.variants.find((variant) => variant.description == e.target.value && variant.color == filters.color && variant.name == filters.name)?.dosier);
                            }}>
                                {props.variants.map((variant) => {
                                    if (!usedVariants.includes(variant.description)) {
                                        usedVariants.push(variant.description);
                                        if (variant.description == filters.description) {
                                            return (
                                                <option key={variant.description} value={variant.description} selected>{variant.description}</option>
                                            )
                                        }
                                        return (
                                            <option key={variant.id}>{variant.description}</option>
                                        )


                                    }
                                })}
                            </select>
                        </div>
                        <hr className="col-span-1 border-gray-200 border-b" />
                        <div className="col-span-1">
                        <div className="grid grid-cols-2 gap-4">
                        {props.variants.filter((variant) => variant.name === filters.name && variant.description === filters.description).map((variant) => {
                            if (!usedColors.includes(variant.color)) {
                                usedColors.push(variant.color);

                                if (variant.color === 'OFF WHITE') {
                                    if(filters.color === 'OFF WHITE') {
                                        return (
                                            <div key={variant.id} className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-700 mr-2 bg-[#F9F5F4] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-700">{variant.color}</span>
                                            </div>
                                        )
                                    } else {
                                    return (
                                    <div className="col-span-1" key={variant.id}>
                                        <button className="w-6 h-6 rounded-full border-2 border-gray-200 mr-2 bg-[#F9F5F4] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                            setFilters({
                                                ...filters,
                                                color: variant.color
                                            })
                                            setDosier(variant.dosier);
                                        }}></button>
                                        <span className="text-gray-500">{variant.color}</span>
                                    </div>
                                    )
                                    }
                                }

                                if (variant.color === 'OFF WHITE/BEIGE') {
                                    if(filters.color === 'OFF WHITE/BEIGE') {
                                        return (
                                            <div key={variant.id} className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-700 mr-2 bg-[#F9F5F4] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-700">{variant.color}</span>
                                            </div>
                                        )
                                    } else {
                                    return (
                                    <div className="col-span-1" key={variant.id}>
                                        <button className="w-6 h-6 rounded-full border-2 border-gray-200 mr-2 bg-[#F9F5F4] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                            setFilters({
                                                ...filters,
                                                color: variant.color
                                            })
                                            setDosier(variant.dosier);
                                        }}></button>
                                        <span className="text-gray-500">{variant.color}</span>
                                    </div>
                                    )
                                    }
                                }

                                if(variant.color === 'OFF WHITE/BEIGE/CRYSTAL') {
                                    if(filters.color === 'OFF WHITE/BEIGE/CRYSTAL') {
                                        return (
                                            <div key={variant.id} className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-700 mr-2 bg-[#F9F5F4] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-700">{variant.color}</span>
                                            </div>
                                        )
                                    } else {
                                    return (
                                    <div className="col-span-1" key={variant.id}>
                                        <button className="w-6 h-6 rounded-full border-2 border-gray-200 mr-2 bg-[#F9F5F4] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                            setFilters({
                                                ...filters,
                                                color: variant.color
                                            })
                                            setDosier(variant.dosier);
                                        }}></button>
                                        <span className="text-gray-500">{variant.color}</span>
                                    </div>
                                    )
                                    }
                                }

                                if (variant.color === 'OFF WHITE/CRYSTAL') {
                                    if(filters.color === 'OFF WHITE/CRYSTAL') {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-700 mr-2 bg-gradient-to-br from-[#F9F5F4] to-[#efece4] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-200 mr-2 bg-gradient-to-br from-[#F9F5F4] to-[#efece4] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    }
                                }
                                
                                if (variant.color === 'OFF WHITE/CRYSTAL/BEIGE') {
                                    if(filters.color === 'OFF WHITE/CRYSTAL/BEIGE') {

                                    return (
                                        <div className="col-span-1">
                                            <button className="w-6 h-6 rounded-full border-2 border-gray-700 mr-2 bg-gradient-to-br from-[#F9F5F4] via-[#efece4] to-[#d7d7a8] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                setFilters({
                                                    ...filters,
                                                    color: variant.color
                                                })
                                                setDosier(variant.dosier);
                                            }}></button>
                                            <span className="text-gray-500">{variant.color}</span>
                                        </div>
                                    )
                                    } else {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-200 mr-2 bg-gradient-to-br from-[#F9F5F4] via-[#efece4] to-[#d7d7a8] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    }
                                }

                                if (variant.color === 'OFF WHITE/LIGHT BEIGE') {
                                    if(filters.color === 'OFF WHITE/LIGHT BEIGE') {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-700 mr-2 bg-gradient-to-br from-[#F9F5F4] to-[#d7d7a8] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-200 mr-2 bg-gradient-to-br from-[#F9F5F4] to-[#d7d7a8] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    }
                                }

                                if (variant.color === 'OFF WHITE/CRYSTAL/GOLD') {
                                    if(filters.color === 'OFF WHITE/CRYSTAL/GOLD') {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-700 mr-2 bg-gradient-to-br from-[#F9F5F4] via-[#efece4] to-[#d7d7a8] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-200 mr-2 bg-gradient-to-br from-[#F9F5F4] via-[#efece4] to-[#d7d7a8] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    }
                                }

                                if (variant.color === 'IVORY') {
                                    if(filters.color === 'IVORY') {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-700 mr-2 bg-gradient-to-br from-[#F9F5F4] to-[#efece4] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-200 mr-2 bg-gradient-to-br from-[#F9F5F4] to-[#efece4] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    }
                                }

                                if (variant.color === 'IVORY/GOLD'){
                                    if(filters.color === 'IVORY/GOLD') {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-700 mr-2 bg-gradient-to-br from-[#F9F5F4] to-[#efece4] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-200 mr-2 bg-gradient-to-br from-[#F9F5F4] to-[#efece4] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    }
                                }

                                if (variant.color === 'OFF WHITE/CRYSTAL/LIGHT BEIGE') {
                                    if(filters.color === 'OFF WHITE/CRYSTAL/LIGHT BEIGE') {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-700 mr-2 bg-gradient-to-br from-[#F9F5F4] via-[#efece4] to-[#d7d7a8] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-200 mr-2 bg-gradient-to-br from-[#F9F5F4] via-[#efece4] to-[#d7d7a8] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    }
                                }

                                if (variant.color === 'OFF WHITE/GOLD') {
                                    if(filters.color === 'OFF WHITE/GOLD') {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-700 mr-2 bg-gradient-to-br from-[#F9F5F4] via-[#efece4] to-[#d7d7a8] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-200 mr-2 bg-gradient-to-br from-[#F9F5F4] via-[#efece4] to-[#d7d7a8] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    }
                                }

                                if (variant.color === 'OFF WHITE/LIGHT BEIGE/CRYSTAL') {
                                    if(filters.color === 'OFF WHITE/LIGHT BEIGE/CRYSTAL') {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-700 mr-2 bg-gradient-to-br from-[#F9F5F4] via-[#efece4] to-[#d7d7a8] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="col-span-1">
                                                <button className="w-6 h-6 rounded-full border-2 border-gray-200 mr-2 bg-gradient-to-br from-[#F9F5F4] via-[#efece4] to-[#d7d7a8] active:border-gray-700 checked:border-gray-700" onClick={() => {
                                                    setFilters({
                                                        ...filters,
                                                        color: variant.color
                                                    })
                                                    setDosier(variant.dosier);
                                                }}></button>
                                                <span className="text-gray-500">{variant.color}</span>
                                            </div>
                                        )
                                    }
                                }

                            }})}
                        </div>
                        </div>
                        <hr className="col-span-1 border-gray-200 border-b" />
                        {filters.name != 'COLA/TRAIN' && filters.color !== ''  ? (<>
                        <div className="col-span-1">
                            <select className="form-select text-center  rounded-md shadow-sm border-gray-300" onChange={(e) => {
                                setFilters({
                                    ...filters,
                                    size: e.target.value
                                })
                            }}>
                                <option value="">Select Size</option>
                                {props.variants.filter((variant) => variant.name === filters.name && variant.description === filters.description && variant.color === filters.color).sort((a,b) => a.size - b.size).map((variant) => {
                                    if (!usedSizes.includes(variant.size)) {
                                        usedSizes.push(variant.size);
                                        return (
                                            <option key={variant.id} value={variant.size}>{variant.size}</option>
                                        )
                                    }
                                })}
                            </select>
                        </div>
                        <hr className="col-span-1 border-gray-200 border-b" /></>) : (<></>)}
                        {selectedVariant ? (<>
                        <div className="col-span-1">
                            {props.companies[0].currency === 'eur' && props.auth.user.locale == 'es' ? (<p className="text-gray-500 text-sm">PVM: <FormattedNumber value={selectedVariant.price_spain} style="currency" currency="EUR" /> PVP: <FormattedNumber value={selectedVariant.pvp_spain} style="currency" currency="EUR" /></p>)
                            : props.companies[0].currency != 'eur' && props.auth.user.locale != 'es' ? (<p className="text-gray-500 text-sm">PVM: <FormattedNumber value={selectedVariant.price_gb} style="currency" currency="GBP" /> PVP: <FormattedNumber value={selectedVariant.pvp_gb} style="currency" currency="GBP" /></p>):
                            (<p className="text-gray-500 text-sm">PVM: <FormattedNumber value={selectedVariant.price_fai} style="currency" currency="EUR" /> PVP: <FormattedNumber value={selectedVariant.pvp_fai} style="currency" currency="EUR" /></p>)}
                        </div>
                        <hr className="col-span-1 border-gray-200 border-b" />
                        <div className="col-span-1 flex justify-center">
                            <button className="bg-gray-700 text-white rounded-md px-4 py-2 w-full" onClick={(e) => {
                                if(filters.size !== '' && filters.color !== '' && filters.description !== '' && filters.name !== '') {
                                    handleAddToCart(e);
                                    setShowModal(true);
                                    setTimeout(() => {
                                        setShowModal(false);
                                    } , 2000);
                                }
                            }}><FormattedMessage id="products.show.add_to_cart" defaultMessage="Add to cart" /></button>
                        </div></>) : (<></>)}
                        <div className="col-span-1 flex justify-center">
                            <a href={route('products.index')} className="bg-gray-700 text-white rounded-md px-4 py-2 w-full text-center"><FormattedMessage id="products.show.back_to_products" defaultMessage="Back to products" /></a>
                        </div>
                    </div>

                </div>
            </div>
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Product added to cart"
                size="sm"
            >
                <div className="grid grid-cols-6 gap-10 p-14">
                    <div className="col-span-6 flex justify-end">
                        <button className="text-black px-4 py-2" onClick={() => setShowModal(false)}><X/></button>
                    </div>
                    <div className="col-span-6">
                        <img className='mx-auto d-block w-20' src="/img/check.svg" alt="" />
                        <p className="text-center text-gray-500">Product added to cart</p>
                    </div>
                    <div className="col-span-6 flex justify-center">

                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

