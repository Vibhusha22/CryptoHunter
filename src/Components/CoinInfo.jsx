import { useState, useEffect } from "react";
import { makeStyles, ThemeProvider, createTheme } from "@material-ui/core";
import axios from "axios";
import { HistoricalChart } from "../Config/Api";
import { Line } from "react-chartjs-2";
import { CircularProgress } from "@mui/material";
import useCryptoStore from "../Store/CryptoContext";
import SelectButton from "./SelectButton"; 

import {
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const useStyles = makeStyles((theme) => ({
    container: {
        width: "75%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
        padding: 40,
        [theme.breakpoints.down("md")]: {
          width: "100%",
          marginTop: 0,
          padding: 20,
          paddingTop: 0,
        },
      },
    chart: {
        width: "75%",
        [theme.breakpoints.down("md")]: {
            width: "100%",
        },
    },
}));

function CoinInfo({ coin }) {
    const classes = useStyles();

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        },
    });

    const [historicData, setHistoricData] = useState();
    const [days, setDays] = useState(1);
    const [loading, setLoading] = useState(true);

    const { currency } = useCryptoStore();

    const fetchHistoricData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
            setHistoricData(data.prices);
        } catch (error) {
            console.error("Error fetching historical data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistoricData();
    }, [days, currency]);

    const chartData = {
        labels: historicData?.map((coin) => {//x-axis | hover data
            let date = new Date(coin[0]);
            let time = date.getHours() > 12
                ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                : `${date.getHours()}:${date.getMinutes()} AM`;
            return days === 1 ? time : date.toLocaleDateString();
        }),
        datasets: [
            {
                data: historicData?.map((coin) => coin[1]),// y-axis
                label: `Price (Past ${days} Days) in ${currency}`,//graph label
                borderColor: "#EEBC1D",
            },
        ],
    };


    const selectDays = [
        { label: "24 Hours", value: 1 },
        { label: "7 Days", value: 7 },
        { label: "30 Days", value: 30 },
        { label: "1 Year", value: 365 },
    ];

    return (
        <ThemeProvider theme={darkTheme}>
            <div className={classes.container}>
                {!historicData || loading ? (
                    <CircularProgress style={{ color: "gold",marginBottom:"272px" }} size={250} thickness={1} />
                ) : (
                    <div className={classes.chart}>
                        <Line
                            data={chartData}
                            options={{
                                elements: {
                                    point: {
                                        radius: 1,
                                    },
                                },
                            }}
                        />
                    </div>
                )}

    
                <div
                    style={{
                        display: "flex",
                        marginTop: 20,
                        justifyContent: "space-around",
                        width: "100%",
                    }}
                >
                    {selectDays.map((day) => (
                        <SelectButton
                            key={day.value}
                            onClick={() => setDays(day.value)}
                            selected={day.value === days}
                        >
                            {day.label}
                        </SelectButton>
                    ))}
                </div>
            </div>
        </ThemeProvider>
    );
}

export default CoinInfo;
