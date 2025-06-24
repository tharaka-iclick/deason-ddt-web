// import React, { useEffect, useRef, useState } from "react";
// import {
//   dia,
//   ui,
//   shapes,
//   util,
//   layout,
//   highlighters,
//   elementTools,
// } from "@joint/plus";
// import "./App.scss";

// const StencilGroup = {
//   UsedShapes: "used-shapes",
//   FavoriteShapes: "favorite-shapes",
//   SymbolShapes: "symbol-shapes",
// };

// class Placeholder extends dia.Element {
//   defaults(): dia.Element.Attributes {
//     return {
//       ...super.defaults,
//       type: "Placeholder",
//       position: { x: 10, y: 10 },
//       attrs: {
//         root: {},
//         body: {
//           class: "jj-placeholder-body",
//           fill: "transparent",
//           x: 0,
//           y: 0,
//           width: "calc(w)",
//           height: "calc(h)",
//         },
//         label: {
//           class: "jj-placeholder-label",
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

// const createPlaceholders = () => {
//   const favoriteShapesPlaceholder = new Placeholder({
//     size: { width: 180, height: 40 },
//     attrs: {
//       body: {
//         strokeWidth: 2,
//         strokeDasharray: "5,5",
//         stroke: "#87A7C0",
//       },
//       label: {
//         text: "Drop your\nshape here.",
//         fill: "#87A7C0",
//       },
//     },
//   });

//   const usedShapesPlaceholder = new Placeholder({
//     size: { width: 180, height: 100 },
//     attrs: {
//       label: {
//         text: "There are no shapes\nin the diagram yet.",
//         fill: "#87A7C0",
//       },
//     },
//   });

//   return { favoriteShapesPlaceholder, usedShapesPlaceholder };
// };

