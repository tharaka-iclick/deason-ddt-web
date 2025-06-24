import React, { useEffect, useRef } from "react";
import {
  dia,
  ui,
  shapes,
  util,
  layout,
  highlighters,
  elementTools,
  format,
} from "@joint/plus";
import "./App.scss";

// Define StencilGroup constants
const StencilGroup = {
  Equipment: "equipment",
  Sensors: "sensors",
  SymbolShapes: "symbol-shapes",
} as const;

type StencilGroupType = (typeof StencilGroup)[keyof typeof StencilGroup];

// Interface for SCADA shape configuration
interface ScadaShape {
  uniqueKey: string;
  type: string;
  size: { width: number; height: number };
  attrs: {
    body?: { [key: string]: any };
    label?: { [key: string]: any };
    state?: { [key: string]: any };
    root?: { [key: string]: any };
  };
  keywords: string[];
  ports?: Array<{
    id: string;
    group: string;
    attrs: { portBody: { magnet: boolean; fill: string } };
  }>;
  portMarkup?: Array<{ tagName: string; selector: string }>;
  portGroups?: {
    [key: string]: {
      position: { name: string };
      attrs: { portBody: { magnet: boolean; r: number; fill: string } };
    };
  };
}

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
          class: "jjPlaceholderBody",
          fill: "transparent",
          x: 0,
          y: 0,
          width: "calc(w)",
          height: "calc(h)",
        },
        label: {
          class: "jjPlaceholderLabel",
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
      { tagName: "rect", selector: "body" },
      { tagName: "text", selector: "label" },
    ];
  }
}

// Placeholder instances
const equipmentPlaceholder = new Placeholder({
  size: { width: 200, height: 80 },
  attrs: {
    body: { strokeWidth: 2, strokeDasharray: "5,5", stroke: "#87A7C0" },
    label: { text: "Drop equipment here.", fill: "#87A7C0" },
  },
});

const sensorsPlaceholder = new Placeholder({
  size: { width: 200, height: 80 },
  attrs: {
    body: { strokeWidth: 2, strokeDasharray: "5,5", stroke: "#87A7C0" },
    label: { text: "Drop sensors here.", fill: "#87A7C0" },
  },
});

// SCADA shapes
const shapesJSON: ScadaShape[] = [
  {
    uniqueKey: "tank",
    type: "standard.Rectangle",
    size: { width: 80, height: 100 },
    attrs: {
      body: {
        fill: "#A9A9A9",
        stroke: "#000000",
        strokeWidth: 2,
        rx: 5,
        ry: 5,
      },
      label: {
        text: "Tank",
        fill: "#000000",
        fontSize: 12,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        x: "calc(w/2)",
        y: "calc(h/2)",
      },
    },
    keywords: ["tank", "storage"],
    ports: [
      {
        id: "in",
        group: "in",
        attrs: { portBody: { magnet: true, fill: "#000000" } },
      },
      {
        id: "out",
        group: "out",
        attrs: { portBody: { magnet: true, fill: "#000000" } },
      },
    ],
  },
  {
    uniqueKey: "pump",
    type: "standard.Circle",
    size: { width: 50, height: 50 },
    attrs: {
      body: { fill: "#4682B4", stroke: "#000000", strokeWidth: 2 },
      label: {
        text: "Pump",
        fill: "#FFFFFF",
        fontSize: 12,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        x: "calc(w/2)",
        y: "calc(h/2)",
      },
    },
    keywords: ["pump", "motor"],
    ports: [
      {
        id: "in",
        group: "in",
        attrs: { portBody: { magnet: true, fill: "#000000" } },
      },
      {
        id: "out",
        group: "out",
        attrs: { portBody: { magnet: true, fill: "#000000" } },
      },
    ],
  },
  {
    uniqueKey: "valve",
    type: "standard.Path",
    size: { width: 40, height: 40 },
    attrs: {
      body: {
        d: "M 0 20 L 20 0 L 40 20 L 20 40 Z",
        fill: "#FF4500",
        stroke: "#000000",
        strokeWidth: 2,
      },
      label: {
        text: "Valve (closed)",
        fill: "#FFFFFF",
        fontSize: 12,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        x: "calc(w/2)",
        y: "calc(h/2)",
      },
      state: { status: "closed" },
    },
    keywords: ["valve", "control"],
    ports: [
      {
        id: "in",
        group: "in",
        attrs: { portBody: { magnet: true, fill: "#000000" } },
      },
      {
        id: "out",
        group: "out",
        attrs: { portBody: { magnet: true, fill: "#000000" } },
      },
    ],
  },
  {
    uniqueKey: "sensor",
    type: "standard.Ellipse",
    size: { width: 60, height: 40 },
    attrs: {
      body: { fill: "#FFD700", stroke: "#000000", strokeWidth: 2 },
      label: {
        text: "Sensor (0)",
        fill: "#000000",
        fontSize: 12,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        x: "calc(w/2)",
        y: "calc(h/2)",
      },
      state: { value: 0 },
    },
    keywords: ["sensor", "monitor"],
    ports: [
      {
        id: "out",
        group: "out",
        attrs: { portBody: { magnet: true, fill: "#000000" } },
      },
    ],
  },
];

