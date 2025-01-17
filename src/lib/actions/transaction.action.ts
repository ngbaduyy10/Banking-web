'use server';

import { createAdminClient } from '@/lib/appwrite';
import { ID, Query } from 'node-appwrite';
import { parseStringify } from '@/lib/utils';

export const createTransaction = async (transaction: CreateTransactionProps) => {
    try {
        const { database } = await createAdminClient();

        console.log(transaction);

        const newTransaction = await database.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_TRANSACTION_COLLECTION_ID!,
            ID.unique(),
            {
                ...transaction
            }
        )

        return parseStringify(newTransaction);
    } catch (error) {
        console.log(error);
    }
}

export const getTransactionsByBankId = async ({bankId}: getTransactionsByBankIdProps) => {
    try {
        const { database } = await createAdminClient();

        const senderTransactions = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_TRANSACTION_COLLECTION_ID!,
            [Query.equal('senderBankId', bankId)],
        )

        const receiverTransactions = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_TRANSACTION_COLLECTION_ID!,
            [Query.equal('receiverBankId', bankId)],
        );

        const transactions = {
            total: senderTransactions.total + receiverTransactions.total,
            documents: [
                ...senderTransactions.documents,
                ...receiverTransactions.documents,
            ]
        }

        return parseStringify(transactions);
    } catch (error) {
        console.log(error);
    }
}