// const shapesJSON = [
//   {
//     uniqueKey: "rectangle",
//     type: "standard.Rectangle",
//     size: { width: 60, height: 40 },
//     keywords: ["rect", "rectangle"],
//   },
//   {
//     uniqueKey: "rounded_rectangle",
//     type: "standard.Rectangle",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         rx: 10,
//         ry: 10,
//       },
//     },
//     keywords: ["rounded", "round", "rectangle"],
//   },
//   {
//     uniqueKey: "circle",
//     type: "standard.Circle",
//     size: { width: 40, height: 40 },
//     keywords: ["circle"],
//   },
//   {
//     uniqueKey: "ellipse",
//     type: "standard.Ellipse",
//     size: { width: 60, height: 40 },
//     keywords: ["ellipse"],
//   },
//   {
//     uniqueKey: "triangle_up",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: "M calc(0.5*w) 0 calc(w) calc(h) H 0 Z",
//       },
//     },
//     keywords: ["triangle", "up"],
//   },
//   {
//     uniqueKey: "triangle_down",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: "M 0 0 L calc(w) 0 calc(0.5*w) calc(h) Z",
//       },
//     },
//     keywords: ["triangle", "down"],
//   },
//   {
//     uniqueKey: "triangle_curved",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         refD: null,
//         d: "M calc(w / 2) calc(h) L 0 calc(h / 2) A calc(w / 2) calc(h / 2) 0 0 1 calc(w / 2) 0 A calc(w / 2) calc(h / 2) 0 0 1 calc(w) calc(h / 2) Z",
//       },
//     },
//     keywords: ["triangle", "curved"],
//   },
//   {
//     uniqueKey: "rhombus",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: "M calc(0.5*w) 0 calc(w) calc(0.5*h) calc(0.5*w) calc(h) 0 calc(0.5*h) Z",
//       },
//     },
//     keywords: ["rhombus"],
//   },
//   {
//     uniqueKey: "pentagon",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: `
//                     M calc(0.75*w) 0
//                     L calc(w) calc(0.5*h)
//                     L calc(0.5*w) calc(h)
//                     L 0 calc(0.5*h)
//                     L calc(0.25*w) 0
//                     Z
//                 `,
//       },
//     },
//     keywords: ["pentagon"],
//   },
//   {
//     uniqueKey: "hexagon",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: "M 0 calc(0.5*h) L calc(0.25*w) 0 calc(0.75*w) 0 calc(w) calc(0.5*h) calc(0.75*w) calc(h) calc(0.25*w) calc(h) Z",
//       },
//     },
//     keywords: ["hexagon"],
//   },
//   {
//     uniqueKey: "octagon",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: "M calc(0.3*w) 0 L calc(0.7*w) 0 calc(w) calc(0.3*h) calc(w) calc(0.7*h) calc(0.7*w) calc(h) calc(0.3*w) calc(h) 0 calc(0.7*h) 0 calc(0.3*h) Z",
//       },
//     },
//     keywords: ["octagon"],
//   },
//   {
//     uniqueKey: "parallelogram",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: `
//                     M calc(0.3*w) 0
//                     L calc(w) 0
//                     L calc(0.7*w) calc(h)
//                     L 0 calc(h)
//                     Z
//                 `,
//       },
//     },
//     keywords: ["parallelogram"],
//   },
//   {
//     uniqueKey: "trapezoid",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: `
//                     M calc(0.2*w) 0
//                     L calc(0.8*w) 0
//                     L calc(w) calc(h)
//                     L 0 calc(h)
//                     Z
//                 `,
//       },
//     },
//     keywords: ["trapezoid"],
//   },
//   {
//     uniqueKey: "star",
//     type: "standard.Path",
//     size: { width: 40, height: 40 },
//     attrs: {
//       body: {
//         d: `
//                     M calc(0.5*w) 0
//                     L calc(0.61*w) calc(0.25*h)
//                     L calc(w) calc(0.3*h)
//                     L calc(0.7*w) calc(0.5*h)
//                     L calc(0.75*w) calc(0.79*h)
//                     L calc(0.5*w) calc(0.65*h)
//                     L calc(0.25*w) calc(0.79*h)
//                     L calc(0.3*w) calc(0.5*h)
//                     L 0 calc(0.3*h)
//                     L calc(0.39*w) calc(0.25*h)
//                     Z
//                 `,
//       },
//     },
//     keywords: ["star"],
//   },
//   {
//     uniqueKey: "cross",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: `
//                     M calc(0.3*w) 0
//                     L calc(0.7*w) 0
//                     V calc(0.3*h)
//                     L calc(w) calc(0.3*h)
//                     L calc(w) calc(0.7*h)
//                     H calc(0.7*w)
//                     L calc(0.7*w) calc(h)
//                     L calc(0.3*w) calc(h)
//                     V calc(0.7*h)
//                     L 0 calc(0.7*h)
//                     L 0 calc(0.3*h)
//                     H calc(0.3*w)
//                     Z
//                 `,
//       },
//     },
//     keywords: ["cross"],
//   },
//   {
//     uniqueKey: "arrow",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: `
//                     M 0 calc(0.5*h)
//                     L calc(0.5*w) 0
//                     L calc(w) calc(0.5*h)
//                     L calc(0.8*w) calc(0.5*h)
//                     L calc(0.8*w) calc(h)
//                     L calc(0.2*w) calc(h)
//                     L calc(0.2*w) calc(0.5*h)
//                     Z
//                 `,
//       },
//     },
//     keywords: ["arrow"],
//   },
//   {
//     uniqueKey: "pentagon_curved",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: `
//                     M 0 calc(0.62*h)
//                     Q calc(0.2*w) calc(0.15*h) calc(0.5*w) 0
//                     Q calc(0.8*w) calc(0.15*h) calc(w) calc(0.62*h)
//                     L calc(0.77*w) calc(h)
//                     L calc(0.23*w) calc(h)
//                     Z
//                 `,
//       },
//     },
//     keywords: ["pentagon", "curved"],
//   },
//   {
//     uniqueKey: "triangle_right_angle",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         strokeLinejoin: "butt",
//         d: "M 0 calc(h) L calc(w) calc(h) L 0 0 Z",
//       },
//     },
//     keywords: ["triangle", "right-angle"],
//   },
//   {
//     uniqueKey: "l_shape_1",
//     type: "standard.Path",
//     size: { width: 40, height: 40 },
//     attrs: {
//       body: {
//         d: "M 0 0 L calc(w/2) 0 L calc(w/2) calc(h/2) L calc(w) calc(h/2) L calc(w) calc(h) L 0 calc(h) Z",
//       },
//     },
//     keywords: ["l-shape"],
//   },
//   {
//     uniqueKey: "l_shape_2",
//     type: "standard.Path",
//     size: { width: 40, height: 40 },
//     attrs: {
//       body: {
//         d: "M 0 0 L calc(w) 0 L calc(w) calc(h/2) L calc(w/2) calc(h/2) L calc(w/2) calc(h) L 0 calc(h) Z",
//       },
//     },
//     keywords: ["l-shape"],
//   },
//   {
//     uniqueKey: "l_shape_3",
//     type: "standard.Path",
//     size: { width: 40, height: 40 },
//     attrs: {
//       body: {
//         d: "M 0 0 L calc(w) 0 L calc(w) calc(h) L calc(w/2) calc(h) L calc(w/2) calc(h/2) L 0 calc(h/2) Z",
//       },
//     },
//     keywords: ["l-shape"],
//   },
//   {
//     uniqueKey: "l_shape_4",
//     type: "standard.Path",
//     size: { width: 40, height: 40 },
//     attrs: {
//       body: {
//         d: "M calc(w / 2) 0 L calc(w) 0 L calc(w) calc(h) L 0 calc(h) L 0 calc(h / 2) L calc(w / 2) calc(h / 2) Z",
//       },
//     },
//     keywords: ["l-shape"],
//   },
//   {
//     uniqueKey: "u_shape_1",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: "M 0 0 calc(w / 3) 0 calc(w / 3) calc(h / 2) calc(2 * w / 3) calc(h / 2) calc(2 * w / 3) 0 calc(w) 0 calc(w) calc(h) 0 calc(h) Z",
//       },
//     },
//     keywords: ["u-shape"],
//   },
//   {
//     uniqueKey: "u_shape_2",
//     type: "standard.Path",
//     size: { width: 60, height: 40 },
//     attrs: {
//       body: {
//         d: "M 0 0 0 calc(h) calc(w / 3) calc(h) calc(w / 3) calc(h / 2) calc(2 * w / 3) calc(h / 2) calc(2 * w / 3) calc(h) calc(w) calc(h) calc(w) 0 Z",
//       },
//     },
//     keywords: ["u-shape"],
//   },
// ];
// const shapesJSONMap = new Map();
// shapesJSON.forEach((shape, idx) => {
//   shape.uniqueKey = `${idx + 1}`;
//   util.setByPath(shape, ["attrs", "root", "title"], shape.keywords.toString());
//   util.setByPath(shape, ["attrs", "root", "magnet"], "body");
//   util.setByPath(shape, ["attrs", "root", "highlighterSelector"], "body");
//   util.setByPath(shape, ["attrs", "body", "stroke"], "#ed556f");
//   util.setByPath(shape, ["attrs", "body", "strokeWidth"], 1);
//   shapesJSONMap.set(shape.uniqueKey, shape);
// });

