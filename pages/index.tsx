import React, { useEffect, useState } from 'react';
import Product from '../components/Product';
import type { NextPage } from 'next';
import HeadComponent from '../components/Head';
import CreateProduct from '../components/CreateProduct';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ProductData } from './api/fetchProducts';

const Home: NextPage = () => {
    const { publicKey } = useWallet()
    const isOwner = (publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false);
    const [products, setProducts] = useState<ProductData[]>([])
    const [creating, setCreating] = useState<boolean>(false)

    useEffect(() => {
        if (publicKey) {
            fetch(`/api/fetchProducts`).then(response => response.json()).then((data: ProductData[]) => {
                setProducts(data);
            });
        }
    }, [publicKey])

    const renderNotConnectedContainer = () => (
        <div>
            <img src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif" alt="emoji" />
            <div className="button-container">
                <WalletMultiButton className="cta-button connect-wallet-button" />
            </div>
        </div>
    )

    const renderItemBuyContainer = () => (
        <div className="products-container">
            {products.map((product) => (
                <Product key={product.id} product={product} />
            ))}
        </div>
    )

    return (
        <div className="App">
            <HeadComponent />
            <div className="container">
                <header className="header-container">
                    <p className="header"> 😳 Emoji Store 😈</p>
                    <p className="sub-text">The only emoji store that accepts sh*tcoins</p>

                    {isOwner && (
                        <button className="create-product-button" onClick={() => setCreating(!creating)}>
                            {creating ? "Close" : "Create Product"}
                        </button>
                    )}
                </header>

                <main>
                    {creating && <CreateProduct />}
                    {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
                </main>
            </div>
        </div>
    );
};

export default Home;