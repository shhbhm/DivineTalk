import "./App.css";
import { useColorMode } from "@chakra-ui/react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ChatState from "./context/appState";
import { useContext } from "react";
import chatContext from "./context/chatContext";

function App(props) {
  const { toggleColorMode } = useColorMode();
  const context = useContext(chatContext);

  return (
    <div className="App">
      <Navbar toggleColorMode={toggleColorMode} context={context} />
      <Footer />
    </div>
  );
}

export default App;
