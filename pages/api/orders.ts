import orders from "./orders.json";
import { writeFile } from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";

type Order = {
    buyer: string | undefined,
    itemID: number,
    orderID: string
}

function get(req: NextApiRequest, res: NextApiResponse) {
    const { buyer } = req.query;

    const buyerOrders = orders.filter((order: Order) => order.buyer === buyer);
    if (buyerOrders.length === 0) {
        res.status(204).send('added');
    } else {
        res.status(200).json(buyerOrders);
    }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    console.log("Received add order request", req.body);
    try {
        const newOrder = req.body;
        if (!orders.find((order: Order) => order.buyer === newOrder.buyer.toString() && order.itemID === newOrder.itemID)) {
            orders.push(newOrder);
            await writeFile("./pages/api/orders.json", JSON.stringify(orders, null, 2));
            res.status(200).json(orders);
        } else {
            res.status(400).send("Order already exists");
        }
    } catch (err) {
        res.status(400).send(err);
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET":
            get(req, res);
            break;
        case "POST":
            await post(req, res);
            break;
        default:
            res.status(405).send(`Method ${req.method} not allowed`);
    }
}