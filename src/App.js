import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter className="App">
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// <a href='https://www.freepik.com/vectors/calendar-cartoon'>Calendar cartoon vector created by pch.vector - www.freepik.com</a>
