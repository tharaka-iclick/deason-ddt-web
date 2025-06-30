import { dia, linkTools } from "@joint/plus";

export class Shape extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "Shape",
      size: { width: 140, height: 140 },
      attrs: {
        root: { magnet: false },
        background: {
          fill: "#0057ff",
          width: "calc(w)",
          height: "calc(h)",
          opacity: 0.1,
        },
        body: {
          stroke: "#333333",
          fill: "#fff",
          strokeWidth: 2,
          d: "M 0 0 H calc(w) V calc(h) H 0 Z M 20 20 V calc(h-20) H calc(w-20) V 20 Z",
        },
        label: {
          x: "calc(0.5 * w)",
          y: "calc(h - 10)",
          textAnchor: "middle",
          textVerticalAnchor: "middle",
          fontSize: 13,
          fontFamily: "sans-serif",
        },
      },
      portMarkup: [
        {
          tagName: "path",
          selector: "portBody",
          attributes: {
            fill: "#FFFFFF",
            stroke: "#333333",
            "stroke-width": 2,
          },
        },
      ],
      portLabelMarkup: [
        { tagName: "rect", selector: "portLabelBackground" },
        {
          tagName: "text",
          selector: "portLabel",
          attributes: { fill: "#333333" },
        },
      ],
      ports: {
        groups: {
          in: {
            position: "left",
            label: { position: { name: "outside", args: { offset: 30 } } },
            size: { width: 20, height: 20 },
            attrs: {
              portLabelBackground: {
                ref: "portLabel",
                fill: "#FFFFFF",
                fillOpacity: 0.7,
                x: "calc(x - 2)",
                y: "calc(y - 2)",
                width: "calc(w + 4)",
                height: "calc(h + 4)",
                pointerEvents: "none",
              },
              portLabel: { fontFamily: "sans-serif", pointerEvents: "none" },
              portBody: {
                d: "M 0 -calc(0.5 * h) h -calc(w) l 3 calc(0.5 * h) l -3 calc(0.5 * h) H 0 A calc(0.5 * h) calc(0.5 * h) 1 1 0 0 -calc(0.5 * h) Z",
                magnet: "active",
              },
            },
          },
          out: {
            position: "right",
            label: { position: { name: "outside", args: { offset: 30 } } },
            size: { width: 20, height: 20 },
            attrs: {
              portLabelBackground: {
                ref: "portLabel",
                fill: "#FFFFFF",
                fillOpacity: 0.8,
                x: "calc(x - 2)",
                y: "calc(y - 2)",
                width: "calc(w + 4)",
                height: "calc(h + 4)",
                pointerEvents: "none",
              },
              portLabel: { fontFamily: "sans-serif", pointerEvents: "none" },
              portBody: {
                d: "M 0 -calc(0.5 * h) h calc(w) l 3 calc(0.5 * h) l -3 calc(0.5 * h) H 0 A calc(0.5 * h) calc(0.5 * h) 1 1 1 0 -calc(0.5 * h) Z",
                magnet: "active",
              },
            },
          },
        },
      },
    };
  }

  preinitialize() {
    this.markup = [
      { tagName: "rect", selector: "background" },
      { tagName: "path", selector: "body" },
      { tagName: "text", selector: "label" },
    ];
  }
}

export class PortTargetArrowhead extends linkTools.TargetArrowhead {
  preinitialize() {
    this.tagName = "rect";
    this.attributes = {
      width: 20,
      height: 14,
      x: 6,
      y: -7,
      rx: 7,
      ry: 7,
      fill: "#FD0B88",
      "fill-opacity": 0.2,
      stroke: "#FD0B88",
      "stroke-width": 2,
      cursor: "move",
      class: "target-arrowhead",
    };
  }
}

export const createShapes = () => {
  const s1 = new Shape({
    id: "element1",
    position: { x: 50, y: 50 },
    attrs: { label: { text: "Element 1" } },
    ports: {
      items: [
        { id: "out1", group: "out", attrs: { portLabel: { text: "Out 1" } } },
        { id: "out2", group: "out", attrs: { portLabel: { text: "Out 2" } } },
        { id: "out3", group: "out", attrs: { portLabel: { text: "Out 3" } } },
      ],
    },
  });

  const s2 = new Shape({
    id: "element2",
    position: { x: 380, y: 50 },
    attrs: { label: { text: "Element 2" } },
    ports: {
      items: [
        { id: "in1", group: "in", attrs: { portLabel: { text: "In 1" } } },
        { id: "in2", group: "in", attrs: { portLabel: { text: "In 2" } } },
        { id: "in3", group: "in", attrs: { portLabel: { text: "In 3" } } },
        { id: "in4", group: "in", attrs: { portLabel: { text: "In 4" } } },
        { id: "out1", group: "out", attrs: { portLabel: { text: "Out 1" } } },
      ],
    },
  });

  const s3 = new Shape({
    id: "element3",
    position: { x: 380, y: 270 },
    attrs: {
      label: {
        text: "Element 3",
      },
    },
    ports: {
      items: [
        {
          id: "in1",
          group: "in",
          attrs: {
            portLabel: {
              text: "In 1",
            },
          },
        },
        {
          id: "in2",
          group: "in",
          attrs: {
            portLabel: {
              text: "In 2",
            },
          },
        },
      ],
    },
  });

  return [s1, s2, s3];
};