// const getFavoriteShapeKeys = (): string[] =>
//   JSON.parse(localStorage.getItem("favoriteShapes") || "[]");

// const mapKeysToShapes = (keys: string[]) =>
//   keys.map((key) => shapesJSONMap.get(key)).filter(Boolean);

// const getElementKey = (el: dia.Element): string => el.get("uniqueKey");

// const App: React.FC = () => {
//   const [paper, setPaper] = useState<dia.Paper | null>(null);
//   const [graph, setGraph] = useState<dia.Graph | null>(null);
//   const [stencil, setStencil] = useState<ui.Stencil | null>(null);

//   const paperRef = useRef<HTMLDivElement | null>(null);
//   const stencilRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const { favoriteShapesPlaceholder, usedShapesPlaceholder } =
//       createPlaceholders();
//     const graphInstance = new dia.Graph({}, { cellNamespace: shapes });

//     const paperInstance = new dia.Paper({
//       model: graphInstance,
//       cellViewNamespace: shapes,
//       width: "100%",
//       height: "100%",
//       gridSize: 1,
//       async: true,
//       background: { color: "#dde6ed" },
//       defaultConnectionPoint: { name: "boundary", args: { selector: false } },
//       defaultLink: () =>
//         new shapes.standard.Link({
//           attrs: { line: { stroke: "#131e29" } },
//         }),
//       linkPinning: false,
//       highlighting: {
//         connecting: {
//           name: "mask",
//           options: {
//             attrs: {
//               stroke: "#0075f0",
//               "stroke-width": 2,
//             },
//           },
//         },
//       },
//     });

//     const stencilInstance = new ui.Stencil({
//       paper: paperInstance,
//       usePaperGrid: true,
//       width: 300,
//       height: "100%",
//       dropAnimation: true,
//       paperOptions: () => ({
//         model: new dia.Graph({}, { cellNamespace: shapes }),
//         cellViewNamespace: shapes,
//         background: { color: "#333" },
//         overflow: true,
//       }),
//       search: (cell, keyword) => {
//         if (keyword === "") return true;
//         if (
//           cell.isElement() &&
//           Placeholder.isPlaceholder(cell as dia.Element)
//         ) {
//           if (cell === usedShapesPlaceholder) return false;
//           return true;
//         }
//         const keywords = cell.get("keywords") || [];
//         return keywords.some((kw: string) =>
//           kw.toLowerCase().includes(keyword.toLowerCase())
//         );
//       },
//       contentOptions: { useModelGeometry: true },
//       canDrag: (view) => {
//         return (
//           !view.model.isElement() ||
//           !Placeholder.isPlaceholder(view.model as dia.Element)
//         );
//       },
//       layout: (graph, group) => {
//         const groupElements = graph.getElements();
//         const layoutElements = groupElements.filter(
//           (el) => !Placeholder.isPlaceholder(el)
//         );
//         const rowGap = 20;
//         const layoutOptions: layout.GridLayout.Options = {
//           columns: 2,
//           rowHeight: "auto",
//           columnWidth: 200,
//           horizontalAlign: "middle", // must be typed properly!
//           rowGap,
//           marginY: layoutElements.length
//             ? rowGap
//             : (favoriteShapesPlaceholder as dia.Element).size().height +
//               2 * rowGap,
//         };

//         layout.GridLayout.layout(layoutElements, layoutOptions);
//       },
//       groups: {
//         [StencilGroup.UsedShapes]: { index: 1, label: "Shapes In Use" },
//         [StencilGroup.FavoriteShapes]: { index: 2, label: "Favorite Shapes" },
//         [StencilGroup.SymbolShapes]: { index: 3, label: "Symbols" },
//       },
//     });

//     paperRef.current?.appendChild(paperInstance.el);
//     stencilRef.current?.appendChild(stencilInstance.el);

