'use client'

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {TransferFormSchema} from "@/lib/utils";
import {Form, FormItem, FormLabel, FormControl, FormMessage, FormDescription, FormField} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Loader2} from "lucide-react";
import BankDropdown from "@/components/BankDropdown";
import {decryptId} from "@/lib/utils";
import {getBank, getBankByAccountId} from "@/lib/actions/user.action";
import {createTransfer} from "@/lib/actions/dwolla.action";
import {createTransaction} from "@/lib/actions/transaction.action";
import {useRouter} from "next/navigation";

const PaymentTransferForm = ({ accounts } : { accounts : Account[] }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof TransferFormSchema>>({
        resolver: zodResolver(TransferFormSchema),
        defaultValues: {
            name: "",
            email: "",
            amount: "",
            senderBank: "",
            shareableId: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof TransferFormSchema>) => {
        try {
            setLoading(true);

            const receiverAccountId = decryptId(values.shareableId);
            const receiverBank = await getBankByAccountId(receiverAccountId);
            const senderBank = await getBank({ documentId: values.senderBank });

            const transferParams = {
                sourceFundingSourceUrl: senderBank.fundingSourceUrl,
                destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
                amount: values.amount,
            };

            const transfer = await createTransfer(transferParams);

            if (transfer) {
                const transaction = {
                    name: values.name,
                    amount: values.amount,
                    senderBankId: senderBank.$id,
                    receiverBankId: receiverBank.$id,
                    email: values.email,
                };

                const newTransaction = await createTransaction(transaction);

                if (newTransaction) {
                    form.reset();
                    router.push("/");
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
                <FormField
                    control={form.control}
                    name="senderBank"
                    render={() => (
                        <FormItem className="border-t border-gray-200">
                            <div className="payment-transfer_form-item pb-6 pt-5">
                                <div className="payment-transfer_form-content">
                                    <FormLabel className="text-14 font-medium text-gray-700">
                                        Select Source Bank
                                    </FormLabel>
                                    <FormDescription className="text-12 font-normal text-gray-600">
                                        Select the bank account you want to transfer funds from
                                    </FormDescription>
                                </div>
                                <div className="flex w-full flex-col">
                                    <FormControl>
                                        <BankDropdown accounts={accounts} setValue={form.setValue} />
                                    </FormControl>
                                    <FormMessage className="text-12 text-red-500"/>
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem className="border-t border-gray-200">
                            <div className="payment-transfer_form-item pb-6 pt-5">
                                <div className="payment-transfer_form-content">
                                    <FormLabel className="text-14 font-medium text-gray-700">
                                        Transfer Note (Optional)
                                    </FormLabel>
                                    <FormDescription className="text-12 font-normal text-gray-600">
                                        Please provide any additional information or instructions
                                        related to the transfer
                                    </FormDescription>
                                </div>
                                <div className="flex w-full flex-col">
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write a short note here"
                                            className="input-class"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-12 text-red-500"/>
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="payment-transfer_form-details">
                    <h2 className="text-18 font-semibold text-gray-900">
                        Bank account details
                    </h2>
                    <p className="text-16 font-normal text-gray-600">
                        Enter the bank account details of the recipient
                    </p>
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem className="border-t border-gray-200">
                            <div className="payment-transfer_form-item py-5">
                                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                                    Recipient&apos;s Email Address
                                </FormLabel>
                                <div className="flex w-full flex-col">
                                    <FormControl>
                                        <Input
                                            placeholder="ex: johndoe@gmail.com"
                                            className="input-class"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-12 text-red-500"/>
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shareableId"
                    render={({field}) => (
                        <FormItem className="border-t border-gray-200">
                            <div className="payment-transfer_form-item pb-5 pt-6">
                                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                                    Receiver&apos;s Plaid Sharable Id
                                </FormLabel>
                                <div className="flex w-full flex-col">
                                    <FormControl>
                                        <Input
                                            placeholder="Enter the public account number"
                                            className="input-class"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-12 text-red-500"/>
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amount"
                    render={({field}) => (
                        <FormItem className="border-y border-gray-200">
                            <div className="payment-transfer_form-item py-5">
                                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                                    Amount
                                </FormLabel>
                                <div className="flex w-full flex-col">
                                    <FormControl>
                                        <Input
                                            placeholder="ex: 5.00"
                                            className="input-class"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-12 text-red-500"/>
                                </div>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="payment-transfer_btn-box">
                    <Button disabled={loading} type="submit" className="payment-transfer_btn">
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin"/> &nbsp; Sending...
                            </>
                        ) : (
                            "Transfer Funds"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PaymentTransferForm;