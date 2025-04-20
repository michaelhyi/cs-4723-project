import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateProxy from "./pages/CreateProxy";
import ViewProxy from "./pages/ViewProxy";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/proxy/create" element={<CreateProxy />} />
        <Route path="/proxy/:proxyId" element={<ViewProxy />} />
      </Routes>
    </Router>
  );
}

export default App;
