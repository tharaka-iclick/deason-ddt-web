// import React, { useEffect, useRef } from "react";
// import { dia, shapes, util, ui } from "@joint/plus";
// // import "./ScadaDiagram.css"; // Assume a CSS file for styling

// // Turbine metrics
// const r = 16;
// const a = 3;
// const b = 4;

// // Custom view flags
// const POWER_FLAG = "POWER";
// const FLOW_FLAG = "FLOW";

// // Generator Element
// class Generator extends dia.Element {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "Generator",
//       size: { width: 60, height: 80 },
//       power: 0,
//       attrs: {
//         root: { magnetSelector: "body" },
//         body: {
//           width: "calc(w)",
//           height: "calc(h)",
//           stroke: "#7f4439",
//           strokeWidth: 2,
//           fill: "#945042",
//           rx: 5,
//           ry: 5,
//         },
//         label: {
//           text: "Generator",
//           textAnchor: "middle",
//           textVerticalAnchor: "top",
//           x: "calc(0.5*w)",
//           y: "calc(h+10)",
//           fontSize: "14",
//           fontFamily: "sans-serif",
//           fill: "#350100",
//         },
//         generatorGroup: {
//           transform: "translate(calc(w/2),calc(h/2))",
//           event: "element:power:click",
//           cursor: "pointer",
//         },
//         generatorBackground: {
//           r: 24,
//           fill: "#350100",
//           stroke: "#a95b4c",
//           strokeWidth: 2,
//         },
//         generator: {
//           d: `M ${a} ${a} ${b} ${r} -${b} ${r} -${a} ${a} -${r} ${b} -${r} -${b} -${a} -${a} -${b} -${r} ${b} -${r} ${a} -${a} ${r} -${b} ${r} ${b} Z`,
//           stroke: "#a95b4c",
//           strokeWidth: 2,
//           fill: "#c99287",
//         },
//       },
//     };
//   }

//   get power() {
//     return Math.round(this.get("power") * 100);
//   }

//   preinitialize() {
//     this.markup = util.svg/* xml */ `
//       <rect @selector="body" />
//       <g @selector="generatorGroup">
//         <circle @selector="generatorBackground" />
//         <path @selector="generator" />
//       </g>
//       <text @selector="label" />
//     `;
//   }
// }

// const GeneratorView = dia.ElementView.extend({
//   presentationAttributes: dia.ElementView.addPresentationAttributes({
//     power: [POWER_FLAG],
//   }),

//   initFlag: [dia.ElementView.Flags.RENDER, POWER_FLAG],

//   powerAnimation: null,

//   confirmUpdate(...args: [number, any]): any {
//     let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
//     if (this.hasFlag(flags, POWER_FLAG)) {
//       this.togglePower();
//       flags = this.removeFlag(flags, POWER_FLAG);
//     }
//     return flags;
//   },

//   getSpinAnimation() {
//     let { spinAnimation } = this;
//     if (spinAnimation) return spinAnimation;
//     const [generatorEl] = this.findBySelector("generator");
//     // It's important to use start and end frames to make it work in Safari.
//     const keyframes = { transform: ["rotate(0deg)", "rotate(360deg)"] };
//     spinAnimation = generatorEl.animate(keyframes, {
//       fill: "forwards",
//       duration: 1000,
//       iterations: Infinity,
//     });
//     this.spinAnimation = spinAnimation;
//     return spinAnimation;
//   },

//   togglePower() {
//     const { model } = this;
//     const playbackRate = model.get("power");
//     this.getSpinAnimation().playbackRate = playbackRate;
//   },
// });

// // Pipe Connector with Flow Animation
// class Pipe extends dia.Link {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "Pipe",
//       z: -1,
//       flow: 0,
//       attrs: {
//         line: {
//           connection: true,
//           stroke: "#346f83",
//           strokeWidth: 4,
//           strokeDasharray: "10,10",
//           strokeDashoffset: 0,
//           strokeLinecap: "round",
//           fill: "none",
//         },
//         outline: {
//           connection: true,
//           stroke: "#004456",
//           strokeWidth: 6,
//           strokeLinejoin: "round",
//           strokeLinecap: "round",
//           fill: "none",
//         },
//       },
//     };
//   }

//   preinitialize() {
//     this.markup = util.svg/* xml */ `
//       <path @selector="outline" fill="none"/>
//       <path @selector="line" fill="none"/>
//     `;
//   }
// }

// const PipeView = dia.LinkView.extend({
//   presentationAttributes: dia.LinkView.addPresentationAttributes({
//     flow: [FLOW_FLAG],
//   }),

//   initFlag: [dia.LinkView.Flags.RENDER, FLOW_FLAG],

//   flowAnimation: null,

//   confirmUpdate(...args: [number, any]): any {
//     let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
//     if (this.hasFlag(flags, POWER_FLAG)) {
//       this.togglePower();
//       flags = this.removeFlag(flags, POWER_FLAG);
//     }
//     return flags;
//   },

