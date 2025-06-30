// import React, { useEffect, useRef } from "react";
// import { dia, ui, shapes } from "@joint/plus";
// import { createRoot } from "react-dom/client";
// import Generator from "./components/Generator";
// import Bulb from "./components/Bulb";

// // Define ReactGenerator element
// const ReactGenerator = dia.Element.define(
//   "ReactGenerator",
//   {
//     size: { width: 100, height: 120 },
//     attrs: {
//       foreignObject: {
//         width: "calc(w)",
//         height: "calc(h)",
//       },
//     },
//     ports: {
//       items: [{ group: "out", id: "out", args: { x: 50, y: 80 } }],
//       groups: {
//         out: {
//           position: { name: "bottom" },
//           attrs: {
//             circle: {
//               r: 4,
//               magnet: true,
//               stroke: "#333333",
//               strokeWidth: 2,
//               fill: "#FFFFFF",
//             },
//           },
//         },
//       },
//     },
//   },
//   {
//     markup: [
//       {
//         tagName: "foreignObject",
//         selector: "foreignObject",
//         children: [
//           {
//             tagName: "div",
//             namespaceURI: "http://www.w3.org/1999/xhtml",
//             attributes: {
//               class: "react-container",
//             },
//           },
//         ],
//       },
//     ],
//   }
// );

// // Define ReactBulb element
// const ReactBulb = dia.Element.define(
//   "ReactBulb",
//   {
//     size: { width: 80, height: 100 },
//     attrs: {
//       foreignObject: {
//         width: "calc(w)",
//         height: "calc(h)",
//       },
//     },
//     ports: {
//       items: [{ group: "in", id: "in", args: { x: 40, y: 0 } }],
//       groups: {
//         in: {
//           position: { name: "top" },
//           attrs: {
//             circle: {
//               r: 4,
//               magnet: true,
//               stroke: "#333333",
//               strokeWidth: 2,
//               fill: "#FFFFFF",
//             },
//           },
//         },
//       },
//     },
//   },
//   {
//     markup: [
//       {
//         tagName: "foreignObject",
//         selector: "foreignObject",
//         children: [
//           {
//             tagName: "div",
//             namespaceURI: "http://www.w3.org/1999/xhtml",
//             attributes: {
//               class: "react-container",
//             },
//           },
//         ],
//       },
//     ],
//   }
// );

// // Define Wire link
// const Wire = dia.Link.define("Wire", {
//   attrs: {
//     line: {
//       stroke: "#333333",
//       strokeWidth: 2,
//       targetMarker: {
//         type: "path",
//         d: "M 10 -5 0 0 10 5",
//         fill: "none",
//         stroke: "#333333",
//       },
//     },
//   },
//   connector: "smooth",
// });

// const App = () => {
//   const paperContainerRef = useRef(null);
//   const stencilContainerRef = useRef(null);
//   const paperRef = useRef(null);
//   const stencilRef = useRef(null);
//   const rootsRef = useRef({});

//   useEffect(() => {
//     // Initialize JointJS graph and paper
//     const graph = new dia.Graph();
//     const paper = new dia.Paper({
//       el: paperContainerRef.current,
//       model: graph,
//       width: 600,
//       height: 400,
//       gridSize: 10,
//       drawGrid: true,
//       async: true,
//       sorting: dia.Paper.sorting.APPROX,
//       background: { color: "#F8F8F8" },
//       defaultLink: new Wire(),
//       validateConnection: (cellViewS, magnetS, cellViewT, magnetT) => {
//         if (!magnetS || !magnetT) return false;
//         const sourcePortGroup = magnetS.getAttribute("port-group");
//         const targetPortGroup = magnetT.getAttribute("port-group");
//         return sourcePortGroup === "out" && targetPortGroup === "in";
//       },
//     });
//     paperRef.current = paper;

//     paperContainerRef.current.appendChild(paperRef.current.el);

//     // Initialize stencil
//     stencilRef.current = new ui.Stencil({
//       el: stencilContainerRef.current,
//       paper,
//       paper: paper,
//       width: 200,
//       height: 300,
//       cellCursor: "grab",
//     });
//     // stencilRef.current = stencil;

//     // Create stencil elements
//     const generator = new ReactGenerator({
//       position: { x: 10, y: 10 },
//       size: { width: 100, height: 120 },
//       type: "Generator",
//     });

//     const bulb = new ReactBulb({
//       position: { x: 10, y: 150 },
//       size: { width: 80, height: 100 },
//       type: "Bulb",
//     });

