import { Table } from 'flowbite-react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

export const TablesProducts = (props) => {
    const products = props.data.products.products;
    const variants = props.data.products.variants;
    return (
        <Table>
            <Table.Head className='text-center'>
                <Table.HeadCell><FormattedMessage id="product" defaultMessage="Product" /></Table.HeadCell>
                <Table.HeadCell><FormattedMessage id="color" defaultMessage="Color" /></Table.HeadCell>
                <Table.HeadCell><FormattedMessage id="size" defaultMessage="Size" /></Table.HeadCell>
                <Table.HeadCell><FormattedMessage id="units" defaultMessage="Units" /></Table.HeadCell>
                <Table.HeadCell><FormattedMessage id="price" defaultMessage="Price" /></Table.HeadCell>
                <Table.HeadCell><FormattedMessage id="total" defaultMessage="Total" /></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
                { products.map((product) =>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center" key={ product.id }>
                        <Table.Cell className='text-left flex items-center'>
                                <img className='rounded-full w-40' src={ product.main_image } alt="" />
                                <div className="ml-2">
                                    <h1 className="font-bold">{ product.name }</h1>
                                    <h2 className="text-sm font-bold">{ variants.find(variant => variant.products_id === product.id).name }</h2>
                                    <h2 className="text-sm font-bold">{ variants.find(variant => variant.products_id === product.id).description }</h2>
                                </div>
                        </Table.Cell>
                        <Table.Cell>
                            <div className="flex items-center justify-center">
                                <p className="text-sm font-bold">{ variants.find(variant => variant.products_id === product.id).color }</p>
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            <div className="flex items-center justify-center">
                                <p className="text-sm font-bold">{ variants.find(variant => variant.products_id === product.id).size !== 'N/A' ? variants.find(variant => variant.products_id === product.id).size : '-' }</p>
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            <div className="flex items-center justify-center">
                                <p className="text-sm font-bold">{ product.pivot.quantity }</p>
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            <div className="flex items-center justify-center">
                                <p className="text-sm font-bold"><FormattedNumber value={ product.price_spain } style="currency" currency="EUR" /></p>
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            <div className="flex items-center justify-center">
                                <p className="text-sm font-bold"><FormattedNumber value={ product.price_spain * product.pivot.quantity } style="currency" currency="EUR" /></p>
                            </div>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    )
}
