import Counter from "./Counter";
import DoughnutChart from "@/components/DoughnutChart";

const TotalBalanceBox = ({ accounts, totalBanks, totalCurrentBalance }: TotalBalanceBoxProps) => {
    return (
        <section className="total-balance">
            <div className="total-balance-chart">
                <DoughnutChart />
            </div>

            <div className="flex flex-col items-center">
                <div className="header-2 mb-4">
                    Bank Accounts: {totalBanks}
                </div>

                <div className="total-balance-label">
                    Total Current Balance
                </div>

                <div className="total-balance-amount">
                    <Counter amount={totalCurrentBalance} />
                </div>
            </div>

        </section>
    )
}

export default TotalBalanceBox;