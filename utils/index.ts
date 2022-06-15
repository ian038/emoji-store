import { PublicKey } from "@solana/web3.js";

type Order = {
    buyer: string | undefined,
    itemID: number,
    orderID: string
}

export const addOrder = async (order: Order) => {
    console.log("adding order ", order, "To DB");
    await fetch("../api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
    });
}

export const hasPurchased = async (publicKey: PublicKey | null, itemID: number) => {
    const response = await fetch(`../api/orders?buyer=${publicKey?.toString()}`);
    if (response.status === 200) {
        const json = await response.json();
        console.log("Current wallet's orders are:", json);
        if (json.length > 0) {
            const order = json.find((order: any) => order.buyer === publicKey?.toString() && order.itemID === itemID);
            if (order) {
                return true;
            }
        }
    }
    return false;
}