//     const wire = new Wire({
//       source: { x: 0, y: 0 },
//       target: { x: 50, y: 50 },
//       type: "Wire",
//     });

//     generator.addTo(graph);

//     const r = new shapes.standard.Rectangle({
//       position: { x: 10, y: 10 },
//       size: { width: 70, height: 40 },
//       attrs: {
//         body: { fill: "#31D0C6", stroke: "#4B4A67", strokeWidth: 8 },
//         label: { text: "rect", fill: "white" },
//       },
//     });

//     const c = new shapes.standard.Ellipse({
//       position: { x: 100, y: 10 },
//       size: { width: 70, height: 40 },
//       attrs: {
//         body: { fill: "#FE854F", strokeWidth: 8, stroke: "#4B4A67" },
//         label: { text: "ellipse", fill: "white" },
//       },
//     });
//     const c2 = new shapes.standard.Ellipse({
//       position: { x: 10, y: 70 },
//       size: { width: 70, height: 40 },
//       attrs: {
//         body: { fill: "#4B4A67", strokeWidth: 8, stroke: "#FE854F" },
//         label: { text: "ellipse", fill: "white" },
//       },
//     });

//     const r2 = new shapes.standard.Rectangle({
//       position: { x: 100, y: 70 },
//       size: { width: 70, height: 40 },
//       attrs: {
//         body: { fill: "#4B4A67", stroke: "#31D0C6", strokeWidth: 8 },
//         label: { text: "rect", fill: "white" },
//       },
//     });

//     const r3 = new shapes.standard.Rectangle({
//       position: { x: 10, y: 130 },
//       size: { width: 70, height: 40 },
//       attrs: {
//         body: { fill: "#31D0C6", stroke: "#4B4A67", strokeWidth: 8 },
//         label: { text: "rect", fill: "white" },
//       },
//     });

//     const c3 = new shapes.standard.Ellipse({
//       position: { x: 100, y: 130 },
//       size: { width: 70, height: 40 },
//       attrs: {
//         body: { fill: "#FE854F", strokeWidth: 8, stroke: "#4B4A67" },
//         label: { text: "ellipse", fill: "white" },
//       },
//     });

//     // stencilRef.current.load([r, c, c2, r2, r3, c3]);
//     // stencil.load([generator, bulb, wire]);

//     // Handle element embedding
//     paper.on("element:embed", (elementView) => {
//       const element = elementView.model;
//       const type = element.get("type").split(".")[1];
//       const container = elementView.$el.find(".react-container")[0];

//       if (!container || rootsRef.current[element.id]) return;

//       const root = createRoot(container);
//       rootsRef.current[element.id] = root;

//       if (type === "Generator") {
//         root.render(
//           <Generator
//             width={60}
//             height={80}
//             initialPower={0}
//             x={0}
//             y={0}
//             onPowerClick={() => console.log("Generator clicked")}
//           />
//         );
//       } else if (type === "Bulb") {
//         root.render(
//           <Bulb
//             width={40}
//             height={40}
//             initialState={false}
//             x={0}
//             y={0}
//             onClick={() => console.log("Bulb clicked")}
//           />
//         );
//       }
//     });

//     // Cleanup on unmount
//     return () => {
//       Object.values(rootsRef.current).forEach((root) => root.unmount());
//       stencilRef.current.remove();
//       paper.remove();
//     };
//   }, []);

//   return (
//     <div style={{ display: "flex" }}>
//       <div
//         ref={stencilContainerRef}
//         style={{
//           width: "200px",
//           height: "400px",
//           border: "1px solid #000",
//           background: "#FFFFFF",
//         }}
//       />
//       <div
//         ref={paperContainerRef}
//         style={{ width: "600px", height: "400px", border: "1px solid #000" }}
//       />
//     </div>
//   );
// };

// export default App;

import React, { useEffect, useRef, useState } from "react";
import { dia, ui, shapes, util } from "@joint/plus";

