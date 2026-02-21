import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
