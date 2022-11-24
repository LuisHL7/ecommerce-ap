import React from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { TabsOrders } from "./TabsOrders";

export default function Index(props) {
    console.log(props);
    return (
        <Authenticated auth={props.auth} errors={props.errors} cart={props.cart}>

            <TabsOrders products={props.products} orders={props.orders} />

        </Authenticated>
    );
}
