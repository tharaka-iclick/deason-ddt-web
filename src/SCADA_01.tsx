// import React, { useEffect, useRef, useState } from "react";
// import {
//   dia,
//   ui,
//   shapes,
//   util,
//   layout,
//   highlighters,
//   elementTools,
//   format,
// } from "@joint/plus";
// import "./App.scss";

// const FLOW_FLAG = "FLOW";
// const LIQUID_COLOR = "#0EAD69";
// // Define StencilGroup constants
// const StencilGroup = {
//   Equipment: "equipment",
//   Sensors: "sensors",
//   Pipes: "pipes",
//   SymbolShapes: "symbol-shapes",
// } as const;

// type StencilGroupType = (typeof StencilGroup)[keyof typeof StencilGroup];

// // Interface for SCADA shape configuration
// interface ScadaShape {
//   uniqueKey: string;
//   type: string;
//   size: { width: number; height: number };
//   attrs: {
//     body?: { [key: string]: any };
//     label?: { [key: string]: any };
//     state?: { [key: string]: any };
//     root?: { [key: string]: any };
//     liquid?: { [key: string]: any };
//   };
//   keywords: string[];
//   ports?: Array<{
//     id: string;
//     group: string;
//     attrs: { portBody: { magnet: boolean; fill: string } };
//   }>;
//   portMarkup?: Array<{ tagName: string; selector: string }>;
//   portGroups?: {
//     [key: string]: {
//       position: { name: string };
//       attrs: { portBody: { magnet: boolean; r: number; fill: string } };
//     };
//   };
// }

// // Custom Pipe Element
// class PipeElement extends dia.Element {
//   defaults(): dia.Element.Attributes {
//     return {
//       ...super.defaults,
//       type: "PipeElement",
//       size: { width: 100, height: 20 },
//       attrs: {
//         root: {},
//         body: {
//           fill: "#808080",
//           stroke: "#000000",
//           strokeWidth: 2,
//           width: "calc(w)",
//           height: "calc(h)",
//           rx: 10,
//           ry: 10,
//         },
//         flow: {
//           fill: "#4169E1",
//           stroke: "none",
//           width: 0,
//           height: "calc(h - 4)",
//           x: 2,
//           y: 2,
//           rx: 8,
//           ry: 8,
//           opacity: 0.7,
//         },
//         label: {
//           text: "Pipe",
//           fill: "#FFFFFF",
//           fontSize: 10,
//           fontFamily: "sans-serif",
//           textVerticalAnchor: "middle",
//           textAnchor: "middle",
//           x: "calc(w/2)",
//           y: "calc(h/2)",
//         },
//       },
//     };
//   }

//   preinitialize() {
//     this.markup = [
//       { tagName: "rect", selector: "body" },
//       { tagName: "rect", selector: "flow" },
//       { tagName: "text", selector: "label" },
//     ];
//   }
// }

// // Custom Animated Pipe Link
// class AnimatedPipeLink extends shapes.standard.Link {
//   defaults(): dia.Link.Attributes {
//     return {
//       ...super.defaults,
//       type: "Pipe",
//       z: -1,
//       router: { name: "rightAngle" },
//       flow: 1,
//       attrs: {
//         liquid: {
//           connection: true,
//           stroke: "#0EAD69",
//           strokeWidth: 10,
//           strokeLinejoin: "round",
//           strokeLinecap: "square",
//           strokeDasharray: "10,20",
//         },
//         line: {
//           connection: true,
//           stroke: "#eee",
//           strokeWidth: 10,
//           strokeLinejoin: "round",
//           strokeLinecap: "round",
//         },
//         outline: {
//           connection: true,
//           stroke: "#444",
//           strokeWidth: 16,
//           strokeLinejoin: "round",
//           strokeLinecap: "round",
//         },
//       },
//     };
//   }

//   preinitialize() {
//     this.markup = util.svg/* xml */ `
//             <path @selector="outline" fill="none"/>
//             <path @selector="line" fill="none"/>
//             <path @selector="liquid" fill="none"/>
//         `;
//   }
// }

// // const PumpView = dia.ElementView.extend({
// //   presentationAttributes: dia.ElementView.addPresentationAttributes({
// //     power: [POWER_FLAG],
// //   }),

// //   initFlag: [dia.ElementView.Flags.RENDER, POWER_FLAG],

// //   powerAnimation: null,

// //   confirmUpdate(...args: [number, any]): number {
// //     let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
// //     if (this.hasFlag(flags, POWER_FLAG)) {
// //       this.togglePower();
// //       flags = this.removeFlag(flags, POWER_FLAG);
// //     }
// //     return flags;
// //   },

