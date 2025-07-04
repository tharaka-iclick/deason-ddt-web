import { dia, util } from "@joint/plus";

const MIN_LIQUID_COLOR = "#FFD23F";

const r = 30;
const d = 10;
const l = (3 * r) / 4;
const step = 20;

class Panel extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "Panel",
      size: {
        width: 100,
        height: 230,
      },
      level: 0,
      attrs: {
        root: {
          magnetSelector: "panelBody",
        },
        panelBody: {
          x: 0,
          y: 0,
          width: "calc(w)",
          height: "calc(h)",
          rx: 1,
          ry: 1,
          fill: "lightgray",
          stroke: "gray",
          strokeWidth: 1,
        },
        panelWindow: {
          // turn the panel over so that we can grow the liquid from the bottom
          // by increasing the height of the bar.
          transform: "translate(10, 10) rotate(180) translate(-40,-205)",
        },
        panelTicks: {
          transform: "translate(55, 15)",
          d: `M 0 0 h 8 M 0 ${step} h 8 M 0 ${step * 2} h 8 M 0 ${
            step * 3
          } h 8 M 0 ${step * 4} h 8 M 0 ${step * 5} h 8 M 0 ${
            step * 6
          } h 8 M 0 ${step * 7} h 8 M 0 ${step * 8} h 8 M 0 ${
            step * 9
          } h 8 M 0 ${step * 10} h 8`,
          fill: "none",
          stroke: "black",
          strokeWidth: 2,
          strokeLinecap: "round",
        },
        panelValues: {
          text: "100\n90\n80\n70\n60\n50\n40\n30\n20\n10\n0",
          textAnchor: "middle",
          textVerticalAnchor: "top",
          x: 80,
          y: 10,
          lineHeight: step,
          fontSize: 14,
          fontFamily: "sans-serif",
        },
        frame: {
          width: 40,
          height: 200,
          rx: 1,
          ry: 1,
          fill: "none",
          stroke: "black",
          strokeWidth: 3,
        },
        liquid: {
          x: 0,
          y: 0,
          width: 40,
          height: 0,
          stroke: "black",
          strokeWidth: 2,
          strokeOpacity: 0.2,
          fill: MIN_LIQUID_COLOR,
        },
        glass: {
          x: 0,
          y: 0,
          width: 40,
          height: 200,
          fill: "blue",
          stroke: "none",
          fillOpacity: 0.1,
        },
        label: {
          text: "Tank 1",
          textAnchor: "middle",
          textVerticalAnchor: "top",
          x: "calc(w / 2)",
          y: "calc(h + 10)",
          fontSize: 20,
          fontFamily: "sans-serif",
          fill: "#350100",
        },
      },
    };
  }

  preinitialize() {
    this.markup = util.svg/* xml */ `
            <rect @selector="panelBody"/>
            <path @selector="panelTicks"/>
            <text @selector="panelValues" />
            <g @selector="panelWindow">
                <rect @selector="glass"/>
                <rect @selector="liquid"/>
                <rect @selector="frame"/>
            </g>
      `;
  }
}

export { Panel };
