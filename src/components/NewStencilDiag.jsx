import React, { useEffect, useRef } from "react";
import { dia, shapes, ui, format, util } from "@joint/plus";
import "@joint/plus/joint-plus.css";
import "./styles.css";

import { Box, Paper, Divider, Toolbar } from "@mui/material";

export default function NewStencilDiag() {
  const paperRef = useRef(null);
  const stencilRef = useRef(null);
  const toolbarRef = useRef(null);
  const inspectorRef = useRef(null);

  useEffect(() => {
    const namespace = shapes;
    const graph = new dia.Graph({}, { cellNamespace: namespace });
    const paper = new dia.Paper({
      model: graph,
      width: 2000,
      height: 2000,
      background: { color: "#F5F5F5" },
      cellViewNamespace: namespace,
      defaultRouter: { name: "orthogonal" },
      defaultConnector: { name: "straight", args: { cornerType: "line" } },
    });
    const paperScroller = new ui.PaperScroller({
      paper: paper,
      scrollWhileDragging: true,
    });
    if (paperRef.current) {
      paperRef.current.innerHTML = "";
      paperRef.current.appendChild(paperScroller.render().el);
    }

    paper.on("paper:pinch", (_evt, ox, oy, scale) => {
      const zoom = paperScroller.zoom();
      paperScroller.zoom(zoom * scale, {
        min: 0.2,
        max: 5,
        ox,
        oy,
        absolute: true,
      });
    });

    // Create elements
    const rect1 = new shapes.standard.Rectangle();
    rect1.position(875, 885);
    rect1.resize(180, 50);
    rect1.addTo(graph);
    const rect2 = new shapes.standard.Rectangle();
    rect2.position(945, 1065);
    rect2.resize(180, 50);
    rect2.addTo(graph);
    rect1.attr("body", { stroke: "#C94A46", rx: 2, ry: 2 });
    rect2.attr("body", { stroke: "#C94A46", rx: 2, ry: 2 });
    rect1.attr("label", { text: "Hello", fill: "#353535" });
    rect2.attr("label", { text: "World!", fill: "#353535" });

    // Create link
    const link = new shapes.standard.Link();
    link.source(rect1);
    link.target(rect2);
    link.addTo(graph);
    link.appendLabel({
      attrs: {
        text: {
          text: "to the",
        },
      },
    });
    link.router("orthogonal");
    link.connector("straight", { cornerType: "line" });

    // Center content
    paperScroller.centerContent();

    // Create stencil
    const stencil = new ui.Stencil({
      paper: paper,
      width: 170,
      height: "100%",
      layout: true,
      dropAnimation: true,
    });
    stencil.render();
    if (stencilRef.current) {
      stencilRef.current.innerHTML = "";
      stencilRef.current.appendChild(stencil.el);
    }

    const elements = [
      {
        type: "standard.Rectangle",
        size: { width: 70, height: 50 },
        attrs: {
          body: {
            stroke: "#C94A46",
            rx: 2,
            ry: 2,
          },
        },
      },
      {
        type: "standard.Ellipse",
        size: { width: 70, height: 50 },
        attrs: {
          body: {
            stroke: "#C94A46",
          },
        },
      },
      {
        type: "standard.Polygon",
        size: { width: 70, height: 50 },
        attrs: {
          body: {
            stroke: "#C94A46",
            points:
              "calc(w/2),0 calc(w),calc(h/2) calc(w/2),calc(h) 0,calc(h/2)",
          },
        },
      },
      {
        type: "standard.Cylinder",
        size: { width: 70, height: 50 },
        attrs: {
          body: {
            stroke: "#C94A46",
          },
          top: {
            fill: "#C94A46",
            stroke: "#C94A46",
          },
        },
      },
    ];
    stencil.load(elements);

    // Halo
    function openHalo(cellView) {
      new ui.Halo({ cellView: cellView }).render();
    }
    paper.on("cell:pointerup", (cellView) => {
      openHalo(cellView);
    });
    openHalo(paper.findViewByModel(rect1));

    // Toolbar
    const toolbar = new ui.Toolbar({
      tools: [
        { type: "button", name: "json", text: "Export JSON" },
        { type: "button", name: "svg", text: "Export SVG" },
        "separator",
        "zoomToFit",
        "zoomSlider",
      ],
      references: {
        paperScroller: paperScroller,
      },
    });
    toolbar.render();
    if (toolbarRef.current) {
      toolbarRef.current.innerHTML = "";
      toolbarRef.current.appendChild(toolbar.el);
    }

    toolbar.on("json:pointerclick", () => {
      const str = JSON.stringify(graph.toJSON());
      const bytes = new TextEncoder().encode(str);
      const blob = new Blob([bytes], {
        type: "application/json;charset=utf-8",
      });
      util.downloadBlob(blob, "joint-plus.json");
    });
    toolbar.on("svg:pointerclick", () => {
      format.toSVG(
        paper,
        (svg) => {
          util.downloadDataUri(
            `data:image/svg+xml,${encodeURIComponent(svg)}`,
            "joint-plus.svg"
          );
        },
        { useComputedStyles: false }
      );
    });

    // Inspector
    function openInspector(cell) {
      closeInspector();
      ui.Inspector.create(inspectorRef.current, {
        cell: cell,
        inputs: getInspectorConfig(cell),
      });
    }
    function closeInspector() {
      ui.Inspector.close();
    }
    function getInspectorConfig(cell) {
      if (cell.isElement()) {
        return {
          attrs: {
            label: {
              text: {
                type: "content-editable",
                label: "Label",
              },
            },
          },
        };
      } else {
        return {
          labels: {
            type: "list",
            label: "Labels",
            item: {
              type: "object",
              properties: {
                attrs: {
                  text: {
                    text: {
                      type: "content-editable",
                      label: "Text",
                      defaultValue: "label",
                    },
                  },
                },
                position: {
                  type: "select-box",
                  options: [
                    { value: 30, content: "Source" },
                    { value: 0.5, content: "Middle" },
                    { value: -30, content: "Target" },
                  ],
                  defaultValue: 0.5,
                  label: "Position",
                },
              },
            },
          },
        };
      }
    }
    paper.on("cell:pointerdown", (cellView) => {
      openInspector(cellView.model);
    });
    stencil.on("element:drop", (elementView) => {
      openInspector(elementView.model);
    });
    paper.on("blank:pointerdown", () => {
      closeInspector();
    });
    openInspector(rect1);

    // Cleanup
    return () => {
      paper.remove();
      graph.clear();
      if (paperRef.current) paperRef.current.innerHTML = "";
      if (stencilRef.current) stencilRef.current.innerHTML = "";
      if (toolbarRef.current) toolbarRef.current.innerHTML = "";
      if (inspectorRef.current) inspectorRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div
      className="jointjs-container"
      style={{ display: "flex", height: "100vh" }}
    >
      <div
        ref={stencilRef}
        id="stencil"
        style={{ width: 170, borderRight: "1px solid #eee" }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          ref={toolbarRef}
          id="toolbar"
          style={{ height: 50, borderBottom: "1px solid #eee" }}
        />
        <div style={{ display: "flex", flex: 1 }}>
          <div
            ref={paperRef}
            id="paper"
            style={{ flex: 1, background: "#F5F5F5" }}
          />
          <div
            ref={inspectorRef}
            id="inspector"
            style={{
              width: 300,
              borderLeft: "1px solid #eee",
              background: "#fff",
            }}
          />
        </div>
      </div>
    </div>
  );
}