// //   getSpinAnimation() {
// //     let { spinAnimation } = this;
// //     if (spinAnimation) return spinAnimation;
// //     const [rotorEl] = this.findBySelector("rotor");
// //     // It's important to use start and end frames to make it work in Safari.
// //     const keyframes = { transform: ["rotate(0deg)", "rotate(360deg)"] };
// //     spinAnimation = rotorEl.animate(keyframes, {
// //       fill: "forwards",
// //       duration: 1000,
// //       iterations: Infinity,
// //     });
// //     this.spinAnimation = spinAnimation;
// //     return spinAnimation;
// //   },

// //   togglePower() {
// //     const { model } = this;
// //     this.getSpinAnimation().playbackRate = model.power;
// //   },
// // });

// const PipeView = dia.LinkView.extend({
//   presentationAttributes: {
//     ...dia.LinkView.prototype.presentationAttributes,
//     flow: [FLOW_FLAG],
//   },
//   initFlag: [dia.ElementView.Flags.RENDER, FLOW_FLAG],

//   flowAnimation: null,

//   confirmUpdate(...args: [number, any]): number {
//     let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
//     if (this.hasFlag(flags, FLOW_FLAG)) {
//       this.updateFlow();
//       flags = this.removeFlag(flags, FLOW_FLAG);
//     }
//     return flags;
//   },

//   getFlowAnimation() {
//     if (this.flowAnimation) return this.flowAnimation;

//     const [liquidEl] = this.findBySelector("liquid");
//     if (!liquidEl || !liquidEl.animate) {
//       console.warn("Animation not supported or element not found");
//       return null;
//     }

//     const keyframes = [{ strokeDashoffset: "90" }, { strokeDashoffset: "0" }];

//     const options = {
//       duration: 1000,
//       iterations: Infinity,
//       fill: "forwards",
//     };

//     this.flowAnimation = liquidEl.animate(keyframes, options);
//     return this.flowAnimation;
//   },

//   updateFlow() {
//     const { model } = this;
//     const flowRate = model.get("flow") || 0;
//     // this.getFlowAnimation().playbackRate = flowRate;
//     const animation = this.getFlowAnimation();
//     if (animation) {
//       try {
//         animation.playbackRate = flowRate;
//         // Ensure animation is playing (in case it was paused)
//         if (flowRate > 0) {
//           animation.play();
//         } else {
//           animation.pause();
//         }
//       } catch (error) {
//         console.warn("Failed to update animation:", error);
//       }
//     }
//     const [liquidEl] = this.findBySelector("liquid");
//     if (!animation) {
//       liquidEl.style.strokeDashoffset = flowRate === 0 ? "90" : "0";
//     }
//   },
// });

// // Placeholder class
// class Placeholder extends dia.Element {
//   defaults(): dia.Element.Attributes {
//     return {
//       ...super.defaults,
//       type: "Placeholder",
//       position: { x: 10, y: 10 },
//       attrs: {
//         root: {},
//         body: {
//           class: "jjPlaceholderBody",
//           fill: "transparent",
//           x: 0,
//           y: 0,
//           width: "calc(w)",
//           height: "calc(h)",
//         },
//         label: {
//           class: "jjPlaceholderLabel",
//           fontSize: 14,
//           fontFamily: "sans-serif",
//           textVerticalAnchor: "middle",
//           textAnchor: "middle",
//           x: "calc(w/2)",
//           y: "calc(h/2)",
//         },
//       },
//     };
//   }

//   static isPlaceholder(element: dia.Element): boolean {
//     return element.get("type") === "Placeholder";
//   }

//   preinitialize() {
//     this.markup = [
//       { tagName: "rect", selector: "body" },
//       { tagName: "text", selector: "label" },
//     ];
//   }
// }

// // Placeholder instances
// const equipmentPlaceholder = new Placeholder({
//   size: { width: 200, height: 80 },
//   attrs: {
//     body: { strokeWidth: 2, strokeDasharray: "5,5", stroke: "#87A7C0" },
//     label: { text: "Drop equipment here.", fill: "#87A7C0" },
//   },
// });

// const sensorsPlaceholder = new Placeholder({
//   size: { width: 200, height: 80 },
//   attrs: {
//     body: { strokeWidth: 2, strokeDasharray: "5,5", stroke: "#87A7C0" },
//     label: { text: "Drop sensors here.", fill: "#87A7C0" },
//   },
// });

