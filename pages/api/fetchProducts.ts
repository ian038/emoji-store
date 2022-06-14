import { NextApiRequest, NextApiResponse } from 'next';
import products from './products.json'

export type ProductData = {
    id: number,
    name: string,
    price: string,
    description: string,
    image_url: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ProductData[] | string>) {
    if (req.method === "GET") {
        const productsNoHashes = products.map((product) => {
            const { hash, filename, ...rest } = product;
            return rest;
        });

        res.status(200).json(productsNoHashes);
    }
    else {
        res.status(405).send(`Method ${req.method} not allowed`);
    }
}