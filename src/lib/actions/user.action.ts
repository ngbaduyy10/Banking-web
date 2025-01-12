'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import {parseStringify, extractCustomerIdFromUrl, encryptId} from "@/lib/utils";
import { plaidClient } from "@/lib/plaid";
import { Products, CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum } from "plaid";
import { createDwollaCustomer, addFundingSource } from "@/lib/actions/dwolla.action";
import { revalidatePath } from "next/cache";
import { getTransactionsByBankId } from "@/lib/actions/transaction.action";

export const getUserInfo = async (userId : string) => {
    try {
        const { database } = await createAdminClient();
        const user = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_USER_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        )

        return parseStringify(user.documents[0]);
    } catch (error) {
        console.error(error)
    }
}

export const getLoggedInUser = async () => {
    try {
        const { account } = await createSessionClient();
        const user = await account.get();
        return await getUserInfo(user.$id);
    } catch (error) {
        console.error(error);
    }
}

export const signUp = async ({ password, ...userData} : SignUpParams) => {
    try {
        const { email, firstName, lastName } = userData;
        const { account, database } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        );

        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: 'personal'
        })

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl!);

        const newUser = await database.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userId: newUserAccount.$id,
                dwollaCustomerId,
                dwollaCustomerUrl
            }
        )

        const session = await account.createEmailPasswordSession(email, password);
        const cookiesObj = await cookies();
        cookiesObj.set("my-custom-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUser);
    } catch (error) {
        console.error(error);
    }
}

export const signIn = async (userData : signInProps) => {
    try {
        const { email, password } = userData;
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);

        const cookiesObj = await cookies();
        cookiesObj.set("my-custom-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(session);
    } catch (error) {
        console.error(error);
    }
}

export const logOut = async () => {
    try {
        const { account } = await createSessionClient();

        const cookiesObj = await cookies();
        cookiesObj.delete('my-custom-session');

        await account.deleteSession('current');
    } catch (error) {
        console.error(error);
    }
}

export const createLinkToken = async (user: User) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: ['auth'] as Products[],
            language: 'en',
            country_codes: ['US'] as CountryCode[],
        }

        const response = await plaidClient.linkTokenCreate(tokenParams);

        return parseStringify({ linkToken: response.data.link_token })
    } catch (error) {
        console.error(error);
    }
}

export const exchangePublicToken = async ({ publicToken, user }: exchangePublicTokenProps) => {
    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accountData = accountsResponse.data.accounts[0];
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
        };

        const processorTokenResponse = await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;

        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        });

        const { database } = await createAdminClient();
        await database.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_BANK_COLLECTION_ID!,
            ID.unique(),
            {
                userId: user.$id,
                bankId: itemId,
                accountId: accountData.account_id,
                accessToken,
                fundingSourceUrl,
                shareableId: encryptId(accountData.account_id),
            }
        )

        revalidatePath("/");
    } catch (error) {
        console.error(error);
    }
}

export const getBanks = async ({ userId }: { userId : string }) => {
    try {
        const { database } = await createAdminClient();

        const banks = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_BANK_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        )

        return parseStringify(banks.documents);
    } catch (error) {
        console.error(error)
    }
}

export const getBank = async ({ documentId }: { documentId : string}) => {
    try {
        const { database } = await createAdminClient();

        const bank = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_BANK_COLLECTION_ID!,
            [Query.equal('$id', [documentId])]
        )

        return parseStringify(bank.documents[0]);
    } catch (error) {
        console.error(error)
    }
}

export const getBankByAccountId = async ({ accountId }: { accountId : string}) => {
    try {
        const { database } = await createAdminClient();

        const bank = await database.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_BANK_COLLECTION_ID!,
            [Query.equal('accountId', [accountId])]
        )

        if(bank.total !== 1) return null;

        return parseStringify(bank.documents[0]);
    } catch (error) {
        console.error(error)
    }
}

export const getAccounts = async ({ userId }: { userId : string }) => {
    try {
        const banks = await getBanks({ userId });

        const accounts = await Promise.all(
            banks?.map(async (bank: Bank) => {
                const accountsResponse = await plaidClient.accountsGet({
                    access_token: bank.accessToken,
                });
                const accountData = accountsResponse.data.accounts[0];

                return {
                    id: accountData.account_id,
                    availableBalance: accountData.balances.available!,
                    currentBalance: accountData.balances.current!,
                    name: accountData.name,
                    officialName: accountData.official_name,
                    mask: accountData.mask!,
                    type: accountData.type as string,
                    subtype: accountData.subtype! as string,
                    appwriteItemId: bank.$id,
                };
            })
        );

        const totalBanks = accounts.length;
        const totalCurrentBalance = accounts.reduce((total, account) => {
            return total + account.currentBalance;
        }, 0);

        return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
    } catch (error) {
        console.error(error)
    }
}

export const getAccount = async (documentId : string) => {
    try {
        const bank = await getBank({ documentId: documentId });
        const accountsResponse = await plaidClient.accountsGet({
            access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        const account = {
            id: accountData.account_id,
            availableBalance: accountData.balances.available!,
            currentBalance: accountData.balances.current!,
            name: accountData.name,
            officialName: accountData.official_name,
            mask: accountData.mask!,
            type: accountData.type as string,
            subtype: accountData.subtype! as string,
            appwriteItemId: bank.$id,
        };

        const transferTransactionsData = await getTransactionsByBankId({
            bankId: bank.$id,
        });

        const transferTransactions = transferTransactionsData?.documents.map(
            (transferData: Transaction) => ({
                id: transferData.$id,
                name: transferData.name!,
                amount: transferData.amount!,
                date: transferData.$createdAt,
                type: transferData.senderBankId === bank.$id ? "debit" : "credit",
            })
        );

        return parseStringify({ data: account, transactions: transferTransactions });
    } catch (error) {
        console.error(error)
    }
}