//   getFlowAnimation() {
//     let { flowAnimation } = this;
//     if (flowAnimation) return flowAnimation;
//     const [lineEl] = this.findBySelector("line");
//     const keyframes = { strokeDashoffset: [0, -20] };
//     flowAnimation = lineEl.animate(keyframes, {
//       fill: "forwards",
//       duration: 1000,
//       iterations: Infinity,
//     });
//     this.flowAnimation = flowAnimation;
//     return flowAnimation;
//   },

//   toggleFlow() {
//     const { model } = this;
//     const flowRate = model.get("flow");
//     this.getFlowAnimation().playbackRate = flowRate;
//   },
// });

// // SCADA Diagram Component
// const ScadaDiagram = () => {
//   const paperContainerRef = useRef<HTMLDivElement>(null);
//   const stencilContainerRef = useRef(null);
//   const toolbarContainerRef = useRef(null);
//   const playbackRateEl = useRef(null);
//   const playbackRateOutputEl = useRef(null);
//   const paperRef = useRef<dia.Paper | null>(null);

//   useEffect(() => {
//     const namespace = { ...shapes, Generator, GeneratorView, Pipe, PipeView };

//     const graph = new dia.Graph({}, { cellNamespace: namespace });

//     const paper = new dia.Paper({
//       el: paperContainerRef.current,
//       model: graph,
//       width: 1000,
//       height: 1000,
//       async: true,
//       sorting: dia.Paper.sorting.APPROX,
//       background: { color: "#F3F7F6" },
//       interactive: { linkMove: false },
//       cellViewNamespace: namespace,
//       defaultAnchor: { name: "perpendicular" },
//       defaultConnectionPoint: { name: "anchor" },
//       defaultLink: () => new Pipe({ flow: 0 }),
//     });

//     paperContainerRef.current!.appendChild(paper.el);

//     paper.on("element:power:click", ({ model }, evt) => {
//       evt.stopPropagation();
//       const playbackRate = model.get("power") ? 0 : 1;
//       setPlaybackRate(playbackRate);
//     });

//     paperContainerRef.current!.addEventListener("input", ({ target }) => {
//       const playbackRate = parseFloat((target as any).value);
//       setPlaybackRate(playbackRate);
//     });

//     const generator = new Generator({
//       position: { x: 50, y: 50 },
//     });

//     function setPlaybackRate(playbackRate: any) {
//       generator.set("power", playbackRate);
//       (playbackRateEl as any).value = playbackRate;
//       (playbackRateOutputEl as any).value = `${playbackRate} x`;
//     }

//     const bulb1 = Bulb.create(100).position(150, 45);

//     const bulb2 = Bulb.create(40).position(150, 105);

//     const wire1 = new Wire({
//       source: { id: generator.id },
//       target: { id: bulb1.id },
//     });

//     const wire2 = new Wire({
//       source: { id: generator.id },
//       target: { id: bulb2.id },
//     });

//     graph.addCells([generator, bulb1, bulb2, wire1, wire2]);
//     graph.on("change:power", (el) => toggleLights(graph, el));
//     function toggleLights(graph: any, el: any) {
//       graph.getNeighbors(el, { outbound: true }).forEach((bulb: any) => {
//         bulb.set("light", el.power >= bulb.get("watts"));
//       });
//     }

//     toggleLights(graph, generator);

//     // const paperScroller = new ui.PaperScroller({
//     //   paper,
//     //   autoResizePaper: true,
//     //   scrollWhileDragging: true,
//     // });

//     // paperContainerRef.current.appendChild(paperScroller.el);

//     // paperScroller.render().center();

//     const stencil = new ui.Stencil({
//       el: stencilContainerRef.current,
//       graph,
//       paper,
//       width: 200,
//       height: 400,
//       layout: {
//         columns: 1,
//         marginY: 10,
//         rowHeight: 100,
//       },
//     });

//     // const toolbar = new ui.Toolbar({
//     //   el: toolbarContainerRef.current,
//     //   tools: [
//     //     { type: "zoomIn", name: "zoom-in" },
//     //     { type: "zoomOut", name: "zoom-out" },
//     //     { type: "zoomToFit", name: "zoom-to-fit" },
//     //   ],
//     // });

//     // toolbar.render();

//     // Create stencil elements
//     const generator1 = new Generator({ position: { x: 50, y: 50 } });
//     const generator2 = new Generator({ position: { x: 50, y: 150 } });

//     // stencil.load([generator1, generator2]);

//     // Add elements to graph
//     const gen1 = new Generator({ position: { x: 300, y: 100 } });
//     const gen2 = new Generator({ position: { x: 300, y: 250 } });
//     const pipe = new Pipe({
//       source: { id: gen1.id },
//       target: { id: gen2.id },
//       flow: 1,
//     });

//     graph.addCells([gen1, gen2, pipe]);

//     // Handle power and flow updates
//     paper.on("element:power:click", ({ model }) => {
//       const playbackRate = model.get("power") ? 0 : 1;
//       model.set("power", playbackRate);
//       graph.getConnectedLinks(model, { outbound: true }).forEach((link) => {
//         link.set("flow", playbackRate);
//       });
//     });

