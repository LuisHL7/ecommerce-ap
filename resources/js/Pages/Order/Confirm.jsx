import React from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { DetailsProducts } from "@/Components/DetailsProducts";

// Pagina que muestra una confimacion de que el pedido se ha realizado correctamente
export default function Confirm(props) {
    return (
        <Authenticated auth={props.auth} errors={props.errors} cart={props.cart}>
            <DetailsProducts products={ props.order }/>
            
        </Authenticated>
    );
}