//     stencilInstance.render(); // 🔧 Important: render before using load()

//     stencilRef.current?.appendChild(stencilInstance.el);

//     setGraph(graphInstance);
//     setPaper(paperInstance);
//     setStencil(stencilInstance);

//     stencilInstance.load({
//       [StencilGroup.SymbolShapes]: [...shapesJSON],
//     });

//     // Load favorite shapes
//     const favoriteShapes = mapKeysToShapes(getFavoriteShapeKeys());
//     stencilInstance.load({
//       [StencilGroup.FavoriteShapes]: [
//         favoriteShapesPlaceholder,
//         ...favoriteShapes,
//       ],
//     });

//     // Load used shapes
//     const resetUsedShapes = () => {
//       const usedKeys = Object.keys(
//         util.groupBy(graphInstance.getElements(), getElementKey)
//       );
//       const used = mapKeysToShapes(usedKeys);
//       stencilInstance.load({
//         [StencilGroup.UsedShapes]: used.length ? used : [usedShapesPlaceholder],
//       });
//     };

//     graphInstance.on("add remove reset", resetUsedShapes);
//     resetUsedShapes();

//     return () => {
//       paperInstance.remove();
//       stencilInstance.remove();
//     };
//   }, []);

//   return (
//     <div className="flex h-screen">
//       <div id="stencil-container" ref={stencilRef}></div>
//       <div id="paper-container" ref={paperRef}></div>
//     </div>
//   );
// };

// export default App;

import React, { useEffect, useRef } from "react";
import {
  dia,
  ui,
  shapes,
  util,
  layout,
  highlighters,
  elementTools,
} from "@joint/plus";
import "./App.scss"; // Assume CSS is extracted to a separate file

// Define StencilGroup constants
const StencilGroup = {
  UsedShapes: "used-shapes",
  FavoriteShapes: "favorite-shapes",
  SymbolShapes: "symbol-shapes",
} as const;

// Placeholder class
class Placeholder extends dia.Element {
  defaults(): dia.Element.Attributes {
    return {
      ...super.defaults,
      type: "Placeholder",
      position: { x: 10, y: 10 },
      attrs: {
        root: {},
        body: {
          class: "jj-placeholder-body",
          fill: "transparent",
          x: 0,
          y: 0,
          width: "calc(w)",
          height: "calc(h)",
        },
        label: {
          class: "jj-placeholder-label",
          fontSize: 14,
          fontFamily: "sans-serif",
          textVerticalAnchor: "middle",
          textAnchor: "middle",
          x: "calc(w/2)",
          y: "calc(h/2)",
        },
      },
    };
  }

  static isPlaceholder(element: dia.Element): boolean {
    return element.get("type") === "Placeholder";
  }

  preinitialize() {
    this.markup = [
      {
        tagName: "rect",
        selector: "body",
      },
      {
        tagName: "text",
        selector: "label",
      },
    ];
  }
}

// Placeholder instances
const favoriteShapesPlaceholder = new Placeholder({
  size: { width: 200, height: 80 },
  attrs: {
    body: {
      strokeWidth: 2,
      strokeDasharray: "5,5",
      stroke: "#87A7C0",
    },
    label: {
      text: "Drop your\nelement here.",
      fill: "#87A7C0",
    },
  },
});

const usedShapesPlaceholder = new Placeholder({
  size: { width: 180, height: 40 },
  attrs: {
    label: {
      text: "There are no shapes\nin the diagram yet.",
      fill: "#87A7C0",
    },
  },
});

