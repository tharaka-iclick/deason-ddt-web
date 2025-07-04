import { dia, util } from "@joint/plus";

const LIQUID_COLOR = "#0EAD69";

const r = 30;
const d = 10;
const l = (3 * r) / 4;
const step = 20;

class Zone extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "Zone",
      size: {
        width: 120,
        height: 40,
      },
      attrs: {
        body: {
          fill: "#ffffff",
          stroke: "#cad8e3",
          strokeWidth: 1,
          d: "M 0 calc(0.5*h) calc(0.5*h) 0 H calc(w) V calc(h) H calc(0.5*h) Z",
        },
        label: {
          fontSize: 14,
          fontFamily: "sans-serif",
          fontWeight: "bold",
          fill: LIQUID_COLOR,
          textVerticalAnchor: "middle",
          textAnchor: "middle",
          x: "calc(w / 2 + 10)",
          y: "calc(h / 2)",
        },
      },
    };
  }

  preinitialize() {
    this.markup = util.svg/* xml */ `
            <path @selector="body"/>
            <text @selector="label"/>
        `;
  }
}

export { Zone };
