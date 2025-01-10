"use client";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
    const data = {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
            {
                data: [300, 50, 100],
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