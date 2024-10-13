import { AppBar, Container, MenuItem, Select, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles"; 
import { Link } from "react-router-dom"; 
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import useCryptoStore from "../Store/CryptoContext";

const useStyles = makeStyles(() => ({
    title: {
        flex: 1,
        color: "gold",
        fontFamily: "Montserrat",
        fontWeight: "bold",
        cursor: "pointer",
    },
}));

function Header() {
    const classes = useStyles(); 
    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        },
    });

    const { currency, symbol, setCurrency } = useCryptoStore();

    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar position="static" color="transparent">
                <Container>
                    <Toolbar>
                        <Link to="/">
                            <Typography className={classes.title} variant="h6">
                                CRYPTO HUNTER
                            </Typography>
                        </Link>
                        <Select 
                            variant="outlined" 
                            style={{ width: 100, height: 40, marginLeft: 900 }}
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <MenuItem value={"USD"}>USD</MenuItem>        
                            <MenuItem value={"INR"}>INR</MenuItem>
                        </Select>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    );
}

export default Header;
