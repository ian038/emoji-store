import React, { useEffect, useState, useMemo } from "react";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { findReference, FindReferenceError } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Circles } from "react-loader-spinner";
import IPFSDownload from "./IpfsDownload";
import { addOrder, hasPurchased, fetchItem } from '../utils'

type BuyProps = {
    itemID: number
}

type Order = {
    buyer: string | undefined,
    itemID: number,
    orderID: string
}

type Item = {
    filename: string,
    hash: string
}

const STATUS = {
    Initial: "Initial",
    Submitted: "Submitted",
    Paid: "Paid"
}

const Buy: React.FC<BuyProps> = ({ itemID }) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const orderID = useMemo<PublicKey>(() => Keypair.generate().publicKey, []);
    const [item, setItem] = useState<Item | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<string>(STATUS.Initial)

    const order = useMemo<Order>(() => ({
        buyer: publicKey?.toString(),
        orderID: orderID.toString(),
        itemID
    }), [publicKey, orderID, itemID]);

    const processTransaction = async () => {
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
        try {
            const txHash = await sendTransaction(tx, connection);
            console.log(`Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`);
            setStatus(STATUS.Submitted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function checkPurchased() {
            const purchased = await hasPurchased(publicKey, itemID);
            if (purchased) {
                setStatus(STATUS.Paid);
                const item = await fetchItem(itemID);
                setItem(item)
            }
        }
        checkPurchased();
    }, [publicKey, itemID])

    useEffect(() => {
        if (status === STATUS.Submitted) {
            setLoading(true);
            const interval = setInterval(async () => {
                try {
                    const result = await findReference(connection, orderID);
                    console.log("Finding tx reference", result.signature);
                    if (result.signature) {
                        clearInterval(interval);
                        setStatus(STATUS.Paid);
                        setLoading(false);
                        addOrder(order)
                        alert("Thank you for your purchase!");
                    }
                } catch (e) {
                    if (e instanceof FindReferenceError) {
                        return null;
                    }
                    console.error("Unknown error", e);
                } finally {
                    setLoading(false);
                }
            }, 1000);
            return () => {
                clearInterval(interval);
            };
        }

        async function getItem(itemID: number) {
            const item = await fetchItem(itemID);
            setItem(item);
        }

        if (status === STATUS.Paid) {
            getItem(itemID);
        }
    }, [status])

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
            {item ? (
                <IPFSDownload filename={item.filename} hash={item.hash} />
            ) : (
                <button disabled={loading} className="buy-button" onClick={processTransaction}>
                    Buy now ????
                </button>
            )}
        </div>
    );
}

export default Buy