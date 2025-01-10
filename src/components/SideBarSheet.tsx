'use client'

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {Menu} from 'lucide-react';
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import SideBarFooter from "@/components/SideBarFooter";

const SideBarSheet = ({ name, email } : { name : string, email: string}) => {
    const pathname = usePathname();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Menu height={30} width={30} className="cursor-pointer" />
            </SheetTrigger>

            <SheetContent side="left" className="bg-white flex flex-col justify-between w-[300px]">
                <div className="mobilenav-sheet">
                    <SheetHeader className="pb-5">
                        <SheetTitle className="text-[20px] font-ibm-plex-serif font-bold text-black-1 text-left">Bright</SheetTitle>
                    </SheetHeader>

                    <div className="mobilenav-sheet">
                        {sidebarLinks.map((item) => {
                            const active = pathname === item.route;

                            return (
                                <SheetClose asChild key={item.label}>
                                    <Link href={item.route} key={item.label} className={`sidebar-link ${active && 'bg-bank-gradient'}`}>
                                        <item.logo width={24} height={24} color={active ? 'white' : 'black'} />
                                        <div className={`font-semibold ${active ? 'text-white' : 'text-black-2'}`}>{item.label}</div>
                                    </Link>
                                </SheetClose>
                            )
                        })}
                    </div>
                </div>

                <SideBarFooter name={name} email={email} />
            </SheetContent>
        </Sheet>
    )
}

export default SideBarSheet;