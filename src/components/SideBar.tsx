'use client'
import Link from 'next/link';
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import SideBarFooter from "@/components/SideBarFooter";

const SideBar = ({ name, email } : { name : string, email: string}) => {
    const pathname = usePathname();

    return (
        <section className="sidebar">
            <div className="flex flex-col gap-4">
                <Link href="/" className="mb-5 cursor-pointer flex items-center max-xl:justify-center gap-2">
                    <div className="sidebar-logo">Bright</div>
                </Link>

                {sidebarLinks.map((item) => {
                    const active = pathname === item.route;

                    return (
                        <Link href={item.route} key={item.label} className={`sidebar-link ${active && 'bg-bank-gradient'}`}>
                            <item.logo width={24} height={24} color={active ? 'white' : 'black'} />
                            <div className={`sidebar-label ${active ? 'text-white' : 'text-black-2'}`}>{item.label}</div>
                        </Link>
                    )
                })}
            </div>

            <SideBarFooter name={name} email={email} />
        </section>
    )
}

export default SideBar;