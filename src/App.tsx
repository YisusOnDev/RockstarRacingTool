import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from "react-toastify";
import { Home } from "./pages/Home";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7817be',
    },
    secondary: {
      main: '#2d1532',
    },
    background: {
      default: '#101010',
    },
    text: {
      primary: '#eeeeee',
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Home />
      </ThemeProvider>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark" />
    </>
  );
}

export default App;
