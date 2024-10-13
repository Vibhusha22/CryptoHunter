import { useState, useEffect } from "react";
import { CoinList } from "../Config/Api";
import useCryptoStore from "../Store/CryptoContext";
import axios from "axios";
import { createTheme, ThemeProvider, Container, Typography, TextField, TableContainer } from "@material-ui/core";
import { LinearProgress } from "@mui/material";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Pagination from '@mui/material/Pagination'


export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const useStyles = makeStyles({
    row: {
        backgroundColor: "#16171a",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#131111",
        },
        fontFamily: "Montserrat",
    },
    page:{
        "& .MuiPaginationItem-root": {
            color: "gold",
            width: "100px",
            justifyContent: "center",
            height: "90px",
    },
    }
});

function CoinsTable() {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currency, symbol } = useCryptoStore();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const fetchCoins = async () => {
        setLoading(true);
        const { data } = await axios.get(CoinList(currency));
        setCoins(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCoins();
    }, [currency]);

    const handleSearch = () => {
        return coins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(search.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(search.toLowerCase())
        );
    };

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        },
    });

    const classes = useStyles();

    return (
        <ThemeProvider theme={darkTheme}>
            <Container style={{ textAlign: "center" }}>
                <Typography
                    variant="h4"
                    style={{ margin: 18, fontFamily: "Montserrat" }}
                >
                    Cryptocurrency Prices by Market Cap
                </Typography>
                <TextField
                    label="Search For a Crypto Currency.."
                    variant="outlined"
                    style={{ marginBottom: 20, width: "100%" }}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <TableContainer>
                    {loading ? (
                        <LinearProgress style={{ backgroundColor: "gold" }} />
                    ) : (
                        <Table aria-label="simple table">
                            <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                                <TableRow>
                                    {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                                        <TableCell
                                            style={{
                                                color: "black",
                                                fontWeight: "700",
                                                fontFamily: "Montserrat",
                                            }}
                                            key={head}
                                            align={head === "Coin" ? "left" : "right"} 
                                        >
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {handleSearch()
                                    .slice((page - 1) * 10, (page - 1) * 10 + 10)
                                    .map((row) => {
                                        const profit = row.price_change_percentage_24h > 0;
                                        return (
                                            <TableRow key={row.name} className={classes.row}>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        display: "flex",
                                                        gap: 15,
                                                    }}
                                                >
                                                    <Link
                                                        to={`/coins/${row.id}`}
                                                        style={{
                                                            display: "flex",
                                                            textDecoration: "none",
                                                            color: "inherit",
                                                        }}
                                                    >
                                                        <img
                                                            src={row?.image}
                                                            alt={row.name}
                                                            height="50"
                                                            style={{ marginBottom: 10 }}
                                                        />
                                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                                            <span style={{ textTransform: "uppercase", fontSize: 22 }}>
                                                                {row.symbol}
                                                            </span>
                                                            <span style={{ color: "darkgrey" }}>{row.name}</span>
                                                        </div>
                                                    </Link>
                                                </TableCell>
                                                <TableCell align="right">
                                                    {symbol} {numberWithCommas(row.current_price.toFixed(2))}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    style={{
                                                        color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {profit && "+"}
                                                    {row.price_change_percentage_24h.toFixed(2)}%
                                                </TableCell>
                                                <TableCell align="right">
                                                    {symbol} {numberWithCommas(row.market_cap.toString().slice(0, -6))}M
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>

                    )}
                </TableContainer>
                <Pagination count={(handleSearch()?.length/10).toFixed(0)}
                className={classes.page}
                onChange={(_, value) => {setPage(value);
                window.scroll(0,250);}}></Pagination>

            </Container>
        </ThemeProvider>
    );
}

export default CoinsTable;
