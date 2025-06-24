import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Scada from "./scada";
import SCADA_01 from "./SCADA_01";
import reportWebVitals from "./reportWebVitals";
import SCADAPnIDDiagram from "./SCADAPnIDDiagram";
import ScadaPIDDiagram from "./ScadaPIDDiagram";

import { Container, Typography } from "@mui/material";
import IoTDataTable from "./components/IoTDataTable";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Scada />
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
