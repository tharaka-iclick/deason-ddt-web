import { dia, util } from "@joint/plus";
import { portsIn, portsOut } from "./generator-widget.js";

export class HandValve extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "HandValve",
      size: {
        width: 50,
        height: 50,
      },
      power: 0,
      attrs: {
        root: {
          magnetSelector: "body",
        },
        body: {
          rx: "calc(w / 2)",
          ry: "calc(h / 2)",
          cx: "calc(w / 2)",
          cy: "calc(h / 2)",
          stroke: "gray",
          strokeWidth: 2,
        },
        stem: {
          width: 10,
          height: 30,
          x: "calc(w / 2 - 5)",
          y: -30,
          stroke: "#333",
          strokeWidth: 2,
          fill: "#555",
        },
        handwheel: {
          width: 60,
          height: 10,
          x: "calc(w / 2 - 30)",
          y: -30,
          stroke: "#333",
          strokeWidth: 2,
          rx: 5,
          ry: 5,
          fill: "#666",
        },
        label: {
          text: "Valve",
          textAnchor: "middle",
          textVerticalAnchor: "top",
          x: "calc(0.5*w)",
          y: "calc(h+10)",
          fontSize: "14",
          fontFamily: "sans-serif",
          fill: "#350100",
        },
      },
      ports: {
        groups: {
          in: portsIn,
          out: portsOut,
          pipes: {
            position: {
              name: "absolute",
              args: {
                x: "calc(w / 2)",
                y: "calc(h / 2)",
              },
            },
            markup: util.svg`
              <rect @selector="pipeBody" />
              <rect @selector="pipeEnd" />
            `,
            size: { width: 50, height: 30 },
            attrs: {
              portRoot: {
                magnetSelector: "pipeEnd",
              },
              pipeBody: {
                width: "calc(w)",
                height: "calc(h)",
                y: "calc(h / -2)",
              },
              pipeEnd: {
                width: 10,
                height: "calc(h+6)",
                y: "calc(h / -2 - 3)",
                stroke: "gray",
                strokeWidth: 3,
              },
            },
          },
        },
        items: [
          {
            id: "left",
            group: "pipes",
            z: 0,
            attrs: {
              pipeBody: {
                x: "calc(-1 * w)",
              },
              pipeEnd: {
                x: "calc(-1 * w)",
              },
            },
          },
          {
            id: "right",
            group: "pipes",
            z: 0,
            attrs: {
              pipeEnd: {
                x: "calc(w - 10)",
              },
            },
          },
        ],
      },
    };
  }

  get power() {
    return Math.round(this.get("power") * 100);
  }

  preinitialize() {
    this.markup = util.svg/* xml */ `
      <ellipse @selector="body" />
      <rect @selector="stem" />
      <rect @selector="handwheel" />
      <text @selector="label" />
    `;
  }
}