//     // Cleanup
//     return () => {
//       //   paperScroller.remove();
//       paper.remove();
//       stencil.remove();
//       //   toolbar.remove();
//     };
//   }, []);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
//       <div
//         ref={toolbarContainerRef}
//         style={{ padding: "10px", borderBottom: "1px solid #ccc" }}
//       />
//       <div style={{ display: "flex", flex: 1 }}>
//         <div
//           ref={stencilContainerRef}
//           style={{ width: 200, borderRight: "1px solid #ccc" }}
//         />
//         <div ref={paperContainerRef} style={{ flex: 1 }} />
//       </div>
//     </div>
//   );
// };

// export default ScadaDiagram;

import React, { useEffect, useRef } from "react";
import { dia, shapes, util, ui, V, highlighters } from "@joint/plus";

function ScadaDiagram() {
  const paperRef = useRef<dia.Paper | null>(null);
  const paperContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const graph = new dia.Graph({}, { cellNamespace: shapes });
    paperRef.current = new dia.Paper({
      model: graph,
      cellViewNamespace: shapes,
      width: "100%",
      height: "100%",
      gridSize: 10,
      async: true,
      frozen: true,
      sorting: dia.Paper.sorting.APPROX,
      background: { color: "#F3F7F6" },
      clickThreshold: 10,
      defaultConnector: {
        name: "rounded",
      },
      defaultRouter: {
        name: "manhattan",
        args: {
          step: 10,
          endDirections: ["bottom"],
          startDirections: ["top"],
          padding: { bottom: 20 },
        },
      },
    });
    paperContainerRef.current!.appendChild(paperRef.current!.el);
    const color = "#ff4468";
    paperRef.current.svg.prepend(
      V.createSVGStyle(`
        .joint-element .selection {
            stroke: ${color};
        }
        .joint-link .selection {
            stroke: ${color};
            stroke-dasharray: 5;
            stroke-dashoffset: 10;
            animation: dash 0.5s infinite linear;
        }
        @keyframes dash {
            to {
                stroke-dashoffset: 0;
            }
        }
    `)
    );

    function element(x: number, y: number) {
      const el = new shapes.standard.Rectangle({
        position: { x, y },
        size: { width: 100, height: 60 },
        attrs: {
          label: {
            text: `Node ${graph.getElements().length + 1}`,
            fontFamily: "sans-serif",
          },
        },
        z: 2,
      });
      graph.addCell(el);
      return el;
    }

    function link(
      target: shapes.standard.Rectangle,
      source: shapes.standard.Rectangle
    ) {
      const l = new shapes.standard.Link({
        source: { id: source.id },
        target: { id: target.id },
        z: 1,
      });
      graph.addCell(l);
      return l;
    }

    const el1 = element(300, 50);
    const el2 = element(100, 200);
    const el3 = element(300, 200);
    const el4 = element(500, 200);
    const el5 = element(300, 350);
    const el6 = element(40, 350);
    const el7 = element(160, 350);
    const el8 = element(160, 500);

    link(el1, el3);
    link(el1, el2);
    link(el1, el4);
    link(el2, el6);
    link(el2, el7);
    link(el3, el5);
    link(el7, el8);

    paperRef.current.unfreeze();

    function getElementPredecessorLinks(
      el:
        | dia.Element<dia.Element.Attributes, dia.ModelSetOptions>
        | dia.Cell<dia.Cell.Attributes, dia.ModelSetOptions>
    ) {
      if (!el.isElement()) return [];

      // Narrow to only Elements
      const predecessors = graph
        .getPredecessors(el)
        .filter((cell): cell is dia.Element => cell.isElement());

      return graph
        .getSubgraph([el, ...predecessors])
        .filter((cell): cell is dia.Link => cell.isLink());
    }

    function highlightCell(cell: dia.Element | dia.Link) {
      highlighters!.addClass.add(
        cell.findView(paperRef.current!),
        cell.isElement() ? "body" : "line",
        "selection",
        { className: "selection" }
      );
    }

    function unhighlightCell(
      cell: dia.Link<dia.Link.Attributes, dia.ModelSetOptions>
    ) {
      highlighters.addClass.remove(
        cell.findView(paperRef.current!),
        "selection"
      );
    }

    let selection: null = null;

    function selectElement(
      el: dia.Element<dia.Element.Attributes, dia.ModelSetOptions> | null
    ) {
      if (selection === el) return;
      if (selection) {
        unhighlightCell(selection);
        graph.getLinks().forEach((link) => unhighlightCell(link));
      }
      if (el) {
        highlightCell(el);
        getElementPredecessorLinks(el).forEach((link) => highlightCell(link));
      } else {
        selection = null;
      }
    }

    paperRef.current.on("element:pointerclick", (elementView) =>
      selectElement(elementView.model)
    );
    paperRef.current.on("blank:pointerclick", (elementView) =>
      selectElement(null)
    );

    selectElement(el2);
  }, []);
  return (
    <div>
      <div ref={paperContainerRef} id="paper-container"></div>
    </div>
  );
}

export default ScadaDiagram;
