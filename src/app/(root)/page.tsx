import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSideBar from "@/components/RightSideBar";
import {getAccounts, getLoggedInUser} from "@/lib/actions/user.action";
import {redirect} from "next/navigation";
import RecentTransactions from "@/components/RecentTransactions";

const Home = async () => {
    const user = await getLoggedInUser();
    if (!user) {
        redirect("/sign-in");
    }

    const accounts = await getAccounts({ userId: user.$id });

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome"
                        subtext="Access and manage your account and transactions efficiently."
                        user={`${user.firstName} ${user.lastName}`}
                    />

                    <TotalBalanceBox
                        accounts={accounts.data}
                        totalBanks={accounts.totalBanks}
                        totalCurrentBalance={accounts.totalCurrentBalance}
                    />
                </header>

                <RecentTransactions accounts={accounts.data} user={user} />
            </div>
            <RightSideBar user={user} />
        </section>
    );
}

export default Home;