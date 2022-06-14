import React, { useEffect, useState } from 'react';
import Product from '../components/Product';
import type { NextPage } from 'next';
import HeadComponent from '../components/Head';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ProductData } from './api/fetchProducts';

const Home: NextPage = () => {
    const { publicKey } = useWallet()
    const [products, setProducts] = useState<ProductData[]>([])

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
                </header>

                <main>
                    {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
                </main>
            </div>
        </div>
    );
};

export default Home;