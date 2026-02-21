import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { FleetProvider } from "./context/FleetContext";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <FleetProvider>
        <AppRoutes />
      </FleetProvider>
    </BrowserRouter>
  );
};

export default App;
