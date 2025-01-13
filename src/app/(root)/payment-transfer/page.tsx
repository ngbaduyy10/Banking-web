import HeaderBox from "@/components/HeaderBox";
import {getAccounts, getLoggedInUser} from "@/lib/actions/user.action";
import PaymentTransferForm from "@/components/PaymentTransferForm";

const PaymentTransfer = async () => {
    const user = await getLoggedInUser();
    const accounts = await getAccounts({ userId: user.$id });

    return (
        <section className="payment-transfer">
            <HeaderBox
                title="Payment Transfer"
                subtext="Please provide any specific details or notes related to the payment transfer"
            />
            <PaymentTransferForm accounts={accounts.data} />
        </section>
    )
}

export default PaymentTransfer;