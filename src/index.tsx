import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Scada from "./scada";
import Scada_02 from "./scada_02";
import SCADA_01 from "./SCADA_01";
import reportWebVitals from "./reportWebVitals";
import SCADAPnIDDiagram from "./SCADAPnIDDiagram";
import ScadaPIDDiagram from "./ScadaPIDDiagram";
import CircuitSimulator from "./components/electrical-circuit-simulator";
import ScadaDiagram from "./components/ScadaDiagram";
import Generator from "./components/Generator";

import { Container, Typography } from "@mui/material";
import IoTDataTable from "./components/IoTDataTable";
import ElectricalCircuitSimulator from "./components/ElectricalCircuitSimulator";
import JointJSCircuitSimulator from "./components/JointJSCircuitSimulator";
import NewDiagram from "./components/NewDiagram";
import NewDiagTest from "./components/NewDiagTest";
import NewStencilDiag from "./components/NewStencilDiag";
import PumpComponent from "./components/PumpComponent";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    {/* <CircuitSimulator /> */}
    <NewDiagTest />
    {/* <svg width="300" height="300">
      <Generator
        x={50}
        y={50}
        initialPower={0}
        onPowerClick={() => console.log("Generator clicked")}
      />
    </svg> */}
    {/* <App /> */}
    {/* <Container maxWidth="lg" style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <IoTDataTable />
    </Container> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
