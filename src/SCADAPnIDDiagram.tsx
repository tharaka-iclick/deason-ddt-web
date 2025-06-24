import React, { useEffect, useRef } from "react";
import { dia, shapes, ui } from "@joint/plus";
import "@joint/plus/joint-plus.css";
import "./App.scss";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  Paper,
  Divider,
  Stack,
} from "@mui/material";

// Import SCADA-specific shapes (you might need to create these or use a library)
import {
  Pump,
  Valve,
  Tank,
  Flowmeter,
  PressureSensor,
  TemperatureSensor,
  Pipe,
  Controller,
} from "./scada-shapes"; // Assume these are custom shapes you've created

const StencilGroup = {
  Equipment: "equipment",
  Sensors: "sensors",
  SymbolShapes: "symbol-shapes",
} as const;

const SCADAPnIDDiagram: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const stencilRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<dia.Paper>();
  const graphRef = useRef<dia.Graph>();
  const scrollerRef = useRef<ui.PaperScroller>();
  const stencilRefInstance = useRef<ui.Stencil>();

  useEffect(() => {
    if (!canvasRef.current || !stencilRef.current || !toolbarRef.current)
      return;

    // Initialize JointJS graph and paper
    const graph = new dia.Graph({}, { cellNamespace: shapes });
    graphRef.current = graph;

    const paper = new dia.Paper({
      el: canvasRef.current,
      model: graph,
      width: 1000,
      height: 800,
      gridSize: 10,
      drawGrid: true,
      background: {
        color: "#F5F5F5",
      },
      cellViewNamespace: shapes,
      defaultConnectionPoint: {
        name: "boundary",
        args: {
          sticky: true,
        },
      },
      defaultRouter: {
        name: "manhattan",
        args: {
          startDirections: ["right"],
          endDirections: ["left"],
        },
      },
      defaultConnector: {
        name: "rounded",
        args: {
          radius: 20,
        },
      },
    });
    paperRef.current = paper;

    // Initialize paper scroller
    // const scroller = new ui.PaperScroller({
    //   paper,
    //   autoResizePaper: true,
    //   cursor: "grab",
    // });
    // scrollerRef.current = scroller;

    // // Render the scroller
    // // canvasRef.current.appendChild(scroller.el);
    // scroller.render().center();

    if (canvasRef.current) {
      // canvasRef.current.appendChild(paperRef.current.el);
      //   scroller.render().center();
    }
    const stencilGroups = [
      {
        name: "piping",
        label: "Piping Elements",
        collapsed: false,
      },
      {
        name: "instruments",
        label: "Instruments",
        collapsed: false,
      },
      {
        name: "equipment",
        label: "Equipment",
        collapsed: false,
      },
    ];

    // Initialize stencil
    const stencil = new ui.Stencil({
      paper: paperRef.current,
      width: 240,
      groups: {
        piping: { index: 1, label: "Piping Elements" },
        instruments: { index: 2, label: "Instruments" },
        equipment: { index: 3, label: "Equipment" },
      },
      scaleClones: true,
      layout: true,
      dropAnimation: true,
      search: { "*": ["type", "attrs/label/text", "attrs/text/text"] },
      groupsToggleButtons: true,
      cellNamespace: shapes,
    });
    stencilRefInstance.current = stencil;
    stencilRef.current.appendChild(stencil.el);
    stencil.render();

    // Define cells for each group
    const pipingCells = [
      new Pipe({ attrs: { label: { text: "Straight Pipe" } } }),
      new Pipe({ attrs: { label: { text: "Elbow Pipe" } } }),
      new Pipe({ attrs: { label: { text: "T-Junction" } } }),
    ];

    const instrumentsCells = [
      new Flowmeter({ attrs: { label: { text: "Flow Meter" } } }),
      new PressureSensor({ attrs: { label: { text: "Pressure Sensor" } } }),
      new TemperatureSensor({ attrs: { label: { text: "Temp Sensor" } } }),
    ];

    const equipmentCells = [
      new Pump({ attrs: { label: { text: "Centrifugal Pump" } } }),
      new Valve({ attrs: { label: { text: "Ball Valve" } } }),
      new Tank({ attrs: { label: { text: "Storage Tank" } } }),
      new Controller({ attrs: { label: { text: "PLC Controller" } } }),
    ];

    // Load cells into stencil with groups
    stencil.load({
      piping: pipingCells,
      instruments: instrumentsCells,
      equipment: equipmentCells,
    });
    // Add some toolbar controls
    const toolbar = new ui.Toolbar({
      tools: [
        "zoom-in",
        "zoom-out",
        "zoom-to-fit",
        {
          name: "undo",
          command: "undo",
        },
        {
          name: "redo",
          command: "redo",
        },
      ],
      references: {
        paperScroller: paperRef.current,
        commandManager: new dia.CommandManager({ graph }),
      },
    });
    toolbarRef.current.appendChild(toolbar.el);
    // toolbar.render();

    // Handle window resize
    const handleResize = () => {
      paperRef.current!.el.style.width = `${window.innerWidth - 250}px`;
      paperRef.current!.el.style.height = `${window.innerHeight - 100}px`;
      // scroller.resize();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      paper.remove();
      graph.clear();
    };
  }, []);

  return (
    // <div
    // //   className="scada-pnid-container"
    // //   style={{ display: "flex", height: "100vh" }}
    // >
    //   {/* <div
    //     ref={stencilRef}
    //     style={{
    //       width: "240px",
    //       padding: "10px",
    //       overflowY: "auto",
    //       background: "#f0f0f0",
    //     }}
    //   />
    //   <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
    //     <div
    //       ref={toolbarRef}
    //       style={{ height: "50px", padding: "5px", background: "#e0e0e0" }}
    //     />
    //     <div ref={canvasRef} style={{ flexGrow: 1, position: "relative" }} />
    //   </div> */}
    // </div>

    <div
      className="diagram-container"
      style={{ display: "flex", height: "100vh" }}
    >
      <div
        ref={stencilRef}
        id="stencil-container"
        style={{
          width: "240px",
          padding: "10px",
          overflowY: "auto",
          background: "#f0f0f0",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <div
          ref={toolbarRef}
          id="toolbar"
          style={{ height: "50px", padding: "5px", background: "#e0e0e0" }}
        />
        <div
          ref={canvasRef}
          id="paper-container"
          style={{ flexGrow: 1, position: "relative", overflow: "hidden" }}
        />
      </div>
    </div>
  );
};

export default SCADAPnIDDiagram;
