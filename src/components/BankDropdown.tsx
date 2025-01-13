'use client'

import {UseFormSetValue} from "react-hook-form";
import {useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectTrigger} from "@/components/ui/select";
import {formatAmount} from "@/lib/utils";


const BankDropdown = ({ accounts, setValue } : { accounts : Account[], setValue : UseFormSetValue<TransferFormValues>}) => {
    const [selected, setSelected] = useState(accounts[0]);

    useEffect(() => {
        if (setValue) {
            setValue("senderBank", selected.appwriteItemId);
        }
    }, [selected, setValue]);

    const handleBankChange = (id: string) => {
        const account = accounts.find((account) => account.appwriteItemId === id)!;
        setSelected(account);
    }

    return (
        <Select
            defaultValue={selected.appwriteItemId}
            onValueChange={(value) => handleBankChange(value)}
        >
            <SelectTrigger className={`flex w-full bg-white gap-3 md:w-[300px]`}>
                <p className="line-clamp-1 w-full text-left">{selected.name}</p>
            </SelectTrigger>
            <SelectContent
                className={`w-full bg-white md:w-[300px]`}
                align="end"
            >
                <SelectGroup>
                    <SelectLabel className="py-2 font-normal text-gray-500">
                        Select a bank to display
                    </SelectLabel>
                    {accounts.map((account: Account) => (
                        <SelectItem
                            key={account.id}
                            value={account.appwriteItemId}
                            className="cursor-pointer border-t"
                        >
                            <div className="flex flex-col ">
                                <p className="text-16 font-medium">{account.name}</p>
                                <p className="text-14 font-medium text-blue-600">
                                    {formatAmount(account.currentBalance)}
                                </p>
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default BankDropdown;