// const pipesPlaceholder = new Placeholder({
//   size: { width: 200, height: 80 },
//   attrs: {
//     body: { strokeWidth: 2, strokeDasharray: "5,5", stroke: "#87A7C0" },
//     label: { text: "Drop pipes here.", fill: "#87A7C0" },
//   },
// });

// // Enhanced SCADA shapes with SVG paths
// const shapesJSON: ScadaShape[] = [
//   {
//     uniqueKey: "tank",
//     type: "standard.Path",
//     size: { width: 80, height: 100 },
//     attrs: {
//       body: {
//         d: "M 5 20 L 75 20 L 75 95 L 5 95 Z M 10 5 L 70 5 L 70 25 L 10 25 Z",
//         fill: "#A9A9A9",
//         stroke: "#000000",
//         strokeWidth: 2,
//       },
//       label: {
//         text: "Tank",
//         fill: "#000000",
//         fontSize: 12,
//         textAnchor: "middle",
//         textVerticalAnchor: "middle",
//         x: "calc(w/2)",
//         y: "calc(h/2)",
//       },
//       state: { level: 50, capacity: 1000 },
//       liquid: {
//         // We use path instead of rect to make it possible to animate
//         // the stroke-dasharray to show the liquid flow.
//         d: "M calc(w / 2 + 12) calc(h / 2) h -24",
//         stroke: LIQUID_COLOR,
//         strokeWidth: 24,
//         strokeDasharray: "3,1",
//       },
//     },
//     keywords: ["tank", "storage", "vessel"],
//     ports: [
//       {
//         id: "in",
//         group: "in",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//       {
//         id: "out",
//         group: "out",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//     ],
//   },
//   {
//     uniqueKey: "pump",
//     type: "standard.Path",
//     size: { width: 60, height: 60 },
//     attrs: {
//       body: {
//         d: "M 30 5 A 25 25 0 1 1 30 55 A 25 25 0 1 1 30 5 M 20 20 L 40 30 L 20 40 Z",
//         fill: "#4682B4",
//         stroke: "#000000",
//         strokeWidth: 2,
//       },
//       label: {
//         text: "Pump",
//         fill: "#FFFFFF",
//         fontSize: 10,
//         textAnchor: "middle",
//         textVerticalAnchor: "middle",
//         x: "calc(w/2)",
//         y: "calc(h + 15)",
//       },
//       state: { running: false, speed: 0, flow: 0 },
//     },
//     keywords: ["pump", "motor", "circulation"],
//     ports: [
//       {
//         id: "in",
//         group: "in",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//       {
//         id: "out",
//         group: "out",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//     ],
//   },
//   {
//     uniqueKey: "valve",
//     type: "standard.Path",
//     size: { width: 50, height: 50 },
//     attrs: {
//       body: {
//         d: "M 25 5 L 45 25 L 25 45 L 5 25 Z M 15 15 L 35 35 M 15 35 L 35 15",
//         fill: "#FF4500",
//         stroke: "#000000",
//         strokeWidth: 2,
//       },
//       label: {
//         text: "Valve (closed)",
//         fill: "#000000",
//         fontSize: 10,
//         textAnchor: "middle",
//         textVerticalAnchor: "middle",
//         x: "calc(w/2)",
//         y: "calc(h + 15)",
//       },
//       state: { status: "closed", position: 0 },
//     },
//     keywords: ["valve", "control", "flow"],
//     ports: [
//       {
//         id: "in",
//         group: "in",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//       {
//         id: "out",
//         group: "out",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//     ],
//   },
//   {
//     uniqueKey: "sensor",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: "M 5 20 A 25 15 0 1 1 55 20 A 25 15 0 1 1 5 20 M 25 10 L 35 10 M 30 5 L 30 15",
//         fill: "#FFD700",
//         stroke: "#000000",
//         strokeWidth: 2,
//       },
//       label: {
//         text: "Sensor (0)",
//         fill: "#000000",
//         fontSize: 10,
//         textAnchor: "middle",
//         textVerticalAnchor: "middle",
//         x: "calc(w/2)",
//         y: "calc(h/2)",
//       },
//       state: { value: 0, unit: "bar", alarm: false },
//     },
//     keywords: ["sensor", "monitor", "measurement"],
//     ports: [
//       {
//         id: "out",
//         group: "out",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//     ],
//   },
//   // Pipe components
//   {
//     uniqueKey: "straight_pipe",
//     type: "AnimatedPipeLink",
//     size: { width: 100, height: 20 },
//     attrs: {
//       body: { fill: "#808080", stroke: "#000000", strokeWidth: 2 },
//       label: { text: "Straight Pipe" },
//       state: { flow: 0, pressure: 0, material: "steel" },
//     },
//     keywords: ["pipe", "straight", "conduit"],
//     ports: [
//       {
//         id: "in",
//         group: "in",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//       {
//         id: "out",
//         group: "out",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//     ],
//   },
//   {
//     uniqueKey: "elbow_pipe",
//     type: "standard.Path",
//     size: { width: 60, height: 60 },
//     attrs: {
//       body: {
//         d: "M 10 50 L 10 30 A 20 20 0 0 1 30 10 L 50 10 L 50 20 L 30 20 A 10 10 0 0 0 20 30 L 20 50 Z",
//         fill: "#808080",
//         stroke: "#000000",
//         strokeWidth: 2,
//       },
//       label: {
//         text: "Elbow",
//         fill: "#FFFFFF",
//         fontSize: 10,
//         textAnchor: "middle",
//         textVerticalAnchor: "middle",
//         x: "calc(w/2)",
//         y: "calc(h + 15)",
//       },
//       state: { flow: 0, angle: 90 },
//     },
//     keywords: ["pipe", "elbow", "bend", "90"],
//     ports: [
//       {
//         id: "in",
//         group: "in",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//       {
//         id: "out",
//         group: "out",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//     ],
//   },
//   {
//     uniqueKey: "tee_pipe",
//     type: "standard.Path",
//     size: { width: 60, height: 60 },
//     attrs: {
//       body: {
//         d: "M 20 10 L 40 10 L 40 20 L 35 20 L 35 40 L 45 40 L 45 50 L 15 50 L 15 40 L 25 40 L 25 20 L 20 20 Z",
//         fill: "#808080",
//         stroke: "#000000",
//         strokeWidth: 2,
//       },
//       label: {
//         text: "Tee",
//         fill: "#FFFFFF",
//         fontSize: 10,
//         textAnchor: "middle",
//         textVerticalAnchor: "middle",
//         x: "calc(w/2)",
//         y: "calc(h + 15)",
//       },
//       state: { flow_in: 0, flow_out1: 0, flow_out2: 0 },
//     },
//     keywords: ["pipe", "tee", "junction", "split"],
//     ports: [
//       {
//         id: "in",
//         group: "in",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//       {
//         id: "out1",
//         group: "out",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//       {
//         id: "out2",
//         group: "out",
//         attrs: { portBody: { magnet: true, fill: "#000000" } },
//       },
//     ],
//   },
// ];

