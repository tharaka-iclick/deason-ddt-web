import React, { useEffect, useRef, useState } from "react";
import { dia, shapes, ui, util } from "@joint/plus";
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

// Custom SCADA shapes for P&ID diagrams
const ScadaShapes = {
  // Valve shapes
  Valve: dia.Element.define(
    "scada.Valve",
    {
      size: { width: 40, height: 40 },
      attrs: {
        body: {
          width: "calc(w)",
          height: "calc(h)",
          stroke: "#2c3e50",
          strokeWidth: 2,
          fill: "#ecf0f1",
        },
        symbol: {
          d: "M 10 10 L 30 20 L 10 30 Z",
          stroke: "#2c3e50",
          strokeWidth: 2,
          fill: "#3498db",
        },
        label: {
          text: "V",
          fontSize: 12,
          fontFamily: "Arial",
          fill: "#2c3e50",
          textAnchor: "middle",
          x: "calc(w/2)",
          y: "calc(h/2 + 4)",
        },
      },
    },
    {
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "path",
          selector: "symbol",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
    }
  ),

  // Pump shape
  Pump: dia.Element.define(
    "scada.Pump",
    {
      size: { width: 50, height: 50 },
      attrs: {
        body: {
          cx: "calc(w/2)",
          cy: "calc(h/2)",
          r: "calc(w/2 - 2)",
          stroke: "#2c3e50",
          strokeWidth: 2,
          fill: "#e74c3c",
        },
        impeller: {
          cx: "calc(w/2)",
          cy: "calc(h/2)",
          r: "calc(w/3)",
          stroke: "#2c3e50",
          strokeWidth: 1,
          fill: "none",
        },
        label: {
          text: "P",
          fontSize: 14,
          fontFamily: "Arial",
          fill: "white",
          textAnchor: "middle",
          x: "calc(w/2)",
          y: "calc(h/2 + 5)",
        },
      },
    },
    {
      markup: [
        {
          tagName: "circle",
          selector: "body",
        },
        {
          tagName: "circle",
          selector: "impeller",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
    }
  ),

  // Tank shape
  Tank: dia.Element.define(
    "scada.Tank",
    {
      size: { width: 60, height: 80 },
      attrs: {
        body: {
          width: "calc(w)",
          height: "calc(h)",
          stroke: "#2c3e50",
          strokeWidth: 2,
          fill: "#95a5a6",
          rx: 5,
        },
        level: {
          width: "calc(w - 4)",
          height: "calc(h/2)",
          x: 2,
          y: "calc(h/2)",
          fill: "#3498db",
          opacity: 0.7,
        },
        label: {
          text: "TANK",
          fontSize: 10,
          fontFamily: "Arial",
          fill: "#2c3e50",
          textAnchor: "middle",
          x: "calc(w/2)",
          y: "calc(h - 10)",
        },
      },
    },
    {
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "rect",
          selector: "level",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
    }
  ),

  // Sensor shape
  Sensor: dia.Element.define(
    "scada.Sensor",
    {
      size: { width: 30, height: 30 },
      attrs: {
        body: {
          cx: "calc(w/2)",
          cy: "calc(h/2)",
          r: "calc(w/2 - 1)",
          stroke: "#2c3e50",
          strokeWidth: 2,
          fill: "#f39c12",
        },
        indicator: {
          cx: "calc(w/2)",
          cy: "calc(h/2)",
          r: "calc(w/4)",
          fill: "#e67e22",
        },
        label: {
          text: "S",
          fontSize: 10,
          fontFamily: "Arial",
          fill: "white",
          textAnchor: "middle",
          x: "calc(w/2)",
          y: "calc(h/2 + 3)",
        },
      },
    },
    {
      markup: [
        {
          tagName: "circle",
          selector: "body",
        },
        {
          tagName: "circle",
          selector: "indicator",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
    }
  ),

  // Motor shape
  Motor: dia.Element.define(
    "scada.Motor",
    {
      size: { width: 40, height: 40 },
      attrs: {
        body: {
          cx: "calc(w/2)",
          cy: "calc(h/2)",
          r: "calc(w/2 - 1)",
          stroke: "#2c3e50",
          strokeWidth: 2,
          fill: "#9b59b6",
        },
        coil: {
          d: "M 10 15 Q 15 10 20 15 Q 25 20 30 15",
          stroke: "white",
          strokeWidth: 2,
          fill: "none",
        },
        label: {
          text: "M",
          fontSize: 12,
          fontFamily: "Arial",
          fill: "white",
          textAnchor: "middle",
          x: "calc(w/2)",
          y: "calc(h/2 + 10)",
        },
      },
    },
    {
      markup: [
        {
          tagName: "circle",
          selector: "body",
        },
        {
          tagName: "path",
          selector: "coil",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
    }
  ),

  // Heat Exchanger
  HeatExchanger: dia.Element.define(
    "scada.HeatExchanger",
    {
      size: { width: 80, height: 40 },
      attrs: {
        body: {
          width: "calc(w)",
          height: "calc(h)",
          stroke: "#2c3e50",
          strokeWidth: 2,
          fill: "#ecf0f1",
        },
        tubes: {
          d: "M 10 10 L 70 10 M 10 20 L 70 20 M 10 30 L 70 30",
          stroke: "#34495e",
          strokeWidth: 1,
        },
        label: {
          text: "HX",
          fontSize: 10,
          fontFamily: "Arial",
          fill: "#2c3e50",
          textAnchor: "middle",
          x: "calc(w/2)",
          y: "calc(h - 5)",
        },
      },
    },
    {
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "path",
          selector: "tubes",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
    }
  ),
};

const ScadaPIDDiagram: React.FC = () => {
  const paperContainerRef = useRef<HTMLDivElement>(null);
  const stencilContainerRef = useRef<HTMLDivElement>(null);
  const toolbarContainerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<dia.Paper>();
  const stencilRef = useRef<HTMLDivElement>(null);
  const [graph, setGraph] = useState<dia.Graph | null>(null);
  const [paper, setPaper] = useState<dia.Paper | null>(null);
  const [stencil, setStencil] = useState<ui.Stencil | null>(null);

  useEffect(() => {
    if (!paperRef.current || !stencilRef.current) return;

    // Create graph
    const newGraph = new dia.Graph(
      {},
      { cellNamespace: { ...shapes, ...ScadaShapes } }
    );

    const graph = new dia.Graph({}, { cellNamespace: shapes });

    // Create paper
    const newPaper = new dia.Paper({
      el: paperRef.current,
      model: graph,
      width: 1000,
      height: 800,
      gridSize: 10,
      drawGrid: true,
      background: {
        color: "#ffffff",
      },
      cellViewNamespace: shapes,
      snapLabels: true,
      labelMove: true,
      defaultLink: () =>
        new shapes.standard.Link({
          attrs: {
            line: {
              stroke: "#2c3e50",
              strokeWidth: 2,
              targetMarker: {
                type: "path",
                d: "M 10 -5 0 0 10 5 z",
                fill: "#2c3e50",
              },
            },
          },
        }),
      interactive: {
        linkMove: false,
      },
      defaultConnectionPoint: {
        name: "boundary",
        args: {
          extrapolate: true,
          stroke: true,
        },
      },
    });

    // Create stencil elements - these are templates, not positioned elements
    const stencilElements = [
      new ScadaShapes.Valve(),
      new ScadaShapes.Pump(),
      new ScadaShapes.Tank(),
      new ScadaShapes.Sensor(),
      new ScadaShapes.Motor(),
      new ScadaShapes.HeatExchanger(),
      // Add standard shapes
      new shapes.standard.Rectangle({
        size: { width: 60, height: 30 },
        attrs: {
          body: { fill: "#e8f4f8", stroke: "#2c3e50" },
          label: { text: "Process", fontSize: 10 },
        },
      }),
    ];

    // Create stencil
    const newStencil = new ui.Stencil({
      paper: newPaper,
      //   snaplines : true,
      scaleClones: true,
      width: 120,
      groups: {
        instruments: {
          label: "Instruments",
          index: 1,
          closed: false,
        },
        equipment: {
          label: "Equipment",
          index: 2,
          closed: false,
        },
      },
      dropAnimation: true,
      groupsToggleButtons: true,
      search: {
        "*": ["type", "attrs/label/text"],
      },
      layout: {
        columns: 1,
        columnWidth: 100,
        rowHeight: 70,
        resizeToFit: true,
        dx: 10,
        dy: 10,
      },
    });

    newStencil.render();
    stencilRef.current.appendChild(newStencil.el);

    // Load stencil with grouped elements
    newStencil.load({
      instruments: [
        stencilElements[3].clone(), // Sensor
        stencilElements[0].clone(), // Valve
      ],
      equipment: [
        stencilElements[1].clone(), // Pump
        stencilElements[2].clone(), // Tank
        stencilElements[4].clone(), // Motor
        stencilElements[5].clone(), // Heat Exchanger
        stencilElements[6].clone(), // Process Rectangle
      ],
    });

    // Add sample P&ID elements to demonstrate
    const tank1 = new ScadaShapes.Tank({
      position: { x: 150, y: 100 },
      attrs: { label: { text: "T-001" } },
    });

    const pump1 = new ScadaShapes.Pump({
      position: { x: 300, y: 200 },
      attrs: { label: { text: "P-001" } },
    });

    const valve1 = new ScadaShapes.Valve({
      position: { x: 250, y: 150 },
      attrs: { label: { text: "V-001" } },
    });

    const hx1 = new ScadaShapes.HeatExchanger({
      position: { x: 450, y: 180 },
      attrs: { label: { text: "E-001" } },
    });

    const sensor1 = new ScadaShapes.Sensor({
      position: { x: 380, y: 120 },
      attrs: { label: { text: "PT-001" } },
    });

    // Add elements to graph
    newGraph.addCells([tank1, pump1, valve1, hx1, sensor1]);

    // Create connections
    const link1 = new shapes.standard.Link({
      source: { id: tank1.id },
      target: { id: valve1.id },
      attrs: {
        line: { stroke: "#2c3e50", strokeWidth: 3 },
      },
    });

    const link2 = new shapes.standard.Link({
      source: { id: valve1.id },
      target: { id: pump1.id },
      attrs: {
        line: { stroke: "#2c3e50", strokeWidth: 3 },
      },
    });

    const link3 = new shapes.standard.Link({
      source: { id: pump1.id },
      target: { id: hx1.id },
      attrs: {
        line: { stroke: "#2c3e50", strokeWidth: 3 },
      },
    });

    newGraph.addCells([link1, link2, link3]);

    // Add paper event handlers
    newPaper.on("cell:pointerclick", (cellView) => {
      console.log("Clicked element:", cellView.model.get("type"));
    });

    newPaper.on("blank:pointerclick", () => {
      console.log("Clicked on blank area");
    });

    // Set states
    setGraph(newGraph);
    setPaper(newPaper);
    setStencil(newStencil);

    // Cleanup function
    return () => {
      newStencil?.remove();
      newPaper?.remove();
    };
  }, []);

  const exportDiagram = () => {
    if (paper) {
      const svgDoc = paper.svg;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgDoc);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "pid-diagram.svg";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const clearDiagram = () => {
    if (graph) {
      graph.clear();
    }
  };

  const zoomIn = () => {
    if (paper) {
      paper.scale(paper.scale().sx * 1.2, paper.scale().sy * 1.2);
    }
  };

  const zoomOut = () => {
    if (paper) {
      paper.scale(paper.scale().sx * 0.8, paper.scale().sy * 0.8);
    }
  };

  const resetZoom = () => {
    if (paper) {
      paper.scale(1, 1);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" color="text.primary" fontWeight="bold">
            SCADA P&ID Diagram Editor
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" color="primary" onClick={zoomIn}>
              Zoom In
            </Button>
            <Button variant="contained" color="primary" onClick={zoomOut}>
              Zoom Out
            </Button>
            <Button variant="contained" color="inherit" onClick={resetZoom}>
              Reset Zoom
            </Button>
            <Button variant="contained" color="success" onClick={exportDiagram}>
              Export SVG
            </Button>
            <Button variant="contained" color="error" onClick={clearDiagram}>
              Clear
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Stencil Panel */}
        <Paper
          elevation={1}
          sx={{
            width: 160,
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            overflowY: "auto",
          }}
        >
          <Box sx={{ p: 1, borderBottom: "1px solid #ddd" }}>
            <Typography variant="subtitle2" color="text.secondary">
              Components
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} ref={stencilRef} />
        </Paper>

        {/* Paper Area */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#f9fafb",
            minHeight: "800px",
            minWidth: "1200px",
          }}
          ref={paperRef}
        />
      </Box>

      {/* Status Bar */}
      <Box
        sx={{
          borderTop: "1px solid #ddd",
          px: 2,
          py: 1,
          bgcolor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 14,
          color: "text.secondary",
        }}
      >
        <span>Drag elements from the stencil to create your P&ID diagram</span>
        <span>Elements: {graph?.getCells().length || 0}</span>
      </Box>
    </Box>
  );
};

export default ScadaPIDDiagram;
