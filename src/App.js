import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import Registration from "./components/Registration";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Home />
          <Login />
          <Registration />
        </header>
      </div>
    </Router>
  );
}

export default App;
