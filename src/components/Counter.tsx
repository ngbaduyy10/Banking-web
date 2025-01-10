'use client';
import CountUp from "react-countup";

const Counter = ({ amount } : { amount : number }) => {
    return (
        <CountUp
            end={amount}
            duration={1}
            decimal=","
            prefix="$"
        />
    )
}

export default Counter;