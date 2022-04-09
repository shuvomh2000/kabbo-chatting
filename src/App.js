import {BrowserRouter,Routes,Route} from "react-router-dom";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Home from './components/Home'
// import './babel.config'
// import './babel-plugin-macros.config'

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/registration" element={<Registration/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
