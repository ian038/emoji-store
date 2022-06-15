import React, { useState, useMemo } from "react";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Circles } from "react-loader-spinner";
import IPFSDownload from "./IpfsDownload";

type BuyProps = {
    itemID: number
}

const Buy: React.FC<BuyProps> = ({ itemID }) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const orderID = useMemo<PublicKey>(() => Keypair.generate().publicKey, []);
    const [paid, setPaid] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const order = useMemo(() => ({
        buyer: publicKey?.toString(),
        orderID: orderID.toString(),
        itemID
    }), [publicKey, orderID, itemID]);

    const processTransaction = async (): Promise<void> => {
        setLoading(true);
        const txResponse = await fetch("../api/createTransaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });
        const txData = await txResponse.json();

        const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
        console.log("Tx data is", tx);

        try {
            const txHash = await sendTransaction(tx, connection);
            console.log(`Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`);
            setPaid(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!publicKey) {
        return (
            <div>
                <p>Please connect your wallet to make transactions</p>
            </div>
        );
    }

    if (loading) {
        return <Circles color="gray" />;
    }

    return (
        <div>
            {paid ? (
                <IPFSDownload filename="emojis.zip" hash="QmWWH69mTL66r3H8P4wUn24t1L5pvdTJGUTKBqT11KCHS5" />
            ) : (
                <button disabled={loading} className="buy-button" onClick={processTransaction}>
                    Buy now 🠚
                </button>
            )}
        </div>
    );
}

export default Buy