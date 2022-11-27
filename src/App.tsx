import { ToastContainer } from "react-toastify";
import { Home } from "./pages/Home";

function App() {
  return (
    <>
      <Home />
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