const portGroups = {
  in: {
    position: { name: "left" },
    attrs: { portBody: { magnet: true, r: 6, fill: "#000000" } },
  },
  out: {
    position: { name: "right" },
    attrs: { portBody: { magnet: true, r: 6, fill: "#000000" } },
  },
};

shapesJSON.forEach((shape) => {
  shape.ports = shape.ports || [];
  shape.portMarkup = [{ tagName: "circle", selector: "portBody" }];
  shape.portGroups = portGroups;
  util.setByPath(shape, ["attrs", "root", "title"], String(shape.keywords));
  util.setByPath(shape, ["attrs", "root", "magnetSelector"], "body");
  util.setByPath(shape, ["attrs", "root", "highlighterSelector"], "body");
});

const shapesJSONMap: { [key: string]: ScadaShape } = {};
shapesJSON.forEach((shapeJSON, index) => {
  shapeJSON.uniqueKey = `scada_${index + 1}`;
  shapesJSONMap[shapeJSON.uniqueKey] = shapeJSON;
});

const Scada: React.FC = () => {
  const paperContainerRef = useRef<HTMLDivElement>(null);
  const stencilContainerRef = useRef<HTMLDivElement>(null);
  const toolbarContainerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<dia.Graph | null>(null);
  const paperRef = useRef<dia.Paper | null>(null);
  const stencilRef = useRef<ui.Stencil | null>(null);
  const placeholderPaperRef = useRef<dia.Paper | null>(null);
  const placeholderGraphRef = useRef<dia.Graph | null>(null);
  const toolbarRef = useRef<ui.Toolbar | null>(null);

  useEffect(() => {
    graphRef.current = new dia.Graph({}, { cellNamespace: shapes });

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
      defaultConnectionPoint: { name: "boundary", args: { selector: false } },
      defaultLink: () =>
        new shapes.standard.Link({
          attrs: {
            line: {
              stroke: "#00008B",
              strokeWidth: 4,
              sourceMarker: { type: "none" },
              targetMarker: {
                type: "path",
                d: "M -10 0 L 10 0",
                stroke: "#00008B",
                strokeWidth: 4,
              },
            },
          },
          router: { name: "orthogonal" },
          connector: { name: "rounded" },
        }),
      linkPinning: false,
      highlighting: {
        connecting: {
          name: "mask",
          options: { attrs: { stroke: "#0075f2", "stroke-width": 2 } },
        },
      },
    });

    if (paperContainerRef.current && paperRef.current) {
      paperContainerRef.current.appendChild(paperRef.current.el);
    }

    stencilRef.current = new ui.Stencil({
      paper: paperRef.current,
      usePaperGrid: true,
      width: 200,
      height: "100%",
      dropAnimation: true,
      paperOptions: () => ({
        model: new dia.Graph({}, { cellNamespace: shapes }),
        cellViewNamespace: shapes,
        background: { color: "#FFFFFF" },
        overflow: true,
      }),
      search: (cell: dia.Cell, keyword: string) => {
        if (keyword === "") return true;
        if (Placeholder.isPlaceholder(cell as dia.Element)) return true;
        const keywords = cell.get("keywords") || [];
        return keywords.some((kw: string) =>
          kw.toLowerCase().includes(keyword.toLowerCase())
        );
      },
      dragStartClone: (cell: dia.Cell) => {
        const dragClone = cell.clone() as dia.Element;
        dragClone.attr(["body", "fill"], "#dde6ed");
        dragClone.set("group", cell.graph.get("group"));
        return dragClone;
      },
      contentOptions: { useModelGeometry: true },
      canDrag: (
        cellView: dia.CellView,
        _evt: dia.Event,
        _groupName: string | null
      ) => {
        return (
          cellView instanceof dia.ElementView &&
          !Placeholder.isPlaceholder(cellView.model as dia.Element)
        );
      },
      layout: (graph: dia.Graph, group: StencilGroupType) => {
        const groupElements = graph.getElements();
        const layoutElements = groupElements.filter(
          (element) => !Placeholder.isPlaceholder(element)
        );
        const rowGap = 20;
        const layoutOptions: any = {
          columns: 2,
          rowHeight: "compact",
          columnWidth: 90,
          horizontalAlign: "middle",
          rowGap,
          marginY: rowGap,
        };
        if (groupElements.length !== layoutElements.length) {
          const { height: placeholderHeight } = equipmentPlaceholder.size();
          layoutOptions.marginY = placeholderHeight + 2 * rowGap;
        }
        layout.GridLayout.layout(layoutElements, layoutOptions);
      },
      groups: {
        [StencilGroup.Equipment]: { index: 1, label: "Equipment" },
        [StencilGroup.Sensors]: { index: 2, label: "Sensors" },
        [StencilGroup.SymbolShapes]: { index: 3, label: "Other Symbols" },
      },
    });

    stencilRef.current.render();
    if (stencilContainerRef.current && stencilRef.current) {
      stencilContainerRef.current.appendChild(stencilRef.current.el);
      const searchInput = stencilRef.current.el.querySelector(
        ".search"
      ) as HTMLInputElement | null;
      if (searchInput) {
        searchInput.setAttribute("placeholder", "Find SCADA components...");
      }
    }

    placeholderPaperRef.current = stencilRef.current.getPaper(
      StencilGroup.Equipment
    );
    placeholderGraphRef.current = stencilRef.current.getGraph(
      StencilGroup.Equipment
    );

    toolbarRef.current = new ui.Toolbar({
      tools: [
        {
          type: "button",
          name: "export-json",
          text: "Export JSON",
          attrs: {
            button: {
              className: "btn btn-sm btn-outline-primary mr-2",
            },
          },
        },
        {
          type: "button",
          name: "export-svg",
          text: "Export SVG",
          attrs: {
            button: {
              className: "btn btn-sm btn-outline-primary mr-2",
            },
          },
        },
        {
          type: "zoomToFit",
          name: "zoom-to-fit",
          attrs: {
            button: {
              className: "btn btn-sm btn-outline-primary mr-2",
            },
          },
        },
        "zoomToFit",
        "zoomSlider",
      ],
      references: { paperScroller: paperRef.current },
    });

    toolbarRef.current.render();

    if (toolbarContainerRef.current && toolbarRef.current) {
      console.log(
        "Appending toolbar to container:",
        toolbarContainerRef.current
      );
      toolbarContainerRef.current.appendChild(toolbarRef.current.el);
    }

    const setupEventHandlers = () => {
      if (
        !graphRef.current ||
        !paperRef.current ||
        !stencilRef.current ||
        !placeholderPaperRef.current ||
        !placeholderGraphRef.current ||
        !toolbarRef.current
      ) {
        return;
      }

      graphRef.current.on("add remove", (cell: dia.Cell) => {
        if (cell.isLink()) return;
        resetUsedShapes(graphRef.current!, stencilRef.current!);
      });
      graphRef.current.on("reset", () =>
        resetUsedShapes(graphRef.current!, stencilRef.current!)
      );

      placeholderGraphRef.current.on("reset", () => {
        addToolsToStencilGroup(
          stencilRef.current!,
          placeholderPaperRef.current!,
          placeholderGraphRef.current!.getElements()
        );
      });

      stencilRef.current.on(
        "filter",
        (filteredGraph: dia.Graph, group: StencilGroupType) => {
          if (group !== StencilGroup.Equipment) return;
          addToolsToStencilGroup(
            stencilRef.current!,
            placeholderPaperRef.current!,
            filteredGraph.getElements()
          );
        }
      );

      paperRef.current.on(
        "element:pointerclick",
        (elementView: dia.ElementView) => {
          paperRef.current!.removeTools();
          const element = elementView.model as dia.Element;
          if (element.get("uniqueKey") === "valve") {
            const currentStatus = element.attr("state/status") as string;
            element.attr(
              "state/status",
              currentStatus === "open" ? "closed" : "open"
            );
            element.attr(
              "label/text",
              `Valve (${element.attr("state/status")})`
            );
            element.attr(
              "body/fill",
              currentStatus === "open" ? "#32CD32" : "#FF4500"
            );
          }
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
        }
      );

      paperRef.current.on("blank:pointerdown", () => {
        paperRef.current!.removeTools();
      });

      const equipmentGroupEl = stencilRef.current.el.querySelector(
        `.group[data-name="${StencilGroup.Equipment}"]`
      ) as HTMLElement | null;
      stencilRef.current.on(
        "element:drag",
        (
          dragView: dia.ElementView,
          evt: dia.Event & { data: { save: boolean } },
          cloneArea: dia.BBox,
          validArea: boolean
        ) => {
          evt.data.save = false;
          highlighters.addClass.removeAll(
            placeholderPaperRef.current!,
            "hgl-favorite"
          );
          if (validArea) return;
          if (dragView.model.get("group") === StencilGroup.Equipment) return;
          if (stencilRef.current!.isGroupOpen(StencilGroup.Equipment)) {
            const placeholderArea =
              placeholderPaperRef.current!.clientToLocalRect(
                paperRef.current!.localToClientRect(cloneArea)
              );
            if (placeholderArea.intersect(equipmentPlaceholder.getBBox())) {
              evt.data.save = true;
              highlighters.addClass.add(
                equipmentPlaceholder.findView(placeholderPaperRef.current!),
                "root",
                "hgl-favorite"
              );
            }
          } else {
            if (evt.target.matches(".group-label")) {
              const groupEl = evt.target.closest(
                ".group"
              ) as HTMLElement | null;
              if (groupEl === equipmentGroupEl) {
                evt.data.save = true;
                equipmentGroupEl!.classList.add("groupHglFavorite");
                return;
              }
            }
            equipmentGroupEl!.classList.remove("groupHglFavorite");
          }
        }
      );

      stencilRef.current.on(
        "element:dragend",
        (
          dragView: dia.ElementView,
          evt: dia.Event & { data: { save: boolean } }
        ) => {
          equipmentGroupEl!.classList.remove("groupHglFavorite");
          highlighters.addClass.removeAll(placeholderPaperRef.current!);
          if (!evt.data.save) return;
          addFavoriteElement(
            dragView.model as dia.Element,
            stencilRef.current!
          );
          stencilRef.current!.cancelDrag({ dropAnimation: false });
        }
      );

      toolbarRef.current.on("export-json:pointerclick", () => {
        const graphJSON = graphRef.current!.toJSON();
        const blob = new Blob([JSON.stringify(graphJSON, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diagram.json";
        a.click();
        URL.revokeObjectURL(url);
      });

      toolbarRef.current.on("export-svg:pointerclick", () => {
        format.toSVG(
          paperRef.current!,
          (svg) => {
            util.downloadDataUri(
              `data:image/svg+xml,${encodeURIComponent(svg)}`,
              "joint-plus.svg"
            );
          },
          { useComputedStyles: false }
        );
      });
    };

    const resetUsedShapes = (graph: dia.Graph, stencil: ui.Stencil) => {
      const usedElementsKeys = Object.keys(
        util.groupBy(graph.getElements(), getElementUniqueKey)
      );
      const usedElements = [...mapUniqueKeysToShapes(usedElementsKeys)];
      stencil.load({ [StencilGroup.Equipment]: usedElements });
    };

    const getElementUniqueKey = (element: dia.Element): string =>
      element.get("uniqueKey") as string;

    const addFavoriteElement = (element: dia.Element, stencil: ui.Stencil) => {
      const favoriteShapeKeys = readFavoriteShapesUniqueKeys();
      const elementUniqueKey = getElementUniqueKey(element);
      if (favoriteShapeKeys.includes(elementUniqueKey)) return;
      const favoriteShapes = mapUniqueKeysToShapes([
        ...favoriteShapeKeys,
        elementUniqueKey,
      ]);
      stencil.load({
        [StencilGroup.Equipment]: [equipmentPlaceholder, ...favoriteShapes],
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
        [StencilGroup.Equipment]: [equipmentPlaceholder, ...favoriteShapes],
      });
      saveFavoriteShapes();
      refreshStencilSearch(stencil);
    };

    const saveFavoriteShapes = () => {
      const favoriteShapes = stencilRef
        .current!.getGraph(StencilGroup.Equipment)
        .getElements()
        .filter((element) => !Placeholder.isPlaceholder(element))
        .map((element) => element.get("uniqueKey") as string);
      localStorage.setItem("favoriteShapes", JSON.stringify(favoriteShapes));
    };

    const loadFavoriteShapes = () => {
      const favoriteShapes = mapUniqueKeysToShapes(
        readFavoriteShapesUniqueKeys()
      );
      stencilRef.current!.load({
        [StencilGroup.Equipment]: [equipmentPlaceholder, ...favoriteShapes],
      });
    };

    const readFavoriteShapesUniqueKeys = (): string[] =>
      JSON.parse(localStorage.getItem("favoriteShapes") || "[]");

    const mapUniqueKeysToShapes = (shapeUniqueKeys: string[]): ScadaShape[] =>
      shapeUniqueKeys
        .map((uniqueKey) => shapesJSONMap[uniqueKey])
        .filter(Boolean) as ScadaShape[];

    const refreshStencilSearch = (stencil: ui.Stencil) => {
      const searchInput = stencil.el.querySelector(
        ".search"
      ) as HTMLInputElement | null;
      if (searchInput) stencil.filter(searchInput.value);
    };

    const addToolsToStencilGroup = (
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

    stencilRef.current!.load({
      [StencilGroup.Equipment]: shapesJSON.filter((shape) =>
        ["tank", "pump", "valve"].includes(shape.uniqueKey)
      ),
      [StencilGroup.Sensors]: shapesJSON.filter((shape) =>
        ["sensor"].includes(shape.uniqueKey)
      ),
      [StencilGroup.SymbolShapes]: shapesJSON,
    });

    setupEventHandlers();
    resetUsedShapes(graphRef.current!, stencilRef.current!);
    loadFavoriteShapes();

    return () => {
      paperRef.current?.remove();
      stencilRef.current?.remove();
      toolbarRef.current?.remove();
    };
  }, []);

  return (
    <div className="diagram-container">
      <div ref={stencilContainerRef} id="stencil-container" />
      <div ref={paperContainerRef} id="paper-container">
        <div ref={toolbarContainerRef} id="toolbar" />
      </div>
    </div>
  );
};

export default Scada;