// const portGroups = {
//   in: {
//     position: { name: "left" },
//     attrs: { portBody: { magnet: true, r: 6, fill: "#000000" } },
//   },
//   out: {
//     position: { name: "right" },
//     attrs: { portBody: { magnet: true, r: 6, fill: "#000000" } },
//   },
// };

// // Configure shapes
// shapesJSON.forEach((shape) => {
//   shape.ports = shape.ports || [];
//   shape.portMarkup = [{ tagName: "circle", selector: "portBody" }];
//   shape.portGroups = portGroups;
//   util.setByPath(shape, ["attrs", "root", "title"], String(shape.keywords));
//   util.setByPath(shape, ["attrs", "root", "magnetSelector"], "body");
//   util.setByPath(shape, ["attrs", "root", "highlighterSelector"], "body");
// });

// const shapesJSONMap: { [key: string]: ScadaShape } = {};
// shapesJSON.forEach((shapeJSON, index) => {
//   shapeJSON.uniqueKey = shapeJSON.uniqueKey || `scada_${index + 1}`;
//   shapesJSONMap[shapeJSON.uniqueKey] = shapeJSON;
// });

// const SCADA_01: React.FC = () => {
//   const paperContainerRef = useRef<HTMLDivElement>(null);
//   const stencilContainerRef = useRef<HTMLDivElement>(null);
//   const toolbarContainerRef = useRef<HTMLDivElement>(null);
//   const graphRef = useRef<dia.Graph | null>(null);
//   const paperRef = useRef<dia.Paper | null>(null);
//   const stencilRef = useRef<ui.Stencil | null>(null);
//   const placeholderPaperRef = useRef<dia.Paper | null>(null);
//   const placeholderGraphRef = useRef<dia.Graph | null>(null);
//   const toolbarRef = useRef<ui.Toolbar | null>(null);
//   const animationRef = useRef<number | null>(null);

//   const [isSimulationRunning, setIsSimulationRunning] = useState(false);

