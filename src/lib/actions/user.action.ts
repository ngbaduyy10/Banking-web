'use server'

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import {parseStringify} from "@/lib/utils";

export const getLoggedInUser = async () => {
    try {
        const { account } = await createSessionClient();
        return await account.get();
    } catch (error) {
        console.error(error);
    }
}

export const signUp = async (userData : SignUpParams) => {
    try {
        const { email, password, firstName, lastName } = userData;
        const { account } = await createAdminClient();

        const newUser = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
            );
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