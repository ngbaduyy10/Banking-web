import React from 'react';

const BankTab = ({ account,  setId, active } : { account : Account, setId : React.Dispatch<React.SetStateAction<string>>, active : boolean }) => {

    return (
        <div
            onClick={() => setId(account.appwriteItemId)}
            className={`banktab-item ${active && "border-blue-600"}`}
        >
            <p className={`text-16 line-clamp-1 flex-1 font-medium ${active ? "text-blue-600" : "text-gray-500"}`}>
                {account.name}
            </p>
        </div>
    )
}

export default BankTab;