// Shapes JSON data
const shapesJSON: any[] = [
  {
    uniqueKey: "rectangle",
    type: "standard.Rectangle",
    size: { width: 60, height: 40 },
    keywords: ["rect", "rectangle"],
  },
  {
    uniqueKey: "rounded_rectangle",
    type: "standard.Rectangle",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        rx: 10,
        ry: 10,
      },
    },
    keywords: ["rounded", "round", "rectangle"],
  },
  {
    uniqueKey: "circle",
    type: "standard.Circle",
    size: { width: 40, height: 40 },
    keywords: ["circle"],
  },
  {
    uniqueKey: "ellipse",
    type: "standard.Ellipse",
    size: { width: 60, height: 40 },
    keywords: ["ellipse"],
  },
  {
    uniqueKey: "triangle_up",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        d: "M calc(0.5*w) 0 calc(w) calc(h) H 0 Z",
      },
    },
    keywords: ["triangle", "up"],
  },
  {
    uniqueKey: "triangle_down",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        d: "M 0 0 L calc(w) 0 calc(0.5*w) calc(h) Z",
      },
    },
    keywords: ["triangle", "down"],
  },
  {
    uniqueKey: "triangle_curved",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        refD: null,
        d: "M calc(w / 2) calc(h) L 0 calc(h / 2) A calc(w / 2) calc(h / 2) 0 0 1 calc(w / 2) 0 A calc(w / 2) calc(h / 2) 0 0 1 calc(w) calc(h / 2) Z",
      },
    },
    keywords: ["triangle", "curved"],
  },
  {
    uniqueKey: "rhombus",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        d: "M calc(0.5*w) 0 calc(w) calc(0.5*h) calc(0.5*w) calc(h) 0 calc(0.5*h) Z",
      },
    },
    keywords: ["rhombus"],
  },
  {
    uniqueKey: "pentagon",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        d: `
                    M calc(0.75*w) 0
                    L calc(w) calc(0.5*h)
                    L calc(0.5*w) calc(h)
                    L 0 calc(0.5*h)
                    L calc(0.25*w) 0
                    Z
                `,
      },
    },
    keywords: ["pentagon"],
  },
  {
    uniqueKey: "hexagon",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        d: "M 0 calc(0.5*h) L calc(0.25*w) 0 calc(0.75*w) 0 calc(w) calc(0.5*h) calc(0.75*w) calc(h) calc(0.25*w) calc(h) Z",
      },
    },
    keywords: ["hexagon"],
  },
  {
    uniqueKey: "octagon",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        d: "M calc(0.3*w) 0 L calc(0.7*w) 0 calc(w) calc(0.3*h) calc(w) calc(0.7*h) calc(0.7*w) calc(h) calc(0.3*w) calc(h) 0 calc(0.7*h) 0 calc(0.3*h) Z",
      },
    },
    keywords: ["octagon"],
  },
  {
    uniqueKey: "parallelogram",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        d: `
                    M calc(0.3*w) 0
                    L calc(w) 0
                    L calc(0.7*w) calc(h)
                    L 0 calc(h)
                    Z
                `,
      },
    },
    keywords: ["parallelogram"],
  },
  {
    uniqueKey: "trapezoid",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        d: `
                    M calc(0.2*w) 0
                    L calc(0.8*w) 0
                    L calc(w) calc(h)
                    L 0 calc(h)
                    Z
                `,
      },
    },
    keywords: ["trapezoid"],
  },
  {
    uniqueKey: "star",
    type: "standard.Path",
    size: { width: 40, height: 40 },
    attrs: {
      body: {
        d: `
                    M calc(0.5*w) 0
                    L calc(0.61*w) calc(0.25*h)
                    L calc(w) calc(0.3*h)
                    L calc(0.7*w) calc(0.5*h)
                    L calc(0.75*w) calc(0.79*h)
                    L calc(0.5*w) calc(0.65*h)
                    L calc(0.25*w) calc(0.79*h)
                    L calc(0.3*w) calc(0.5*h)
                    L 0 calc(0.3*h)
                    L calc(0.39*w) calc(0.25*h)
                    Z
                `,
      },
    },
    keywords: ["star"],
  },
  {
    uniqueKey: "cross",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        d: `
                    M calc(0.3*w) 0
                    L calc(0.7*w) 0
                    V calc(0.3*h)
                    L calc(w) calc(0.3*h)
                    L calc(w) calc(0.7*h)
                    H calc(0.7*w)
                    L calc(0.7*w) calc(h)
                    L calc(0.3*w) calc(h)
                    V calc(0.7*h)
                    L 0 calc(0.7*h)
                    L 0 calc(0.3*h)
                    H calc(0.3*w)
                    Z
                `,
      },
    },
    keywords: ["cross"],
  },
  {
    uniqueKey: "arrow",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        d: `
                    M 0 calc(0.5*h)
                    L calc(0.5*w) 0
                    L calc(w) calc(0.5*h)
                    L calc(0.8*w) calc(0.5*h)
                    L calc(0.8*w) calc(h)
                    L calc(0.2*w) calc(h)
                    L calc(0.2*w) calc(0.5*h)
                    Z
                `,
      },
    },
    keywords: ["arrow"],
  },
  {
    uniqueKey: "pentagon_curved",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        d: `
                    M 0 calc(0.62*h)
                    Q calc(0.2*w) calc(0.15*h) calc(0.5*w) 0
                    Q calc(0.8*w) calc(0.15*h) calc(w) calc(0.62*h)
                    L calc(0.77*w) calc(h)
                    L calc(0.23*w) calc(h)
                    Z
                `,
      },
    },
    keywords: ["pentagon", "curved"],
  },
  {
    uniqueKey: "triangle_right_angle",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        strokeLinejoin: "butt",
        d: "M 0 calc(h) L calc(w) calc(h) L 0 0 Z",
      },
    },
    keywords: ["triangle", "right-angle"],
  },
  {
    uniqueKey: "l_shape_1",
    type: "standard.Path",
    size: { width: 40, height: 40 },
    attrs: {
      body: {
        d: "M 0 0 L calc(w/2) 0 L calc(w/2) calc(h/2) L calc(w) calc(h/2) L calc(w) calc(h) L 0 calc(h) Z",
      },
    },
    keywords: ["l-shape"],
  },
  {
    uniqueKey: "l_shape_3",
    type: "standard.Path",
    size: { width: 40, height: 40 },
    attrs: {
      body: {
        d: "M 0 0 L calc(w) 0 L calc(w) calc(h) L calc(w/2) calc(h) L calc(w/2) calc(h/2) L 0 calc(h/2) Z",
      },
    },
    keywords: ["l-shape"],
  },
  {
    uniqueKey: "l_shape_4",
    type: "standard.Path",
    size: { width: 40, height: 40 },
    attrs: {
      body: {
        d: "M calc(w / 2) 0 L calc(w) 0 L calc(w) calc(h) L 0 calc(h) L 0 calc(h / 2) L calc(w / 2) calc(h / 2) Z",
      },
    },
    keywords: ["l-shape"],
  },
  {
    uniqueKey: "u_shape_1",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        d: "M 0 0 calc(w / 3) 0 calc(w / 3) calc(h / 2) calc(2 * w / 3) calc(h / 2) calc(2 * w / 3) 0 calc(w) 0 calc(w) calc(h) 0 calc(h) Z",
      },
    },
    keywords: ["u-shape"],
  },
  {
    uniqueKey: "u_shape_2",
    type: "standard.Path",
    size: { width: 60, height: 40 },
    attrs: {
      body: {
        d: "M 0 0 0 calc(h) calc(w / 3) calc(h) calc(w / 3) calc(h / 2) calc(2 * w / 3) calc(h / 2) calc(2 * w / 3) calc(h) calc(w) calc(h) calc(w) 0 Z",
      },
    },
    keywords: ["u-shape"],
  },
];

