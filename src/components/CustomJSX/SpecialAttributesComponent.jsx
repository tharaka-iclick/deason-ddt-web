import React, { useEffect, useRef, useState } from "react";
import * as joint from "@joint/plus";

const SpecialAttributesComponent = () => {
  const paperRef = useRef(null);
  const graph = useRef(null);
  const paper = useRef(null);
  const valveControlRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const [graph2Props, setGraph2Props] = useState({
    graphCustomProperty: "",
    graphExportTime: "",
  });
  const [valveState, setValveState] = useState("open");
  const [buttonState, setButtonState] = useState("open");
  const [valves, setValves] = useState([]);
  const inputFileRef = useRef(null);

  useEffect(() => {
    const namespace = joint.shapes;
    graph.current = new joint.dia.Graph({}, { cellNamespace: namespace });

    const paperInstance = new joint.dia.Paper({
      el: paperRef.current,
      model: graph.current,
      width: 600,
      height: 300,
      gridSize: 10,
      drawGrid: true,
      background: {
        color: "rgba(0, 255, 0, 0.3)",
      },
      interactive: false,
      cellViewNamespace: namespace,
    });

    paper.current = paperInstance;

    const rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 30);
    rect.resize(100, 40);
    rect.attr({
      body: {
        cursor: "pointer",
        fill: "white",
        stroke: "black",
      },
      label: {
        text: "Element #1",
        cursor: "pointer",
        fill: "black",
      },
    });
    rect.addTo(graph.current);

    const rect2 = rect.clone();
    rect2.translate(300, 0);
    rect2.attr("label/text", "Element #2");
    rect2.addTo(graph.current);

    const link = new joint.shapes.standard.Link();
    link.source(rect);
    link.target(rect2);
    link.attr({
      line: {
        stroke: "black",
      },
    });
    link.labels([
      {
        markup: [
          { tagName: "rect", selector: "body" },
          { tagName: "text", selector: "label" },
        ],
        attrs: {
          label: {
            cursor: "pointer",
            text: "Link",
            textAnchor: "middle",
            textVerticalAnchor: "middle",
            fontSize: 12,
            fill: "black",
          },
          body: {
            cursor: "pointer",
            ref: "label",
            refX: "-10%",
            refY: "-10%",
            refWidth: "120%",
            refHeight: "120%",
            fill: "white",
            stroke: "black",
            strokeWidth: 2,
          },
        },
      },
    ]);
    link.addTo(graph.current);

    const info = new joint.shapes.standard.Rectangle();
    info.position(250, 70);
    info.resize(100, 20);
    info.attr({
      body: {
        visibility: "hidden",
        cursor: "default",
        fill: "white",
        stroke: "black",
      },
      label: {
        visibility: "hidden",
        text: "Link clicked",
        cursor: "default",
        fill: "black",
        fontSize: 12,
      },
    });
    info.addTo(graph.current);

    // Create Toggle Button Element
    const ToggleButton = joint.dia.Element.define(
      "examples.ToggleButton",
      {
        attrs: {
          body: {
            width: 80,
            height: 30,
            strokeWidth: 2,
            stroke: "#000000",
            fill: "lightblue",
            cursor: "pointer",
          },
          label: {
            text: "OPEN",
            x: 40,
            y: 15,
            textAnchor: "middle",
            textVerticalAnchor: "middle",
            fontSize: 12,
            fill: "black",
            cursor: "pointer",
            fontWeight: "bold",
          },
        },
      },
      {
        markup: [
          { tagName: "rect", selector: "body" },
          { tagName: "text", selector: "label" },
        ],
      }
    );

    namespace.examples = namespace.examples || {};
    namespace.examples.ToggleButton = ToggleButton;

    const toggleButton = new ToggleButton();
    toggleButton.position(500, 10);
    toggleButton.resize(80, 30);
    toggleButton.addTo(graph.current);
    toggleButtonRef.current = toggleButton;

    // Make toggle button interactive
    const handleButtonClick = () => {
      if (!toggleButtonRef.current) return;

      // Get current state from the button element itself
      const currentText = toggleButtonRef.current.attr("label/text");
      const currentState = currentText.toLowerCase();
      const newState = currentState === "open" ? "closed" : "open";

      setButtonState(newState);

      toggleButtonRef.current.attr({
        body: {
          fill: newState === "open" ? "lightblue" : "lightcoral",
        },
        label: {
          text: newState.toUpperCase(),
        },
      });

      // Also update the valve control to match
      if (valveControlRef.current) {
        setValveState(newState);
        valveControlRef.current.attr({
          body: {
            fill: newState === "open" ? "green" : "red",
          },
          label: {
            text: `Valve: ${
              newState.charAt(0).toUpperCase() + newState.slice(1)
            }`,
          },
        });
      }
    };

    paperInstance.on("element:pointerclick", function (elementView) {
      if (elementView.model === toggleButton) {
        handleButtonClick();
      }
    });

    paperInstance.on("blank:pointerdblclick", function () {
      resetAll(this);

      info.attr("body/visibility", "hidden");
      info.attr("label/visibility", "hidden");

      this.drawBackground({
        color: "orange",
      });
    });

    paperInstance.on("element:pointerdblclick", function (elementView) {
      resetAll(this);

      var currentElement = elementView.model;
      currentElement.attr("body/stroke", "orange");
    });

    paperInstance.on("link:pointerdblclick", function (linkView) {
      resetAll(this);

      var currentLink = linkView.model;
      currentLink.attr("line/stroke", "orange");
      currentLink.label(0, {
        attrs: {
          body: {
            stroke: "orange",
          },
        },
      });
    });

    paperInstance.on("cell:pointerdblclick", function (cellView) {
      var isElement = cellView.model.isElement();
      var message = (isElement ? "Element" : "Link") + " clicked";
      info.attr("label/text", message);

      info.attr("body/visibility", "visible");
      info.attr("label/visibility", "visible");
    });

    function resetAll(paper) {
      paper.drawBackground({
        color: "white",
      });

      var elements = paper.model.getElements();
      for (var i = 0, ii = elements.length; i < ii; i++) {
        var currentElement = elements[i];
        currentElement.attr("body/stroke", "black");
      }

      var links = paper.model.getLinks();
      for (var j = 0, jj = links.length; j < jj; j++) {
        var currentLink = links[j];
        currentLink.attr("line/stroke", "black");
        currentLink.label(0, {
          attrs: {
            body: {
              stroke: "black",
            },
          },
        });
      }
    }

    const CustomElement = joint.dia.Element.define(
      "examples.CustomElement",
      {
        attrs: {
          e: {
            strokeWidth: 1,
            stroke: "#000000",
            fill: "rgba(255,0,0,0.3)",
          },
          r: {
            strokeWidth: 1,
            stroke: "#000000",
            fill: "rgba(0,255,0,0.3)",
          },
          c: {
            strokeWidth: 1,
            stroke: "#000000",
            fill: "rgba(0,0,255,0.3)",
          },
          outline: {
            x: 0,
            y: 0,
            width: "calc(w)",
            height: "calc(h)",
            strokeWidth: 1,
            stroke: "#000000",
            strokeDasharray: "5 5",
            strokeDashoffset: 2.5,
            fill: "none",
          },
        },
      },
      {
        markup: [
          { tagName: "ellipse", selector: "e" },
          { tagName: "rect", selector: "r" },
          { tagName: "circle", selector: "c" },
          { tagName: "rect", selector: "outline" },
        ],
      }
    );

    namespace.examples.CustomElement = CustomElement;

    const element = new CustomElement();
    element.attr({
      e: {
        rx: "calc(0.5*w)",
        ry: "calc(0.25*h)",
        cx: 0,
        cy: "calc(0.25*h)",
      },
      r: {
        x: "calc(w-10)",
        y: "calc(h-10)",
        width: "calc(0.5*w)",
        height: "calc(0.5*h)",
      },
      c: {
        r: "calc(0.5*d)",
        cx: "calc(0.5*w)",
        cy: "calc(0.5*h)",
      },
    });
    element.position(280, 130);
    element.resize(40, 40);
    element.addTo(graph.current);

    function contract(el) {
      el.transition(
        "size",
        { width: 40, height: 40 },
        {
          delay: 1000,
          duration: 4000,
          valueFunction: joint.util.interpolate.object,
        }
      );

      el.transition(
        "position",
        { x: 280, y: 130 },
        {
          delay: 1000,
          duration: 4000,
          valueFunction: joint.util.interpolate.object,
        }
      );

      el.stretchToggle = true;
    }

    function stretch(el) {
      el.transition(
        "size",
        { width: 270, height: 100 },
        {
          delay: 1000,
          duration: 4000,
          valueFunction: joint.util.interpolate.object,
        }
      );

      el.transition(
        "position",
        { x: 165, y: 100 },
        {
          delay: 1000,
          duration: 4000,
          valueFunction: joint.util.interpolate.object,
        }
      );

      el.stretchToggle = false;
    }

    element.currentTransitions = 0;
    element.stretchToggle = false;

    stretch(element);

    element.on("transition:start", () => {
      element.currentTransitions += 1;
    });

    element.on("transition:end", () => {
      element.currentTransitions -= 1;
      if (element.currentTransitions === 0) {
        if (element.stretchToggle) stretch(element);
        else contract(element);
      }
    });

    // Define ValveControl element
    const ValveControl = joint.dia.Element.define(
      "examples.ValveControl",
      {
        attrs: {
          body: {
            r: 20,
            cx: 20,
            cy: 20,
            strokeWidth: 2,
            stroke: "#000000",
            fill: "green",
          },
          label: {
            text: "Valve: Open",
            x: 20,
            y: 45,
            textAnchor: "middle",
            fontSize: 12,
            fill: "black",
          },
        },
        ports: {
          groups: {
            in: {
              position: "left",
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: "#31d0c6",
                  strokeWidth: 2,
                  fill: "#ffffff",
                },
              },
            },
            out: {
              position: "right",
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: "#31d0c6",
                  strokeWidth: 2,
                  fill: "#ffffff",
                },
              },
            },
          },
        },
      },
      {
        markup: [
          { tagName: "circle", selector: "body" },
          { tagName: "text", selector: "label" },
        ],
      }
    );

    const PipeLink = joint.dia.Link.define(
      "examples.PipeLink",
      {
        attrs: {
          line: {
            connection: true,
            stroke: "#346f83",
            strokeWidth: 10,
            strokeLinejoin: "round",
            strokeLinecap: "round",
          },
          outline: {
            connection: true,
            stroke: "#004456",
            strokeWidth: 4,
            strokeLinejoin: "round",
            strokeLinecap: "round",
          },
          wrapper: {
            connection: true,
            strokeWidth: 10,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            stroke: "transparent",
            fill: "none",
          },
          // Pipe segments to create a realistic pipe look
          pipeShadow: {
            stroke: "#666666",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none",
            strokeDasharray: "0",
          },
          pipeHighlight: {
            stroke: "#888888",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none",
          },
        },
        router: { name: "normal" }, // Simplified router
        connector: { name: "normal" }, //
      },
      {
        markup: [
          { tagName: "path", selector: "wrapper" }, // Removed groupSelector
          { tagName: "path", selector: "pipeShadow" }, // Removed groupSelector
          { tagName: "path", selector: "line" }, // Removed groupSelector
          { tagName: "path", selector: "pipeHighlight" }, // Removed groupSelector
        ],
      }
    );

    namespace.examples.ValveControl = ValveControl;
    namespace.examples.PipeLink = PipeLink;

    const valve = new ValveControl();
    valve.position(50, 200);
    valve.resize(40, 40);
    valve.addPorts([
      { id: "in", group: "in" },
      { id: "out", group: "out" },
    ]);
    valve.addTo(graph.current);
    valveControlRef.current = valve;

    const valve2 = new ValveControl();
    valve2.position(200, 150);
    valve2.resize(40, 40);
    valve2.attr("label/text", "Valve: Open");
    valve2.addPorts([
      { id: "in", group: "in" },
      { id: "out", group: "out" },
    ]);
    valve2.addTo(graph.current);

    const valve3 = new ValveControl();
    valve3.position(350, 200);
    valve3.resize(40, 40);
    valve3.attr("label/text", "Valve: Open");
    valve3.addPorts([
      { id: "in", group: "in" },
      { id: "out", group: "out" },
    ]);
    valve3.addTo(graph.current);

    // Connect valves with pipe links
    const pipe1 = new PipeLink();
    pipe1.source(valve, { port: "out" });
    pipe1.target(valve2, { port: "in" });
    pipe1.addTo(graph.current);

    const pipe2 = new PipeLink();
    pipe2.source(valve2, { port: "out" });
    pipe2.target(valve3, { port: "in" });
    pipe2.addTo(graph.current);
  }, []);

  const handleToggleButton = () => {
    if (!toggleButtonRef.current) return;

    // Get current state from the button element itself to avoid closure issues
    const currentText = toggleButtonRef.current.attr("label/text");
    const currentState = currentText.toLowerCase();
    const newState = currentState === "open" ? "closed" : "open";

    setButtonState(newState);

    toggleButtonRef.current.attr({
      body: {
        fill: newState === "open" ? "lightblue" : "lightcoral",
      },
      label: {
        text: newState.toUpperCase(),
      },
    });

    // Also update the valve control to match
    if (valveControlRef.current) {
      setValveState(newState);
      valveControlRef.current.attr({
        body: {
          fill: newState === "open" ? "green" : "red",
        },
        label: {
          text: `Valve: ${
            newState.charAt(0).toUpperCase() + newState.slice(1)
          }`,
        },
      });
    }
  };

  const handleToggleValve = () => {
    if (!valveControlRef.current) return;

    const newState = valveState === "open" ? "closed" : "open";
    setValveState(newState);
    setButtonState(newState);

    valveControlRef.current.attr({
      body: {
        fill: newState === "open" ? "green" : "red",
      },
      label: {
        text: `Valve: ${newState.charAt(0).toUpperCase() + newState.slice(1)}`,
      },
    });

    // Also update the toggle button to match
    if (toggleButtonRef.current) {
      toggleButtonRef.current.attr({
        body: {
          fill: newState === "open" ? "lightblue" : "lightcoral",
        },
        label: {
          text: newState.toUpperCase(),
        },
      });
    }
  };

  const handleExportGraph = () => {
    graph.current.set("graphCustomProperty", true);
    graph.current.set("graphExportTime", Date.now());

    const rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 100);
    rect.resize(120, 40);
    rect.attr({
      body: { fill: "#90ee90" },
      label: { text: "Exported Node", fill: "black" },
    });
    rect.addTo(graph.current);

    const json = graph.current.toJSON();
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(json, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "graph.json");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportGraph = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);

        const namespace = joint.shapes;

        const CustomElement = joint.dia.Element.define(
          "examples.CustomElement",
          {
            attrs: {
              e: {
                strokeWidth: 1,
                stroke: "#000000",
                fill: "rgba(255,0,0,0.3)",
              },
              r: {
                strokeWidth: 1,
                stroke: "#000000",
                fill: "rgba(0,255,0,0.3)",
              },
              c: {
                strokeWidth: 1,
                stroke: "#000000",
                fill: "rgba(0,0,255,0.3)",
              },
              outline: {
                x: 0,
                y: 0,
                width: "calc(w)",
                height: "calc(h)",
                strokeWidth: 1,
                stroke: "#000000",
                strokeDasharray: "5 5",
                strokeDashoffset: 2.5,
                fill: "none",
              },
            },
          },
          {
            markup: [
              { tagName: "ellipse", selector: "e" },
              { tagName: "rect", selector: "r" },
              { tagName: "circle", selector: "c" },
              { tagName: "rect", selector: "outline" },
            ],
          }
        );

        namespace.examples = namespace.examples || {};
        namespace.examples.CustomElement = CustomElement;

        // Define ValveControl for import
        const ValveControl = joint.dia.Element.define(
          "examples.ValveControl",
          {
            attrs: {
              body: {
                r: 20,
                cx: 20,
                cy: 20,
                strokeWidth: 2,
                stroke: "#000000",
                fill: "green",
              },
              label: {
                text: "Valve: Open",
                x: 20,
                y: 45,
                textAnchor: "middle",
                fontSize: 12,
                fill: "black",
              },
            },
          },
          {
            markup: [
              { tagName: "circle", selector: "body" },
              { tagName: "text", selector: "label" },
            ],
          }
        );

        namespace.examples.ValveControl = ValveControl;

        // Define ToggleButton for import
        const ToggleButton = joint.dia.Element.define(
          "examples.ToggleButton",
          {
            attrs: {
              body: {
                width: 80,
                height: 30,
                strokeWidth: 2,
                stroke: "#000000",
                fill: "lightblue",
                cursor: "pointer",
              },
              label: {
                text: "OPEN",
                x: 40,
                y: 15,
                textAnchor: "middle",
                textVerticalAnchor: "middle",
                fontSize: 12,
                fill: "black",
                cursor: "pointer",
                fontWeight: "bold",
              },
            },
          },
          {
            markup: [
              { tagName: "rect", selector: "body" },
              { tagName: "text", selector: "label" },
            ],
          }
        );

        namespace.examples.ToggleButton = ToggleButton;

        graph.current.fromJSON(json);

        const custom = graph.current.get("graphCustomProperty");
        const time = graph.current.get("graphExportTime");

        setGraph2Props({
          graphCustomProperty: String(custom),
          graphExportTime: new Date(time).toLocaleString(),
        });

        const elements = graph.current.getElements();
        elements.forEach((el) => {
          if (el.get("type") === "examples.CustomElement") {
            el.currentTransitions = 0;
            el.stretchToggle = false;

            function contract(el) {
              el.transition(
                "size",
                { width: 40, height: 40 },
                {
                  delay: 1000,
                  duration: 4000,
                  valueFunction: joint.util.interpolate.object,
                }
              );

              el.transition(
                "position",
                { x: 280, y: 130 },
                {
                  delay: 1000,
                  duration: 4000,
                  valueFunction: joint.util.interpolate.object,
                }
              );

              el.stretchToggle = true;
            }

            function stretch(el) {
              el.transition(
                "size",
                { width: 270, height: 100 },
                {
                  delay: 1000,
                  duration: 4000,
                  valueFunction: joint.util.interpolate.object,
                }
              );

              el.transition(
                "position",
                { x: 165, y: 100 },
                {
                  delay: 1000,
                  duration: 4000,
                  valueFunction: joint.util.interpolate.object,
                }
              );

              el.stretchToggle = false;
            }

            stretch(el);

            el.on("transition:start", () => {
              el.currentTransitions += 1;
            });

            el.on("transition:end", () => {
              el.currentTransitions -= 1;
              if (el.currentTransitions === 0) {
                if (el.stretchToggle) stretch(el);
                else contract(el);
              }
            });
          } else if (el.get("type") === "examples.ValveControl") {
            valveControlRef.current = el;
            const currentState = el.attr("label/text").includes("Open")
              ? "open"
              : "closed";
            setValveState(currentState);
          } else if (el.get("type") === "examples.ToggleButton") {
            toggleButtonRef.current = el;
            const currentState = el.attr("label/text").toLowerCase();
            setButtonState(currentState);

            // Re-attach click event for imported button
            paper.current.on("element:pointerclick", function (elementView) {
              if (elementView.model === el) {
                handleToggleButton();
              }
            });
          }
        });
      } catch (err) {
        alert("Invalid JSON file: " + err.message);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <h2>Special Attributes Animation</h2>
      <div
        id="paper-special-attributes-relative-dimensions"
        ref={paperRef}
      ></div>
      <div style={{ padding: "1rem", fontFamily: "Arial" }}>
        <h2>JointJS Graph Export & Import Demo</h2>

        <button onClick={handleExportGraph} style={{ marginRight: "1rem" }}>
          Export Graph to JSON
        </button>

        <input
          type="file"
          ref={inputFileRef}
          accept=".json"
          style={{ display: "none" }}
          onChange={handleImportGraph}
        />
        <button
          onClick={() => inputFileRef.current.click()}
          style={{ marginRight: "1rem" }}
        >
          Import Graph from JSON
        </button>

        <button onClick={handleToggleValve}>
          Toggle Valve {valveState === "open" ? "Closed" : "Open"}
        </button>

        <div>
          <h4>Imported Graph Metadata:</h4>
          <pre style={{ background: "#eee", padding: 10 }}>
            {graph2Props.graphCustomProperty
              ? `graphCustomProperty: ${graph2Props.graphCustomProperty}
graphExportTime: ${graph2Props.graphExportTime}`
              : "No graph imported yet."}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SpecialAttributesComponent;
