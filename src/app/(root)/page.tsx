import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSideBar from "@/components/RightSideBar";
import {getLoggedInUser} from "@/lib/actions/user.action";
import {redirect} from "next/navigation";

const Home = async () => {
    const user = await getLoggedInUser();
    if (!user) {
        redirect("/sign-in");
    }

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome"
                        subtext="Access and manage your account and transactions efficiently."
                        user={user.name}
                    />

                    <TotalBalanceBox
                        accounts={[]}
                        totalBanks={1}
                        totalCurrentBalance={146789}
                    />
                </header>
            </div>
            <RightSideBar name={user.name} email={user.email}/>
        </section>
    );
}

export default Home;