// Shapes JSON map
const shapesJSONMap: { [key: string]: any } = {};

shapesJSON.forEach((shapeJSON, index) => {
  shapeJSON.uniqueKey = index + 1;
  util.setByPath(
    shapeJSON,
    ["attrs", "root", "title"],
    String(shapeJSON.keywords)
  );
  util.setByPath(shapeJSON, ["attrs", "root", "magnetSelector"], "body");
  util.setByPath(shapeJSON, ["attrs", "root", "highlighterSelector"], "body");
  util.setByPath(shapeJSON, ["attrs", "body", "stroke"], "#ed2637");
  util.setByPath(shapeJSON, ["attrs", "body", "strokeWidth"], 1);
  shapesJSONMap[shapeJSON.uniqueKey] = shapeJSON;
});

// React Component
const App: React.FC = () => {
  const paperContainerRef = useRef<HTMLDivElement>(null);
  const stencilContainerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<dia.Graph | null>(null);
  const paperRef = useRef<dia.Paper | null>(null);
  const stencilRef = useRef<ui.Stencil | null>(null);
  const placeholderPaperRef = useRef<dia.Paper | null>(null);
  const placeholderGraphRef = useRef<dia.Graph | null>(null);

  useEffect(() => {
    // Initialize graph
    graphRef.current = new dia.Graph({}, { cellNamespace: shapes });

    // Initialize paper
    paperRef.current = new dia.Paper({
      model: graphRef.current,
      cellViewNamespace: shapes,
      width: "100%",
      height: "100%",
      gridSize: 1,
      async: true,
      clickThreshold: 10,
      sorting: dia.Paper.sorting.APPROX,
      background: { color: "#dde6ed" },
      defaultConnectionPoint: {
        name: "boundary",
        args: { selector: false },
      },
      defaultLink: () =>
        new shapes.standard.Link({
          attrs: {
            line: {
              stroke: "#131e29",
              strokeWidth: 2,
              sourceMarker: { type: "none" }, // Remove default source arrow
              targetMarker: {
                type: "image",
                href:
                  "data:image/svg+xml;base64," +
                  btoa(`
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <rect x="8" y="0" width="4" height="20" fill="#131e29" />
                  </svg>
                `), // Base64-encoded pipe SVG
                width: 20,
                height: 20,
                transform: "rotate(90)", // Adjust orientation if needed
              },
            },
          },
        }),
      linkPinning: false,
      highlighting: {
        connecting: {
          name: "mask",
          options: {
            attrs: {
              stroke: "#0075f2",
              "stroke-width": 2,
            },
          },
        },
      },
    });

    // Append paper to container
    if (paperContainerRef.current && paperRef.current) {
      paperContainerRef.current.appendChild(paperRef.current.el);
    }

    // Initialize stencil
    stencilRef.current = new ui.Stencil({
      paper: paperRef.current,
      usePaperGrid: true,
      width: 100,
      height: "100%",
      dropAnimation: true,
      paperOptions: () => ({
        model: new dia.Graph({}, { cellNamespace: shapes }),
        cellViewNamespace: shapes,
        background: { color: "#FFFFFF" },
        overflow: true,
      }),
      search: (cell, keyword) => {
        if (keyword === "") return true;
        if (Placeholder.isPlaceholder(cell as dia.Element)) {
          if (cell === usedShapesPlaceholder) return false;
          return true;
        }
        const keywords = cell.get("keywords") || [];
        return keywords.some(
          (kw: string) => kw.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
        );
      },
      dragStartClone: (cell) => {
        const dragClone = cell.clone();
        dragClone.attr(["body", "fill"], "#dde6ed");
        dragClone.set("group", cell.graph.get("group"));
        return dragClone;
      },
      contentOptions: { useModelGeometry: true },
      canDrag: (elementView) =>
        !Placeholder.isPlaceholder(elementView.model as dia.Element),
      layout: (graph, group) => {
        const groupElements = graph.getElements();
        const layoutElements = groupElements.filter(
          (element) => !Placeholder.isPlaceholder(element)
        );
        const rowGap = 20;
        const layoutOptions: any = {
          columns: 3,
          rowHeight: "compact",
          columnWidth: 75,
          horizontalAlign: "middle",
          rowGap,
          marginY: rowGap,
        };
        if (groupElements.length !== layoutElements.length) {
          const { height: placeholderHeight } =
            favoriteShapesPlaceholder.size();
          layoutOptions.marginY = placeholderHeight + 2 * rowGap;
        }
        layout.GridLayout.layout(layoutElements, layoutOptions);
      },
      groups: {
        [StencilGroup.UsedShapes]: { index: 1, label: "Shapes In Use" },
        [StencilGroup.FavoriteShapes]: { index: 2, label: "Favorite Shapes" },
        [StencilGroup.SymbolShapes]: { index: 3, label: "Symbols" },
      },
    });

    // Render stencil and append to container
    stencilRef.current.render();
    if (stencilContainerRef.current && stencilRef.current) {
      stencilContainerRef.current.appendChild(stencilRef.current.el);
      stencilRef.current.el
        .querySelector(".search")!
        .setAttribute("placeholder", "Find shapes...");
    }

    // Initialize placeholder paper and graph
    placeholderPaperRef.current = stencilRef.current.getPaper(
      StencilGroup.FavoriteShapes
    );
    placeholderGraphRef.current = stencilRef.current.getGraph(
      StencilGroup.FavoriteShapes
    );

    // Event handlers
    const setupEventHandlers = () => {
      if (
        !graphRef.current ||
        !paperRef.current ||
        !stencilRef.current ||
        !placeholderPaperRef.current ||
        !placeholderGraphRef.current
      )
        return;

      // Graph events
      graphRef.current.on("add remove", (cell) => {
        if (cell.isLink()) return;
        resetUsedShapes(graphRef.current!, stencilRef.current!);
      });
      graphRef.current.on("reset", () =>
        resetUsedShapes(graphRef.current!, stencilRef.current!)
      );

      // Placeholder graph events
      placeholderGraphRef.current.on("reset", () => {
        addToolsToStencilFavoriteGroup(
          stencilRef.current!,
          placeholderPaperRef.current!,
          placeholderGraphRef.current!.getElements()
        );
      });

      // Stencil filter event
      stencilRef.current.on("filter", (filteredGraph, group) => {
        if (group !== StencilGroup.FavoriteShapes) return;
        addToolsToStencilFavoriteGroup(
          stencilRef.current!,
          placeholderPaperRef.current!,
          filteredGraph.getElements()
        );
      });

      // Paper events
      paperRef.current.on("element:pointerclick", (elementView) => {
        paperRef.current!.removeTools();
        const toolsView = new dia.ToolsView({
          tools: [
            new elementTools.Boundary({ useModelGeometry: true }),
            new elementTools.Connect({
              useModelGeometry: true,
              x: "calc(w + 10)",
              y: "calc(h / 2)",
            }),
            new elementTools.Remove({
              useModelGeometry: true,
              x: -10,
              y: -10,
            }),
          ],
        });
        elementView.addTools(toolsView);
      });

      paperRef.current.on("blank:pointerdown", () => {
        paperRef.current!.removeTools();
      });

      // Stencil drag events
      const favoriteGroupEl = stencilRef.current.el.querySelector(
        '.group[data-name="favorite-shapes"]'
      );
      stencilRef.current.on(
        "element:drag",
        (dragView, evt, cloneArea, validArea) => {
          evt.data.save = false;
          highlighters.addClass.removeAll(
            placeholderPaperRef.current!,
            "hgl-favorite"
          );
          if (validArea) return;
          if (dragView.model.get("group") === StencilGroup.FavoriteShapes)
            return;
          if (stencilRef.current!.isGroupOpen(StencilGroup.FavoriteShapes)) {
            const placeholderArea =
              placeholderPaperRef.current!.clientToLocalRect(
                paperRef.current!.localToClientRect(cloneArea)
              );
            if (
              placeholderArea.intersect(favoriteShapesPlaceholder.getBBox())
            ) {
              evt.data.save = true;
              highlighters.addClass.add(
                favoriteShapesPlaceholder.findView(
                  placeholderPaperRef.current!
                ),
                "root",
                "hgl-favorite",
                { className: "jj-hgl-favorite" }
              );
            }
          } else {
            if (evt.target.matches(".group-label")) {
              const groupEl = evt.target.closest(".group");
              if (groupEl === favoriteGroupEl) {
                evt.data.save = true;
                favoriteGroupEl!.classList.add("group-hgl-favorite");
                return;
              }
            }
            favoriteGroupEl!.classList.remove("group-hgl-favorite");
          }
        }
      );

      stencilRef.current.on("element:dragend", (dragView, evt) => {
        favoriteGroupEl!.classList.remove("group-hgl-favorite");
        highlighters.addClass.removeAll(placeholderPaperRef.current!);
        if (!evt.data.save) return;
        addFavoriteElement(dragView.model, stencilRef.current!);
        stencilRef.current!.cancelDrag({ dropAnimation: false });
      });
    };

    // Utility functions
    const resetUsedShapes = (graph: dia.Graph, stencil: ui.Stencil) => {
      const usedElementsKeys = Object.keys(
        util.groupBy(graph.getElements(), getElementUniqueKey)
      );
      const usedElements = [...mapUniqueKeysToShapes(usedElementsKeys)];
      if (usedElements.length === 0) {
        usedElements.push(usedShapesPlaceholder);
      }
      stencil.load({ [StencilGroup.UsedShapes]: usedElements });
    };

    const getElementUniqueKey = (element: dia.Element): string => {
      return element.get("uniqueKey");
    };

    const addFavoriteElement = (element: dia.Element, stencil: ui.Stencil) => {
      const favoriteShapeKeys = readFavoriteShapesUniqueKeys();
      const elementUniqueKey = getElementUniqueKey(element);
      if (favoriteShapeKeys.includes(elementUniqueKey)) return;
      const favoriteShapes = mapUniqueKeysToShapes([
        ...favoriteShapeKeys,
        elementUniqueKey,
      ]);
      stencil.load({
        [StencilGroup.FavoriteShapes]: [
          favoriteShapesPlaceholder,
          ...favoriteShapes,
        ],
      });
      saveFavoriteShapes();
      refreshStencilSearch(stencil);
    };

    const removeFavoriteElement = (
      element: dia.Element,
      stencil: ui.Stencil
    ) => {
      const elementUniqueKey = getElementUniqueKey(element);
      const favoriteShapes = mapUniqueKeysToShapes(
        readFavoriteShapesUniqueKeys().filter((id) => id !== elementUniqueKey)
      );
      stencil.load({
        [StencilGroup.FavoriteShapes]: [
          favoriteShapesPlaceholder,
          ...favoriteShapes,
        ],
      });
      saveFavoriteShapes();
      refreshStencilSearch(stencil);
    };

    const saveFavoriteShapes = () => {
      const favoriteShapes = stencilRef
        .current!.getGraph(StencilGroup.FavoriteShapes)
        .getElements()
        .filter((element) => !Placeholder.isPlaceholder(element))
        .map((element) => element.get("uniqueKey"));
      localStorage.setItem("favoriteShapes", JSON.stringify(favoriteShapes));
    };

    const loadFavoriteShapes = () => {
      const favoriteShapes = mapUniqueKeysToShapes(
        readFavoriteShapesUniqueKeys()
      );
      stencilRef.current!.load({
        [StencilGroup.FavoriteShapes]: [
          favoriteShapesPlaceholder,
          ...favoriteShapes,
        ],
      });
    };

    const readFavoriteShapesUniqueKeys = (): string[] => {
      return JSON.parse(localStorage.getItem("favoriteShapes") || "[]");
    };

    const mapUniqueKeysToShapes = (shapeUniqueKeys: string[]): any[] => {
      return shapeUniqueKeys
        .map((uniqueKey) => shapesJSONMap[uniqueKey])
        .filter(Boolean);
    };

    function refreshStencilSearch(stencil: ui.Stencil) {
      const searchInput = stencil.el.querySelector(
        ".search"
      ) as HTMLInputElement | null;
      if (searchInput) {
        stencil.filter(searchInput.value);
      }
    }
    const addToolsToStencilFavoriteGroup = (
      stencil: ui.Stencil,
      favoriteGroupPaper: dia.Paper,
      elements: dia.Element[]
    ) => {
      favoriteGroupPaper.removeTools();
      elements.forEach((element) => {
        if (Placeholder.isPlaceholder(element)) return;
        const toolsView = new dia.ToolsView({
          tools: [
            new elementTools.Remove({
              useModelGeometry: true,
              x: "calc(w - 10)",
              y: "calc(h + 10)",
              action: () => removeFavoriteElement(element, stencil),
            }),
          ],
        });
        favoriteGroupPaper.findViewByModel(element).addTools(toolsView);
      });
    };

    // Load initial shapes
    stencilRef.current.load({
      [StencilGroup.SymbolShapes]: [...shapesJSON],
    });

    // Setup event handlers and initial state
    setupEventHandlers();
    resetUsedShapes(graphRef.current, stencilRef.current);
    loadFavoriteShapes();

    // Cleanup
    return () => {
      paperRef.current?.remove();
      stencilRef.current?.remove();
    };
  }, []);

  return (
    <div className="diagram-container">
      <div ref={stencilContainerRef} id="stencil-container" />
      <div ref={paperContainerRef} id="paper-container" />
    </div>
  );
};

export default App;
