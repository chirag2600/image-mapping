import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddModule from "./pages/AddModule";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddModule />} />
      </Routes>
    </Router>
  );
};

export default App;
