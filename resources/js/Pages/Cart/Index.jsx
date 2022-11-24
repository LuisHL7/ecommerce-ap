import React from "react";
import { Inertia } from "@inertiajs/inertia";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Modal } from "flowbite-react";
import moment from "moment";
import { FormattedMessage, FormattedNumber } from "react-intl";

export default function Index(props) {
    console.log(props);
    const products = Object.values(props.cart.items);
    const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
    const [showAddressModal, setShowAddressModal] = React.useState(false);
    const [showAddresesModal, setShowAddresesModal] = React.useState(false);
    const [company, setCompany] = React.useState("");
    const [companyError, setCompanyError] = React.useState("");
    const notes = React.useRef(' ');
    const [shippData, setShippData] = React.useState({
        address: props.company[0].addresses[0].address,
        city: props.company[0].addresses[0].city,
        state: props.company[0].addresses[0].state,
        zip: props.company[0].addresses[0].zip,
        country: props.company[0].addresses[0].country,
        country_code: props.company[0].addresses[0].country_code,
        id: props.company[0].addresses[0].id
    });
    const [paymentType, setPaymentType] = React.useState("receipt");
    return (
       <Authenticated
            auth={props.auth}
            errors={props.errors}
            cart={products.length}
        >
            <div className="grid grid-cols-4 gap-4 py-5 px-5 mx-20">
                <div className="col-span-3  rounded-md p-5">
                <h1 className="text-base font-bold mb-5"> <FormattedMessage id="shopping_cart" defaultMessage="Shopping Cart" /> ({products.length})</h1>
                {products.map((product) => (
                    <div className="grid grid-cols-4 gap-4 mb-5">
                        <div className="col-span-1">
                            <img src={product.attributes.model.main_HD ?? product.attributes.model.main_image} alt={product.name} className="w-auto" />
                            <button className="text-gray-500 text-sm" onClick={() => Inertia.delete(route('cart.destroy', product.id))}> <FormattedMessage id="remove" defaultMessage="Remove" /> </button>
                        </div>
                        <div className="col-span-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <p className="text-sm ">{product.attributes.model.name}</p>
                                    <p className="text-sm text-gray-500">{product.name}</p>
                                    <p className="text-sm text-gray-500">{product.attributes.variant.description}</p>
                                    <p className="text-sm text-gray-500">{product.attributes.variant.color}</p>
                                    <p className="text-sm text-gray-500">{product.attributes.model.season}</p>
                                    <p className="text-sm text-gray-500"><FormattedMessage id="op" defaultMessage="OP" />: {product.attributes.variant.dosier}</p>
                                    <p className="text-sm text-gray-500"><FormattedMessage id="size" defaultMessage="Size" />: {product.attributes.variant.size}</p>
                                    <p className="text-sm text-gray-500"><FormattedMessage id="quantity" defaultMessage="Qty" />: {product.quantity}</p>
                                </div>
                                <div className="col-span-1 text-right">
                                    <p className="text-sm text-gray-500">PVM: <FormattedNumber value={product.attributes.variant.price_spain} style="currency" currency="EUR" /></p>
                                    <p className="text-sm text-gray-500">PVP: <FormattedNumber value={product.attributes.variant.pvp_spain} style="currency" currency="EUR" /></p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
                <div className="col-span-1  rounded-md p-5">
                <h1 className="text-base font-bold mb-5"> <FormattedMessage id="order_summary" defaultMessage="Order Summary" /> </h1>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <p className="text-base font-bold"> <FormattedMessage id="subtotal" defaultMessage="Subtotal" /> </p>
                    </div>
                    <div className="col-span-1 text-right">
                        <p className="text-sm text-gray-500"><FormattedNumber value={props.cart.total} style="currency" currency="EUR" /></p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm text-gray-500"> <FormattedMessage id="notes" defaultMessage="Notes" />: </p>
                        <textarea ref={notes} className="w-full border border-gray-200 rounded-md p-2"></textarea>
                    </div>

                    <div className="col-span-2">
                        <p className="text-sm text-gray-500"> <FormattedMessage id="shipping_address" defaultMessage="Shipping Address" />: </p>
                        <p className="rounded-md border border-gray-200 p-2">{shippData.address}, {shippData.city}, {shippData.state}, {shippData.zip}, {shippData.country} ({shippData.country_code})</p>
                        <button className="text-sm text-gray-500" onClick={() => setShowAddresesModal(true)}> <FormattedMessage id="change" defaultMessage="Change" /> </button>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm text-gray-500"> <FormattedMessage id="estimated_delivery" defaultMessage="Estimated Delivery" />: </p>
                        <p>{moment().add(90, 'days').format('DD/MM/YYYY')}</p>
                    </div>
                    <div className="col-span-2">
                        <button className="w-full bg-gray-800 text-white rounded-md py-2" onClick={() => setShowCheckoutModal(true)}> <FormattedMessage id="checkout" defaultMessage="Make Order" /> </button>
                    </div>
                </div>
                </div>
            </div>
            <Modal
            show={showCheckoutModal}
            onClose={() => setShowCheckoutModal(false)}
            title="Checkout"
            size="sm"
        >
            <div className="p-5">
                <p className="text-sm text-gray-500"> <FormattedMessage id="select_payment_method" defaultMessage="Select Payment Method" /> </p>
                <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="col-span-1">
                        <select className="w-full border border-gray-200 rounded-md p-2" onChange={(e) => setPaymentType(e.target.value)}>
                            <option value="receipt"> <FormattedMessage id="receipt" defaultMessage="Receipt" /> </option>
                            <option value="transfer"> <FormattedMessage id="transfer" defaultMessage="Transfer" /> </option>
                            <option value="check"> <FormattedMessage id="check" defaultMessage="Check" /> </option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm text-gray-500"> <FormattedMessage id="shipping_address" defaultMessage="Shipping Address" />: </p>
                        <p className="rounded-md border border-gray-200 p-2">{shippData.address}, {shippData.city}, {shippData.state}, {shippData.zip}, {shippData.country} ({shippData.country_code})</p>
                        <button className="text-sm text-gray-500" onClick={() => setShowAddressModal(true)}> <FormattedMessage id="change" defaultMessage="Change" /> </button>
                        <p className="text-sm text-gray-500 mt-5"> <FormattedMessage id="notes" defaultMessage="Notes" />: </p>
                        <p className="rounded-md border border-gray-200 p-2">{notes.current?.value}</p>
                        <p className="text-sm text-gray-500 mt-5"> <FormattedMessage id="estimated_delivery" defaultMessage="Estimated Delivery" />: </p>
                        <p>{moment().add(90, 'days').format('DD/MM/YYYY')}</p>
                        <p className="text-sm text-gray-500 mt-5"> <FormattedMessage id="company" defaultMessage="Company" />: </p>
                        <select className="w-full border border-gray-200 rounded-md p-2" onChange={(e) => setCompany(e.target.value)}>
                            <option value="0"> <FormattedMessage id="select_company" defaultMessage="Select Company" /> </option>
                            {props.company.map((company) => (
                                <option value={company.id}>{company.name}</option>
                            ))}
                        </select>
                        {companyError && <p className="text-sm text-red-500"> <FormattedMessage id="select_company" defaultMessage="Please select a company" /> </p>}
                    </div>
                    <div className="col-span-1">
                        <button className="w-full bg-gray-800 text-white rounded-md py-2" onClick={() =>{
                            if(company == ""){
                                setCompanyError(true)
                            }else{
                            Inertia.post(route('cart.checkout'), {payment_type: paymentType, notes: notes.current.value, address: shippData, company: company})
                            }
                        }}> <FormattedMessage id="checkout" defaultMessage="Checkout" /> </button>
                    </div>
                    <div className="col-span-1">
                        <button className="w-full bg-gray-800 text-white rounded-md py-2" onClick={() => setShowCheckoutModal(false)}> <FormattedMessage id="cancel" defaultMessage="Cancel" /> </button>
                    </div>
                </div>  
            </div>
        </Modal>
        <Modal
            show={showAddressModal}
            onClose={() => setShowAddressModal(false)}
            title="New Address"
            size="lg"
        >
            <div className="p-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="text-sm text-gray-500"> <FormattedMessage id="address" defaultMessage="Address" /> </label>
                        <input type="text" className="w-full border border-gray-200 rounded-md p-2" placeholder={shippData.address} name="address" id="address" />
                    </div>
                    <div className="col-span-1">
                        <label className="text-sm text-gray-500"> <FormattedMessage id="city" defaultMessage="City" /> </label>
                        <input type="text" className="w-full border border-gray-200 rounded-md p-2" placeholder={shippData.city} name="city" id="city" />
                    </div>
                    <div className="col-span-1">
                        <label className="text-sm text-gray-500"> <FormattedMessage id="state" defaultMessage="State" /> </label>
                        <input type="text" className="w-full border border-gray-200 rounded-md p-2" placeholder={shippData.state} name="state" id="state" />
                    </div>
                    <div className="col-span-1">
                        <label className="text-sm text-gray-500"> <FormattedMessage id="zip" defaultMessage="Zip" /> </label>
                        <input type="text" className="w-full border border-gray-200 rounded-md p-2" name="zip" id="zip" placeholder={shippData.zip} />
                    </div>
                    <div className="col-span-1">
                        <label className="text-sm text-gray-500"> <FormattedMessage id="country" defaultMessage="Country" /> </label>
                        <input type="text" className="w-full border border-gray-200 rounded-md p-2" name="country" id="country" placeholder={shippData.country} />
                    </div>
                    <div className="col-span-1">
                        <label className="text-sm text-gray-500"> <FormattedMessage id="country_code" defaultMessage="Country Code" /> </label>
                        <input type="text" className="w-full border border-gray-200 rounded-md p-2"  name="country_code" id="country_code" placeholder={shippData.country_code} />
                    </div>
                    <div className="col-span-2">
                        <button className="w-full bg-gray-800 text-white rounded-md py-2" onClick={() => { setShippData({address: document.getElementById('address').value, city: document.getElementById('city').value, state: document.getElementById('state').value, zip: document.getElementById('zip').value, country: document.getElementById('country').value, country_code: document.getElementById('country_code').value, id: null}); setShowAddressModal(false); }}> <FormattedMessage id="save" defaultMessage="Save" /> </button>
                    </div>
                    <div className="col-span-2">
                        <button className="w-full bg-gray-800 text-white rounded-md py-2" onClick={() =>{setShippData({address: shippData.address, city: shippData.city, state: shippData.state, zip: shippData.zip, country: shippData.country, country_code: shippData.country_code}); setShowAddressModal(false)}}> <FormattedMessage id="cancel" defaultMessage="Cancel" /> </button>
                    </div>    
                </div>
            </div>
        </Modal>
        <Modal
            show={showAddresesModal}
            onClose={() => setShowAddresesModal(false)}
            title="Addresses"
            size="xl"
        >
            <div className="p-5">
                <div className="grid grid-cols-1 gap-4">
                    <div className="col-span-1">
                        {props.company.map(company => (
                            // company separator with hr
                            <div className="grid grid-cols-2">
                                <div className="col-span-1">
                                    <h1 className="text-sm text-gray-800">{company.name}</h1>
                                </div>
                                <div className="col-span-2 mb-3">
                                    <hr className="border-gray-200" />
                                </div>
                                <div className="col-span-2 mb-3">
                                    {company.addresses.map(address => (
                                    <p className="rounded-md border border-gray-200 p-2 cursor-pointer mb-2" onClick={() => {setShippData({address: address.address, city: address.city, state: address.state, zip: address.zip, country: address.country, country_code: address.country_code}); setShowAddresesModal(false)}}>{address.address}, {address.city}, {address.state}, {address.zip}, {address.country}, {address.country_code}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-span-1">
                        <button className="w-full bg-gray-800 text-white rounded-md py-2 mb-2" onClick={() =>{ setShowAddresesModal(false), setShowAddressModal(true)}}> <FormattedMessage id="add_manually" defaultMessage="Add Manually" /> </button>
                        <button className="w-full bg-gray-800 text-white rounded-md py-2" onClick={() => setShowAddresesModal(false)}> <FormattedMessage id="cancel" defaultMessage="Cancel" /> </button>
                    </div>
                </div>
            </div>
        </Modal>
        </Authenticated>
    );
}