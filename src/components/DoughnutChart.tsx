"use client";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts } : { accounts : Account[]}) => {
    const data = {
        labels: accounts.map((account) => account.name),
        datasets: [
            {
                data: accounts.map((account) => account.currentBalance),
                backgroundColor: ['#0747b6', '#2265d8', '#2f91fa'],
                hoverBackgroundColor: ['#0747b6', '#2265d8', '#2f91fa'],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
        },
    };

    return (
        <Doughnut data={data} options={options} />
    );
};

export default DoughnutChart;