import { dia, util } from "@joint/plus";

const POWER_FLAG = "POWER";
const LIGHT_FLAG = "LIGHT";
const FLOW_FLAG = "FLOW";
const OPEN_FLAG = "OPEN";

const LIQUID_COLOR = "#0EAD69";
const MAX_LIQUID_COLOR = "#ED2637";
const MIN_LIQUID_COLOR = "#FFD23F";
const START_LIQUID = 70;
const PRESSURE_COLOR = "#1446A0";
const MAX_PRESSURE_COLOR = "#ED2637";

const r = 30;
const d = 10;
const l = (3 * r) / 4;
const step = 20;

class ControlValve extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "ControlValve",
      size: {
        width: 60,
        height: 60,
      },
      open: 1,
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
          fill: {
            type: "radialGradient",
            stops: [
              { offset: "80%", color: "white" },
              { offset: "100%", color: "gray" },
            ],
          },
        },
        liquid: {
          // We use path instead of rect to make it possible to animate
          // the stroke-dasharray to show the liquid flow.
          d: "M calc(w / 2 + 12) calc(h / 2) h -24",
          stroke: LIQUID_COLOR,
          strokeWidth: 24,
          strokeDasharray: "3,1",
        },
        cover: {
          x: "calc(w / 2 - 12)",
          y: "calc(h / 2 - 12)",
          width: 24,
          height: 24,
          stroke: "#333",
          strokeWidth: 2,
          fill: "#fff",
        },
        coverFrame: {
          x: "calc(w / 2 - 15)",
          y: "calc(h / 2 - 15)",
          width: 30,
          height: 30,
          stroke: "#777",
          strokeWidth: 2,
          fill: "none",
          rx: 1,
          ry: 1,
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
        control: {
          d: "M 0 0 C 0 -30 60 -30 60 0 Z",
          transform: "translate(calc(w / 2 - 30), -20)",
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
          fontSize: 14,
          fontFamily: "sans-serif",
          fill: "#350100",
        },
      },
      ports: {
        groups: {
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
                fill: {
                  type: "linearGradient",
                  stops: [
                    { offset: "0%", color: "gray" },
                    { offset: "30%", color: "white" },
                    { offset: "70%", color: "white" },
                    { offset: "100%", color: "gray" },
                  ],
                  attrs: {
                    x1: "0%",
                    y1: "0%",
                    x2: "0%",
                    y2: "100%",
                  },
                },
              },
              pipeEnd: {
                width: 10,
                height: "calc(h+6)",
                y: "calc(h / -2 - 3)",
                stroke: "gray",
                strokeWidth: 3,
                fill: "white",
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

  preinitialize() {
    this.markup = util.svg/* xml */ `
          <rect @selector="stem" />
          <path @selector="control" />
          <ellipse @selector="body" />
          <rect @selector="coverFrame" />
          <path @selector="liquid" />
          <rect @selector="cover" />
          <text @selector="label" />
      `;
  }
}

const ControlValveView = dia.ElementView.extend({
  presentationAttributes: dia.ElementView.addPresentationAttributes({
    open: [OPEN_FLAG],
  }),

  initFlag: [dia.ElementView.Flags.RENDER, OPEN_FLAG],

  framePadding: 6,

  liquidAnimation: null,

  confirmUpdate(...args) {
    let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
    this.animateLiquid();
    if (this.hasFlag(flags, OPEN_FLAG)) {
      this.updateCover();
      flags = this.removeFlag(flags, OPEN_FLAG);
    }
    return flags;
  },

  updateCover() {
    const { model } = this;
    const opening = Math.max(0, Math.min(1, model.get("open") || 0));
    const [coverEl] = this.findBySelector("cover");
    const [coverFrameEl] = this.findBySelector("coverFrame");
    const frameWidth =
      Number(coverFrameEl.getAttribute("width")) - this.framePadding;
    const width = Math.round(frameWidth * (1 - opening));
    coverEl.animate(
      {
        width: [`${width}px`],
      },
      {
        fill: "forwards",
        duration: 200,
      }
    );
  },

  animateLiquid() {
    if (this.liquidAnimation) return;
    const [liquidEl] = this.findBySelector("liquid");
    this.liquidAnimation = liquidEl.animate(
      {
        // 24 matches the length of the liquid path
        strokeDashoffset: [0, 24],
      },
      {
        fill: "forwards",
        iterations: Infinity,
        duration: 3000,
      }
    );
  },
});

export { ControlValve, ControlValveView };