//   // Real-time simulation
//   const startSimulation = () => {
//     if (!graphRef.current) return;

//     setIsSimulationRunning(true);
//     let animationOffset = 0;

//     const animate = () => {
//       if (!graphRef.current) return;

//       animationOffset += 2;

//       // Animate pipe links
//       graphRef.current.getLinks().forEach((link) => {
//         if (link instanceof AnimatedPipeLink) {
//           link.attr("line/strokeDashoffset", -animationOffset);
//         }
//       });

//       // Update sensor values
//       graphRef.current.getElements().forEach((element) => {
//         const uniqueKey = element.get("uniqueKey");

//         if (uniqueKey === "sensor") {
//           const currentValue = element.attr("state/value") || 0;
//           const newValue = Math.sin(Date.now() / 1000) * 50 + 50;
//           element.attr("state/value", Math.round(newValue * 100) / 100);
//           element.attr(
//             "label/text",
//             `Sensor (${Math.round(newValue * 100) / 100})`
//           );

//           // Change color based on value
//           const color =
//             newValue > 75 ? "#FF0000" : newValue > 50 ? "#FFA500" : "#00FF00";
//           element.attr("body/fill", color);
//         }

//         if (uniqueKey === "pump") {
//           const isRunning = element.attr("state/running");
//           if (isRunning) {
//             // Animate pump rotation
//             const currentRotation = element.attr("body/transform") || "";
//             const newRotation = `rotate(${(animationOffset * 5) % 360} 30 30)`;
//             element.attr("body/transform", newRotation);
//           }
//         }

//         if (
//           uniqueKey === "straight_pipe" &&
//           element instanceof AnimatedPipeLink
//         ) {
//           const flow = Math.abs(Math.sin(Date.now() / 2000)) * 100;
//           const flowWidth = (flow / 100) * (element.size().width - 4);
//           element.attr("flow/width", flowWidth);
//           element.attr("state/flow", Math.round(flow * 100) / 100);
//         }
//       });

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animate();
//   };

//   const stopSimulation = () => {
//     setIsSimulationRunning(false);
//     if (animationRef.current) {
//       cancelAnimationFrame(animationRef.current);
//       animationRef.current = null;
//     }
//   };

//   useEffect(() => {
//     // Register custom elements
//     Object.assign(shapes, { AnimatedPipeLink });

//     graphRef.current = new dia.Graph({}, { cellNamespace: shapes });

//     paperRef.current = new dia.Paper({
//       model: graphRef.current,
//       cellViewNamespace: shapes,
//       width: "100%",
//       height: "100%",
//       gridSize: 10,
//       drawGrid: true,
//       async: true,
//       clickThreshold: 10,
//       sorting: dia.Paper.sorting.APPROX,
//       background: { color: "#f0f0f0" },
//       defaultConnectionPoint: { name: "boundary", args: { selector: false } },
//       defaultLink: () => new AnimatedPipeLink(),
//       linkPinning: false,
//       highlighting: {
//         connecting: {
//           name: "mask",
//           options: { attrs: { stroke: "#0075f2", "stroke-width": 2 } },
//         },
//       },
//       linkView: PipeView,
//     });

//     if (paperContainerRef.current && paperRef.current) {
//       paperContainerRef.current.appendChild(paperRef.current.el);
//     }

//     stencilRef.current = new ui.Stencil({
//       paper: paperRef.current,
//       usePaperGrid: true,
//       width: 250,
//       height: "100%",
//       dropAnimation: true,
//       paperOptions: () => ({
//         model: new dia.Graph({}, { cellNamespace: shapes }),
//         cellViewNamespace: shapes,
//         background: { color: "#FFFFFF" },
//         overflow: true,
//       }),
//       search: (cell: dia.Cell, keyword: string) => {
//         if (keyword === "") return true;
//         if (Placeholder.isPlaceholder(cell as dia.Element)) return true;
//         const keywords = cell.get("keywords") || [];
//         return keywords.some((kw: string) =>
//           kw.toLowerCase().includes(keyword.toLowerCase())
//         );
//       },
//       dragStartClone: (cell: dia.Cell) => {
//         const dragClone = cell.clone() as dia.Element;
//         dragClone.attr(["body", "fill"], "#dde6ed");
//         dragClone.set("group", cell.graph.get("group"));
//         return dragClone;
//       },
//       contentOptions: { useModelGeometry: true },
//       canDrag: (
//         cellView: dia.CellView,
//         _evt: dia.Event,
//         _groupName: string | null
//       ) => {
//         return (
//           cellView instanceof dia.ElementView &&
//           !Placeholder.isPlaceholder(cellView.model as dia.Element)
//         );
//       },
//       layout: (graph: dia.Graph, group: StencilGroupType) => {
//         const groupElements = graph.getElements();
//         const layoutElements = groupElements.filter(
//           (element) => !Placeholder.isPlaceholder(element)
//         );
//         const rowGap = 20;
//         const layoutOptions: any = {
//           columns: 2,
//           rowHeight: "compact",
//           columnWidth: 120,
//           horizontalAlign: "middle",
//           rowGap,
//           marginY: rowGap,
//         };
//         if (groupElements.length !== layoutElements.length) {
//           const { height: placeholderHeight } = equipmentPlaceholder.size();
//           layoutOptions.marginY = placeholderHeight + 2 * rowGap;
//         }
//         layout.GridLayout.layout(layoutElements, layoutOptions);
//       },
//       groups: {
//         [StencilGroup.Equipment]: { index: 1, label: "Equipment" },
//         [StencilGroup.Pipes]: { index: 2, label: "Pipes & Fittings" },
//         [StencilGroup.Sensors]: { index: 3, label: "Sensors" },
//         [StencilGroup.SymbolShapes]: { index: 4, label: "Other Symbols" },
//       },
//     });

