import React from 'react';
import SideBar from "@/components/SideBar";
import SideBarSheet from "@/components/SideBarSheet";
import {getLoggedInUser} from "@/lib/actions/user.action";
import { redirect } from "next/navigation"

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getLoggedInUser();
    if (!user) {
        redirect("/sign-in");
    }

    return (
        <main className="flex h-screen w-full font-inter">
            <SideBar name={user.name} email={user.email} />
            <div className="flex size-full flex-col">
                <div className="root-layout">
                    <span className="text-[20px] font-ibm-plex-serif font-bold text-black-1 text-left">Bright</span>
                    <SideBarSheet name={user.name} email={user.email} />
                </div>
                {children}
            </div>
        </main>
    );
}