// Generator Component
const Generator = ({
  width = 60,
  height = 80,
  initialPower = 0,
  x = 0,
  y = 0,
  onPowerClick,
}) => {
  const generatorRef = useRef(null);
  const [power, setPower] = useState(initialPower);
  const [isAnimating, setIsAnimating] = useState(false);

  const a = 10;
  const b = 5;
  const r = 15;

  const generatorPath = `
    M ${a} ${a} L ${b} ${r} L -${b} ${r} L -${a} ${a} L -${r} ${b} L -${r} -${b}
    L -${a} -${a} L -${b} -${r} L ${b} -${r} L ${a} -${a} L ${r} -${b} L ${r} ${b} Z
  `;

  useEffect(() => {
    const generatorEl = generatorRef.current;
    if (!generatorEl) return;

    let animation = null;
    if (power > 0) {
      const keyframes = [
        { transform: "rotate(0deg)" },
        { transform: "rotate(360deg)" },
      ];

      animation = generatorEl.animate(keyframes, {
        fill: "forwards",
        duration: 1000,
        iterations: Infinity,
        playbackRate: power,
      });
      setIsAnimating(true);
    } else {
      generatorEl.style.transform = "none";
      setIsAnimating(false);
    }

    return () => {
      if (animation) {
        animation.cancel();
      }
    };
  }, [power]);

  const togglePower = () => {
    const newPower = power === 0 ? 1 : 0;
    setPower(newPower);
    if (onPowerClick) onPowerClick(newPower);
  };

  const groupTransform = `translate(${width / 2}, ${height / 2})`;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={height}
        fill="#945042"
        stroke="#7f4439"
        strokeWidth={2}
        rx={5}
        ry={5}
      />
      <g
        transform={groupTransform}
        onClick={onPowerClick}
        style={{ cursor: "pointer" }}
      >
        <circle r={24} fill="#350100" stroke="#a95b4c" strokeWidth={2} />
        <path
          ref={generatorRef}
          d={generatorPath}
          stroke="#a95b4c"
          strokeWidth={2}
          fill="#c99287"
        />
      </g>
      <text
        x={width / 2}
        y={height + 10}
        textAnchor="middle"
        fontSize={14}
        fontFamily="sans-serif"
        fill="#350100"
      >
        Generator
      </text>
      <g
        transform={`translate(${width - 20}, ${height + 20})`}
        onClick={togglePower}
        style={{ cursor: "pointer" }}
      >
        <rect
          width={16}
          height={16}
          rx={3}
          fill={power > 0 ? "#4CAF50" : "#F44336"}
          stroke="#350100"
          strokeWidth={1}
        />
        <text
          x={8}
          y={12}
          textAnchor="middle"
          fontSize={10}
          fontFamily="sans-serif"
          fill="#FFFFFF"
        >
          {power > 0 ? "ON" : "OFF"}
        </text>
      </g>
    </g>
  );
};

// Bulb Component
const Bulb = ({
  width = 50,
  height = 70,
  isOn = false,
  x = 0,
  y = 0,
  onToggle,
}) => {
  const [glowing, setGlowing] = useState(isOn);

  const toggleBulb = () => {
    const newState = !glowing;
    setGlowing(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={toggleBulb}
      style={{ cursor: "pointer" }}
    >
      <defs>
        <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Bulb base */}
      <rect
        x={width / 2 - 8}
        y={height - 15}
        width={16}
        height={15}
        fill="#666"
        stroke="#333"
        strokeWidth={1}
        rx={2}
      />

      {/* Bulb glass */}
      <circle
        cx={width / 2}
        cy={height / 2 - 5}
        r={18}
        fill={glowing ? "#fff3a0" : "#e0e0e0"}
        stroke="#999"
        strokeWidth={2}
        filter={glowing ? "url(#bulbGlow)" : "none"}
      />

      {/* Filament */}
      <path
        d={`M ${width / 2 - 8} ${height / 2 - 8} Q ${width / 2} ${
          height / 2 - 2
        } ${width / 2 + 8} ${height / 2 - 8}`}
        stroke={glowing ? "#ff6b35" : "#666"}
        strokeWidth={2}
        fill="none"
      />
      <path
        d={`M ${width / 2 - 8} ${height / 2 + 2} Q ${width / 2} ${
          height / 2 - 4
        } ${width / 2 + 8} ${height / 2 + 2}`}
        stroke={glowing ? "#ff6b35" : "#666"}
        strokeWidth={2}
        fill="none"
      />

      {/* Glow effect */}
      {glowing && (
        <circle
          cx={width / 2}
          cy={height / 2 - 5}
          r={25}
          fill="none"
          stroke="#fff3a0"
          strokeWidth={3}
          opacity={0.6}
        />
      )}

      <text
        x={width / 2}
        y={height + 10}
        textAnchor="middle"
        fontSize={12}
        fontFamily="sans-serif"
        fill="#333"
      >
        Bulb
      </text>
    </g>
  );
};

