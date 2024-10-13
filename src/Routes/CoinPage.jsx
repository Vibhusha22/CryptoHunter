
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SingleCoin } from "../Config/Api";
import useCryptoStore from "../Store/CryptoContext";
import { makeStyles, Typography } from "@material-ui/core";
import CoinInfo from "../Components/CoinInfo";
import ReactHtmlParser from "react-html-parser";
import LinearProgress from "@material-ui/core/LinearProgress";
import { numberWithCommas } from "../Components/CoinsTable";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        [theme.breakpoints.down("md")]: {
          flexDirection: "column",
          alignItems: "center",
        },
      },
      sidebar: {
        width: "30%",
        [theme.breakpoints.down("md")]: {
          width: "100%",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 25,
        borderRight: "2px solid grey",
      },
      heading:{
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "Montserrat",

      },
      description: {
        width: "100%",
        fontFamily: "Montserrat",
        padding: 25,
        paddingBottom: 15,
        paddingTop: 0,
        textAlign: "justify",
      },
      marketData: {
        alignSelf: "start",
        padding: 25,
        paddingTop: 10,
        width: "100%",
        [theme.breakpoints.down("md")]: {
          display: "flex",
          justifyContent: "space-around",
        },
        [theme.breakpoints.down("sm")]: {
          flexDirection: "column",
          alignItems: "center",
        },
        [theme.breakpoints.down("xs")]: {
          alignItems: "start",
        },
      },
}))

function CoinPage() {
    const classes = useStyles();
    const { id } = useParams();
    const [coin, setCoin] = useState();
    const { currency, symbol } = useCryptoStore();
    const fetchCoin = async () => {
        const { data } = await axios.get(SingleCoin(id));
        setCoin(data);
    }
    useEffect(() => {
        fetchCoin();
    }, [currency]);


    if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

    return <>
        <div className={classes.container}>
            <div className={classes.sidebar}>
                <img src={coin?.image.large} alt={coin?.name} style={{height: "300px", width: "300px", marginBottom:"30px"}}/>
                <Typography variant="h3" className={classes.heading}>{coin?.name}</Typography>
                <Typography variant="h5" className={classes.description}>{ReactHtmlParser(coin?.description.en.split(". ")[0])} </Typography>
                <div className={classes.marketData}>
                    <span style={{ display: "flex", marginTop: 20, justifyContent:"center"}}>
                    <Typography variant="h5" className={classes.heading}>Rank:</Typography>
                    <Typography variant="h5" style={{fontFamily: "Montserrat", marginLeft: 5}}>{coin?.market_cap_rank}</Typography>
                    </span>

                    <span style={{ display: "flex", marginTop: 20, justifyContent:"center"}}>
                    <Typography variant="h5" className={classes.heading}>Current Price:</Typography>
                    <Typography variant="h5" style={{fontFamily: "Montserrat", marginLeft: 5}}>{symbol} {numberWithCommas(coin?.market_data.current_price[currency.toLowerCase()])}</Typography>
                    </span>

                    <span style={{ display: "flex", marginTop: 20, justifyContent:"center"}}>
                    <Typography variant="h5" className={classes.heading}>Market Cap:</Typography>
                    <Typography variant="h5" style={{fontFamily: "Montserrat", marginLeft: 5}}>{symbol} {numberWithCommas(coin?.market_data.market_cap[currency.toLowerCase()].toString().slice(0, -6))} M</Typography>
                    </span>
                </div>
            </div>
            <CoinInfo coin={coin}/>
        </div></>
}
export default CoinPage;