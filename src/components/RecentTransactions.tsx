'use client'

import Link from 'next/link';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {useEffect, useState} from 'react';
import BankTab from "@/components/BankTab";
import {getAccount} from "@/lib/actions/user.action";
import TransactionsTable from "@/components/TransactionsTable";
import PlaidLink from "@/components/PlaidLink";

const RecentTransactions = ({ accounts, user } : { accounts : Account[], user : User }) => {
    const [id, setId] = useState(accounts[0].appwriteItemId);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await getAccount(id);
            if (response?.transactions) {
                setTransactions(response.transactions);
            }
        }

        if (id) {
            fetchTransactions();
        }
    }, [id]);

    return (
        <section className="recent-transactions">
            <header className="flex items-center justify-between">
                <h2 className="recent-transactions-label">Recent transactions</h2>
                <div className="flex items-center gap-2">
                    <PlaidLink user={user} />
                    <Link
                        href={`/`}
                        className="view-all-btn"
                    >
                        View all
                    </Link>
                </div>
            </header>

            <Tabs defaultValue={accounts[0].appwriteItemId} className="w-full">
                <TabsList className="recent-transactions-tablist">
                    {accounts.map((account) => (
                        <TabsTrigger key={account.id} value={account.appwriteItemId}>
                            <BankTab account={account} setId={setId} active={id === account.appwriteItemId} />
                        </TabsTrigger>
                    ))}
                </TabsList>

                {accounts.map((account) => (
                    <TabsContent value={account.appwriteItemId} key={account.id}>
                        <TransactionsTable transactions={transactions} />
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    )
}

export default RecentTransactions;