// Wire Component
const Wire = ({
  startX = 0,
  startY = 0,
  endX = 100,
  endY = 0,
  isActive = false,
  color = "#333",
}) => {
  const wireColor = isActive ? "#ff6b35" : color;
  const wireWidth = isActive ? 3 : 2;

  return (
    <g>
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={wireColor}
        strokeWidth={wireWidth}
        strokeLinecap="round"
      />
      {isActive && (
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#fff3a0"
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.7}
        />
      )}
    </g>
  );
};

// Main JointJS+ Application Component
const JointJSElectricalApp = () => {
  const paperRef = useRef(null);
  const stencilRef = useRef(null);
  const graphRef = useRef(null);
  const paperInstanceRef = useRef(null);
  const stencilInstanceRef = useRef(null);
  const paperContainerRef = useRef(null);
  const stencilContainerRef = useRef < HTMLDivElement > null;

  useEffect(() => {
    // Initialize JointJS+ graph and paper
    const graph = new dia.Graph();
    graphRef.current = graph;

    const paper = new dia.Paper({
      el: paperRef.current,
      model: graph,
      width: "100%",
      height: "100%",
      gridSize: 1,
      //   async: true,
      clickThreshold: 10,
      sorting: dia.Paper.sorting.APPROX,
      background: { color: "#dde6ed" },
      defaultConnectionPoint: { name: "boundary", args: { selector: false } },
      defaultLink: () => new Wire(),
      linkPinning: false,
      highlighting: {
        connecting: {
          name: "mask",
          options: { attrs: { stroke: "#0075f2", "stroke-width": 2 } },
        },
      },
    });

    paperInstanceRef.current = paper;

    // Function to convert React component to SVG string
    const componentToSVG = (Component, props = {}) => {
      const container = document.createElement("div");
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", props.width || 100);
      svg.setAttribute("height", props.height || 100);

      // Create a temporary React root to render the component
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = `<svg width="${props.width || 100}" height="${
        props.height || 100
      }" xmlns="http://www.w3.org/2000/svg"></svg>`;

      return tempDiv.innerHTML;
    };

    // Create custom JointJS+ shapes using React components
    if (!shapes.electrical) {
      shapes.electrical = {};
    }

    // Generator Shape using React Component
    shapes.electrical.Generator = dia.Element.extend({
      markup: util.svg/* xml */ `
        <foreignObject @selector="component-container" width="100" height="120">
          <div @selector="react-component" xmlns="http://www.w3.org/1999/xhtml"></div>
        </foreignObject>
        <circle @selector="out-port" />
      `,

      defaults: util.defaultsDeep(
        {
          type: "electrical.Generator",
          size: { width: 80, height: 120 },
          attrs: {
            "component-container": {
              width: "calc(w)",
              height: "calc(h)",
              x: 0,
              y: 0,
            },
            "react-component": {
              style: {
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            },
            "out-port": {
              cx: "calc(w)",
              cy: "calc(0.5 * h)",
              r: 6,
              fill: "#ff6b35",
              stroke: "#333",
              strokeWidth: 2,
              magnet: true,
            },
          },
          power: 0,
          ports: {
            groups: {
              out: {
                position: "right",
                attrs: {
                  circle: {
                    fill: "#ff6b35",
                    stroke: "#333",
                    r: 6,
                    magnet: true,
                  },
                },
              },
            },
            items: [{ group: "out", id: "out1" }],
          },
        },
        dia.Element.prototype.defaults
      ),

      initialize: function () {
        dia.Element.prototype.initialize.apply(this, arguments);
        this.on("change:position", this.updateComponent, this);
        this.on("change:power", this.updateComponent, this);
      },

      updateComponent: function () {
        // This will be called when we need to update the React component
        const view = this.findView(paper);
        if (view) {
          this.renderReactComponent(view);
        }
      },

      renderReactComponent: function (view) {
        const componentContainer = view.el.querySelector(
          '[joint-selector="react-component"]'
        );
        if (componentContainer && !componentContainer.hasChildNodes()) {
          // Create SVG element for the Generator component
          const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          svg.setAttribute("width", "80");
          svg.setAttribute("height", "100");
          svg.setAttribute("viewBox", "0 0 80 100");

          // Render Generator component as SVG
          const generatorSVG = `
            <g>
              <rect width="60" height="80" fill="#945042" stroke="#7f4439" stroke-width="2" rx="5" ry="5"/>
              <g transform="translate(30, 40)">
                <circle r="24" fill="#350100" stroke="#a95b4c" stroke-width="2"/>
                <path d="M 10 10 L 5 15 L -5 15 L -10 10 L -15 5 L -15 -5 L -10 -10 L -5 -15 L 5 -15 L 10 -10 L 15 -5 L 15 5 Z" stroke="#a95b4c" stroke-width="2" fill="#c99287"/>
              </g>
              <text x="30" y="95" text-anchor="middle" font-size="12" font-family="sans-serif" fill="#350100">Generator</text>
              <rect x="44" y="85" width="16" height="16" rx="3" fill="#F44336" stroke="#350100" stroke-width="1"/>
              <text x="52" y="97" text-anchor="middle" font-size="8" font-family="sans-serif" fill="#FFFFFF">OFF</text>
            </g>
          `;

          svg.innerHTML = generatorSVG;
          componentContainer.appendChild(svg);
        }
      },
    });

    // Bulb Shape using React Component
    shapes.electrical.Bulb = dia.Element.extend({
      markup: util.svg/* xml */ `
        <foreignObject @selector="component-container" width="80" height="100">
          <div @selector="react-component" xmlns="http://www.w3.org/1999/xhtml"></div>
        </foreignObject>
        <circle @selector="in-port" />
      `,

      defaults: util.defaultsDeep(
        {
          type: "electrical.Bulb",
          size: { width: 60, height: 100 },
          attrs: {
            "component-container": {
              width: "calc(w)",
              height: "calc(h)",
              x: 0,
              y: 0,
            },
            "react-component": {
              style: {
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            },
            "in-port": {
              cx: 0,
              cy: "calc(0.5 * h)",
              r: 6,
              fill: "#333",
              stroke: "#666",
              strokeWidth: 2,
              magnet: true,
            },
          },
          isOn: false,
          ports: {
            groups: {
              in: {
                position: "left",
                attrs: {
                  circle: {
                    fill: "#333",
                    stroke: "#666",
                    r: 6,
                    magnet: true,
                  },
                },
              },
            },
            items: [{ group: "in", id: "in1" }],
          },
        },
        dia.Element.prototype.defaults
      ),

      initialize: function () {
        dia.Element.prototype.initialize.apply(this, arguments);
        this.on("change:position", this.updateComponent, this);
        this.on("change:isOn", this.updateComponent, this);
      },

      updateComponent: function () {
        const view = this.findView(paper);
        if (view) {
          this.renderReactComponent(view);
        }
      },

      renderReactComponent: function (view) {
        const componentContainer = view.el.querySelector(
          '[joint-selector="react-component"]'
        );
        if (componentContainer && !componentContainer.hasChildNodes()) {
          const isOn = this.get("isOn");

          // Create SVG element for the Bulb component
          const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          svg.setAttribute("width", "50");
          svg.setAttribute("height", "70");
          svg.setAttribute("viewBox", "0 0 50 70");

          // Render Bulb component as SVG
          const bulbSVG = `
            <g>
              <defs>
                <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <rect x="17" y="55" width="16" height="15" fill="#666" stroke="#333" stroke-width="1" rx="2"/>
              <circle cx="25" cy="30" r="18" fill="${
                isOn ? "#fff3a0" : "#e0e0e0"
              }" stroke="#999" stroke-width="2" ${
            isOn ? 'filter="url(#bulbGlow)"' : ""
          }/>
              <path d="M 17 22 Q 25 28 33 22" stroke="${
                isOn ? "#ff6b35" : "#666"
              }" stroke-width="2" fill="none"/>
              <path d="M 17 37 Q 25 31 33 37" stroke="${
                isOn ? "#ff6b35" : "#666"
              }" stroke-width="2" fill="none"/>
              ${
                isOn
                  ? '<circle cx="25" cy="30" r="25" fill="none" stroke="#fff3a0" stroke-width="3" opacity="0.6"/>'
                  : ""
              }
              <text x="25" y="85" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#333">Bulb</text>
            </g>
          `;

          svg.innerHTML = bulbSVG;
          componentContainer.appendChild(svg);
        }
      },
    });

    // Create stencil with JointJS+ UI
    const stencil = new ui.Stencil({
      paper: paper,
      snaplines: true,
      scaleClones: true,
      width: 240,
      height: 600,
      dropAnimation: true,
      search: {
        "*": ["type", "attrs/label/text"],
      },
      layout: {
        columns: 1,
        marginX: 10,
        marginY: 10,
        columnGap: 10,
        rowGap: 10,
      },
      paperOptions: function () {
        return {
          model: new dia.Graph(),
          interactive: false,
          background: { color: "#f8f9fa" },
        };
      },
    });

    paperContainerRef.current.appendChild(paperRef.current);
    if (stencilRef.current) {
      stencilRef.current.appendChild(stencil.el);
    }
    stencilInstanceRef.current = stencil;

    // Create stencil elements
    const generator = new shapes.electrical.Generator({
      position: { x: 10, y: 10 },
      size: { width: 80, height: 100 },
    });

    const bulb = new shapes.electrical.Bulb({
      position: { x: 10, y: 10 },
      size: { width: 60, height: 80 },
    });

    // Standard link for wires
    const wire = new shapes.standard.Link({
      attrs: {
        line: {
          stroke: "#333",
          strokeWidth: 3,
          strokeLinecap: "round",
        },
      },
    });

    // Load elements into stencil - using array format instead of group object
    // stencil.load([generator, bulb, wire]);

    // Handle element interactions
    paper.on("element:pointerclick", function (elementView, evt, x, y) {
      const element = elementView.model;

      if (element.get("type") === "electrical.Generator") {
        const currentPower = element.get("power") || 0;
        const newPower = currentPower === 0 ? 1 : 0;
        element.set("power", newPower);

        // Update the visual representation
        const componentContainer = elementView.el.querySelector(
          '[joint-selector="react-component"]'
        );
        if (componentContainer) {
          componentContainer.innerHTML = "";
          element.renderReactComponent(elementView);
        }

        // Update port color based on power state
        if (newPower > 0) {
          element.attr("out-port/fill", "#4CAF50");
        } else {
          element.attr("out-port/fill", "#ff6b35");
        }
      }

      if (element.get("type") === "electrical.Bulb") {
        const currentState = element.get("isOn") || false;
        const newState = !currentState;
        element.set("isOn", newState);

        // Update the visual representation
        const componentContainer = elementView.el.querySelector(
          '[joint-selector="react-component"]'
        );
        if (componentContainer) {
          componentContainer.innerHTML = "";
          element.renderReactComponent(elementView);
        }

        // Update port color based on state
        if (newState) {
          element.attr("in-port/fill", "#4CAF50");
        } else {
          element.attr("in-port/fill", "#333");
        }
      }
    });

    // Handle element addition to render React components
    graph.on("add", function (element) {
      if (
        element.get("type") === "electrical.Generator" ||
        element.get("type") === "electrical.Bulb"
      ) {
        // Delay to ensure the view is rendered
        setTimeout(() => {
          const view = element.findView(paper);
          if (view) {
            element.renderReactComponent(view);
          }
        }, 100);
      }
    });

    // Handle link connections
    paper.on("link:connect", function (linkView) {
      const link = linkView.model;
      link.attr("line/stroke", "#ff6b35");
      link.attr("line/strokeWidth", 4);
      link.set("isActive", true);
    });

    // Add CSS animation for generator rotation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (stencilInstanceRef.current) {
        stencilInstanceRef.current.remove();
      }
      if (paperInstanceRef.current) {
        paperInstanceRef.current.remove();
      }
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 p-4 gap-4">
      {/* Stencil Container */}
      <div className="w-64 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4 font-bold text-center">
          Component Library
        </div>
        <div ref={stencilRef} className="h-full overflow-auto" />
      </div>

      {/* Paper Container */}
      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-800 text-white p-4 font-bold">
          Electrical Circuit Designer
        </div>
        <div
          ref={paperContainerRef}
          className="w-full h-full"
          style={{ height: "calc(100% - 60px)" }}
        />
      </div>

      {/* Instructions Panel */}
      <div className="w-64 bg-white rounded-lg shadow-lg p-4">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Instructions</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="p-3 bg-blue-50 rounded">
            <strong>Drag & Drop:</strong> Drag components from the library to
            the canvas
          </div>
          <div className="p-3 bg-green-50 rounded">
            <strong>Generator:</strong> Click to toggle power on/off
          </div>
          <div className="p-3 bg-yellow-50 rounded">
            <strong>Bulb:</strong> Click to toggle light on/off
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <strong>Wires:</strong> Drag from connection ports to create
            circuits
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <strong>Connections:</strong> Connect generator output to bulb input
          </div>
        </div>
      </div>
    </div>
  );
};

export default JointJSElectricalApp;
