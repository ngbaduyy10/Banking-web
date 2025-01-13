import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {formatAmount, formatDateTime} from "@/lib/utils";
const TransactionsTable = ({ transactions } : { transactions : Transaction[]}) => {
    return (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="px-2">Transaction</TableHead>
                <TableHead className="px-2">Amount</TableHead>
                <TableHead className="px-2">Date</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {transactions.map((t: Transaction) => {
                const amount = formatAmount(t.amount)

                const isDebit = t.type === 'debit';
                const isCredit = t.type === 'credit';

                return (
                    <TableRow key={t.id} className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none`}>
                        <TableCell className="max-w-[250px] pl-2 pr-10">
                            <div className="flex items-center gap-3">
                                <h1 className="text-14 truncate font-semibold text-[#344054]">
                                    {t.name}
                                </h1>
                            </div>
                        </TableCell>

                        <TableCell className={`pl-2 pr-10 font-semibold ${
                            isDebit || amount[0] === '-' ?
                                'text-[#f04438]'
                                : 'text-[#039855]'
                        }`}>
                            {isDebit ? `-${amount}` : isCredit ? amount : amount}
                        </TableCell>

                        <TableCell className="min-w-32 pl-2 pr-10">
                            {formatDateTime(new Date(t.date)).dateTime}
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableBody>
    </Table>
    )
}

export default TransactionsTable;