//     stencilRef.current.render();
//     if (stencilContainerRef.current && stencilRef.current) {
//       stencilContainerRef.current.appendChild(stencilRef.current.el);
//       const searchInput = stencilRef.current.el.querySelector(
//         ".search"
//       ) as HTMLInputElement | null;
//       if (searchInput) {
//         searchInput.setAttribute("placeholder", "Find SCADA components...");
//       }
//     }

//     toolbarRef.current = new ui.Toolbar({
//       tools: [
//         {
//           type: "button",
//           name: "start-simulation",
//           text: "Start Simulation",
//           attrs: {
//             button: {
//               className: "btn btn-sm btn-success mr-2",
//             },
//           },
//         },
//         {
//           type: "button",
//           name: "stop-simulation",
//           text: "Stop Simulation",
//           attrs: {
//             button: {
//               className: "btn btn-sm btn-danger mr-2",
//             },
//           },
//         },
//         {
//           type: "button",
//           name: "export-json",
//           text: "Export JSON",
//           attrs: {
//             button: {
//               className: "btn btn-sm btn-outline-primary mr-2",
//             },
//           },
//         },
//         {
//           type: "button",
//           name: "export-svg",
//           text: "Export SVG",
//           attrs: {
//             button: {
//               className: "btn btn-sm btn-outline-primary mr-2",
//             },
//           },
//         },
//         "zoomToFit",
//         "zoomSlider",
//       ],
//       references: { paperScroller: paperRef.current },
//     });

//     toolbarRef.current.render();
//     if (toolbarContainerRef.current && toolbarRef.current) {
//       toolbarContainerRef.current.appendChild(toolbarRef.current.el);
//     }

//     // Event handlers
//     const setupEventHandlers = () => {
//       if (!paperRef.current || !toolbarRef.current || !graphRef.current) return;

//       // Element interactions
//       paperRef.current.on(
//         "element:pointerclick",
//         (elementView: dia.ElementView) => {
//           paperRef.current!.removeTools();
//           const element = elementView.model as dia.Element;
//           const uniqueKey = element.get("uniqueKey");

//           // Toggle valve state
//           if (uniqueKey === "valve") {
//             const currentStatus = element.attr("state/status") as string;
//             const newStatus = currentStatus === "open" ? "closed" : "open";
//             element.attr("state/status", newStatus);
//             element.attr("label/text", `Valve (${newStatus})`);
//             element.attr(
//               "body/fill",
//               newStatus === "open" ? "#32CD32" : "#FF4500"
//             );
//           }

//           // Toggle pump state
//           if (uniqueKey === "pump") {
//             const isRunning = element.attr("state/running");
//             element.attr("state/running", !isRunning);
//             element.attr("body/fill", !isRunning ? "#228B22" : "#4682B4");
//           }

//           // Add tools
//           const toolsView = new dia.ToolsView({
//             tools: [
//               new elementTools.Boundary({ useModelGeometry: true }),
//               new elementTools.Connect({
//                 useModelGeometry: true,
//                 x: "calc(w + 10)",
//                 y: "calc(h / 2)",
//               }),
//               new elementTools.Remove({
//                 useModelGeometry: true,
//                 x: -10,
//                 y: -10,
//               }),
//             ],
//           });
//           elementView.addTools(toolsView);
//         }
//       );

