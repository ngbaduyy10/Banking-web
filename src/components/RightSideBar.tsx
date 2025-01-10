import Link from "next/link";
import { Plus } from "lucide-react";

const RightSideBar = ({ name, email } : { name: string; email: string}) => {

    return (
        <div className="right-sidebar">
            <div className="flex flex-col pb-8">
                <div className="profile-banner" />
                <div className="profile">
                    <div className="profile-img">
                        {name[0]}
                    </div>
                    <div className="profile-details">
                        <div className="profile-name">
                            {name}
                        </div>
                        <div className="profile-email">
                            {email}
                        </div>
                    </div>
                </div>
            </div>

            <div className="banks">
                <div className="flex items-center justify-between">
                    <div className="header-2">My Banks</div>
                    <Link href="/" className="flex gap-2">
                        <Plus width={20} height={20} />
                        <div className="text-14">Add Bank</div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default RightSideBar;