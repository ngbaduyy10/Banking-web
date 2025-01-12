import { LogOut } from 'lucide-react';
import { logOut } from '@/lib/actions/user.action';
import { useRouter } from 'next/navigation';

const SideBarFooter = ({ user } : {user : User}) => {
    const router = useRouter();
    const handleLogout = async () => {
        await logOut();
        router.push("/sign-in");
    }

    return (
        <footer className="footer">
            <div className="footer_name-mobile text-xl font-bold text-gray-700">
                {user.firstName[0]}
            </div>

            <div className="footer_email-mobile">
                <div className="text-14 truncate text-gray-700 font-semibold">{user.firstName} {user.lastName}</div>
                <div className="text-14 truncate font-normal text-gray-600">{user.email}</div>
            </div>

            <LogOut size={24} color="black" onClick={handleLogout} />
        </footer>
    )
}

export default SideBarFooter;