//       paperRef.current.on("blank:pointerdown", () => {
//         paperRef.current!.removeTools();
//       });

//       // Toolbar events
//       toolbarRef.current.on("start-simulation:pointerclick", startSimulation);
//       toolbarRef.current.on("stop-simulation:pointerclick", stopSimulation);

//       toolbarRef.current.on("export-json:pointerclick", () => {
//         const graphJSON = graphRef.current!.toJSON();
//         const blob = new Blob([JSON.stringify(graphJSON, null, 2)], {
//           type: "application/json",
//         });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "scada-diagram.json";
//         a.click();
//         URL.revokeObjectURL(url);
//       });

//       toolbarRef.current.on("export-svg:pointerclick", () => {
//         format.toSVG(
//           paperRef.current!,
//           (svg) => {
//             util.downloadDataUri(
//               `data:image/svg+xml,${encodeURIComponent(svg)}`,
//               "scada-diagram.svg"
//             );
//           },
//           { useComputedStyles: false }
//         );
//       });
//     };

//     // Load shapes into stencil
//     stencilRef.current.load({
//       [StencilGroup.Equipment]: shapesJSON.filter((shape) =>
//         ["tank", "pump", "valve"].includes(shape.uniqueKey)
//       ),
//       [StencilGroup.Pipes]: shapesJSON.filter((shape) =>
//         ["straight_pipe", "elbow_pipe", "tee_pipe"].includes(shape.uniqueKey)
//       ),
//       [StencilGroup.Sensors]: shapesJSON.filter((shape) =>
//         ["sensor"].includes(shape.uniqueKey)
//       ),
//       [StencilGroup.SymbolShapes]: shapesJSON,
//     });

//     setupEventHandlers();

//     return () => {
//       stopSimulation();
//       paperRef.current?.remove();
//       stencilRef.current?.remove();
//       toolbarRef.current?.remove();
//     };
//   }, []);

//   return (
//     <div
//       className="diagram-container"
//       style={{ display: "flex", height: "100vh" }}
//     >
//       <div
//         ref={stencilContainerRef}
//         id="stencil-container"
//         style={{
//           width: "250px",
//           borderRight: "1px solid #ccc",
//           backgroundColor: "#f8f9fa",
//         }}
//       />
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <div
//           ref={toolbarContainerRef}
//           id="toolbar"
//           style={{
//             padding: "10px",
//             borderBottom: "1px solid #ccc",
//             backgroundColor: "#fff",
//           }}
//         />
//         <div
//           ref={paperContainerRef}
//           id="paper-container"
//           style={{ flex: 1, position: "relative" }}
//         />
//       </div>
//     </div>
//   );
// };

// export default SCADA_01;

import React, { useEffect, useRef } from "react";
import { dia, shapes, linkTools } from "@joint/core";
// // import "@joint/core/joint.css"; // Optional: include default styling

const FLOW_FLAG = "flow";

