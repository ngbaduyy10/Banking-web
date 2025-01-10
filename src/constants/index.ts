import { House, Landmark, BadgeDollarSign, CalendarSync } from "lucide-react";

export const sidebarLinks = [
    {
        route: "/",
        label: "Home",
        logo: House,
    },
    {
        route: "/my-banks",
        label: "My Banks",
        logo: Landmark,
    },
    {
        route: "/transaction-history",
        label: "Transaction History",
        logo: BadgeDollarSign,
    },
    {
        route: "/payment-transfer",
        label: "Transfer Funds",
        logo: CalendarSync,
    },
];
