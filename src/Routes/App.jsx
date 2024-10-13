
import { makeStyles } from '@material-ui/core/styles'; 
import '../App.css';
import Header from '../Components/Header';
import { Outlet } from 'react-router-dom';
import 'react-alice-carousel/lib/alice-carousel.css';

const useStyles = makeStyles(() => ({
  App: {
    
    minHeight: "100vh", 
    background:"#14161a",
    color:"white",

  }
}));

function App() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.App}>
        <Header />
        <Outlet />
      </div>
    </>
  );
}

export default App;