const JointPipeEditor: React.FC = () => {
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const namespace = shapes;
    const graph = new dia.Graph({}, { cellNamespace: namespace });

    // Define a custom PipeLink
    const PipeLink = shapes.standard.Link.define("custom.PipeLink", {
      z: -1,
      router: { name: "rightAngle" },
      flow: 1,
      attrs: {
        liquid: {
          connection: true,
          stroke: "#0EAD69",
          strokeWidth: 10,
          strokeLinejoin: "round",
          strokeLinecap: "square",
          strokeDasharray: "10,20",
        },
        line: {
          connection: true,
          stroke: "#eee",
          strokeWidth: 10,
          strokeLinejoin: "round",
          strokeLinecap: "round",
        },
        outline: {
          connection: true,
          stroke: "#444",
          strokeWidth: 16,
          strokeLinejoin: "round",
          strokeLinecap: "round",
        },
      },
      connector: {
        name: "smooth", // smoother appearance
      },
      preinitialize() {
        this.markup = util.svg/* xml */ `
            <path @selector="outline" fill="none"/>
            <path @selector="line" fill="none"/>
            <path @selector="liquid" fill="none"/>
        `;
      },
    });

    const PipeView = dia.LinkView.extend({
      presentationAttributes: dia.LinkView.addPresentationAttributes({
        flow: [FLOW_FLAG],
      }),

      initFlag: [
        ...(dia.LinkView.prototype.initFlag as unknown as any[]),
        FLOW_FLAG,
      ],

      flowAnimation: null,

      //   confirmUpdate(...args: any[]) {
      //     let flags = dia.LinkView.prototype.confirmUpdate.apply(this, args);
      //     if (this.hasFlag(flags, FLOW_FLAG)) {
      //       this.updateFlow();
      //       flags = this.removeFlag(flags, FLOW_FLAG);
      //     }
      //     return flags;
      //   },

      getFlowAnimation() {
        let { flowAnimation } = this;
        if (flowAnimation) return flowAnimation;
        const [liquidEl] = this.findBySelector("liquid");
        const keyframes = { strokeDashoffset: [90, 0] };
        flowAnimation = liquidEl.animate(keyframes, {
          fill: "forwards",
          duration: 1000,
          iterations: Infinity,
        });
        this.flowAnimation = flowAnimation;
        return flowAnimation;
      },

      updateFlow() {
        const { model } = this;
        const flowRate = model.get("flow") || 0;
        this.getFlowAnimation().playbackRate = flowRate;
        const [liquidEl] = this.findBySelector("liquid");
        liquidEl.style.stroke = flowRate === 0 ? "#ccc" : LIQUID_COLOR;
      },
    });
    const paper = new dia.Paper({
      el: paperRef.current!,
      width: 650,
      height: 200,
      gridSize: 1,
      model: graph,
      background: { color: "#F5F5F5" },
      cellViewNamespace: namespace,
      linkPinning: false,
      defaultLink: () => new PipeLink(),
      defaultConnectionPoint: { name: "boundary" },
      validateConnection: (cellViewS, magnetS, cellViewT, magnetT) => {
        return magnetS !== magnetT;
      },
      snapLinks: { radius: 20 },
      viewProviders: {
        "custom.PipeLink": PipeView,
      },
    });

    const portsIn = {
      position: { name: "left" },
      attrs: {
        portBody: {
          magnet: true,
          r: 10,
          fill: "#023047",
          stroke: "#023047",
        },
      },
      label: {
        position: { name: "left", args: { y: 6 } },
        markup: [
          {
            tagName: "text",
            selector: "label",
            className: "label-text",
          },
        ],
      },
      markup: [
        {
          tagName: "circle",
          selector: "portBody",
        },
      ],
    };

    const portsOut = {
      position: { name: "right" },
      attrs: {
        portBody: {
          magnet: true,
          r: 10,
          fill: "#E6A502",
          stroke: "#023047",
        },
      },
      label: {
        position: { name: "right", args: { y: 6 } },
        markup: [
          {
            tagName: "text",
            selector: "label",
            className: "label-text",
          },
        ],
      },
      markup: [
        {
          tagName: "circle",
          selector: "portBody",
        },
      ],
    };

    const model = new shapes.standard.Rectangle({
      position: { x: 125, y: 50 },
      size: { width: 90, height: 90 },
      attrs: {
        root: { magnet: false },
        body: { fill: "#8ECAE6" },
        label: {
          text: "Model",
          fontSize: 16,
          y: -10,
        },
      },
      ports: {
        groups: {
          in: portsIn,
          out: portsOut,
        },
      },
    });

    model.addPorts([
      { group: "in", attrs: { label: { text: "in1" } } },
      { group: "in", attrs: { label: { text: "in2" } } },
      { group: "out", attrs: { label: { text: "out" } } },
    ]);

    const model2 = model
      .clone()
      .translate(300, 0)
      .attr("label/text", "Model 2");

    graph.addCells([model, model2]);

    // Hover interaction for links
    paper.on("link:mouseenter", (linkView) => {
      showLinkTools(linkView);
    });

    paper.on("link:mouseleave", (linkView) => {
      linkView.removeTools();
    });

    // Show remove tool on links
    function showLinkTools(linkView: dia.LinkView) {
      const tools = new dia.ToolsView({
        tools: [
          new linkTools.Remove({
            distance: "50%",
            markup: [
              {
                tagName: "circle",
                selector: "button",
                attributes: {
                  r: 7,
                  fill: "#f6f6f6",
                  stroke: "#ff5148",
                  "stroke-width": 2,
                  cursor: "pointer",
                },
              },
              {
                tagName: "path",
                selector: "icon",
                attributes: {
                  d: "M -3 -3 3 3 M -3 3 3 -3",
                  fill: "none",
                  stroke: "#ff5148",
                  "stroke-width": 2,
                  "pointer-events": "none",
                },
              },
            ],
          }),
        ],
      });
      linkView.addTools(tools);
    }
  }, []);

  return (
    <div id="paper" ref={paperRef} style={{ width: "100%", height: "100%" }} />
  );
};

export default JointPipeEditor;
