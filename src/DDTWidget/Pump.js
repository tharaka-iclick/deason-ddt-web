import { dia, util } from "@joint/plus";

const POWER_FLAG = "POWER";

const r = 30;
const d = 10;
const l = (3 * r) / 4;

class Pump extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "Pump",
      size: {
        width: 100,
        height: 100,
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
          fill: "lightgray",
        },
        label: {
          text: "Pump",
          textAnchor: "middle",
          textVerticalAnchor: "top",
          x: "calc(0.5*w)",
          y: "calc(h+10)",
          fontSize: 14,
          fontFamily: "sans-serif",
          fill: "#350100",
        },
        rotorGroup: {
          transform: "translate(calc(w/2),calc(h/2))",
          event: "element:power:click",
          cursor: "pointer",
        },
        rotorFrame: {
          r: 40,
          fill: "#eee",
          stroke: "#666",
          strokeWidth: 2,
        },
        rotorBackground: {
          r: 34,
          fill: "#777",
          stroke: "#222",
          strokeWidth: 1,
          style: {
            transition: "fill 0.5s ease-in-out",
          },
        },
        rotor: {
          // d: `M ${a} ${a} ${b} ${r} -${b} ${r} -${a} ${a} -${r} ${b} -${r} -${b} -${a} -${a} -${b} -${r} ${b} -${r} ${a} -${a} ${r} -${b} ${r} ${b} Z`,
          d: `M 0 0 V ${r} l ${-d} ${-l} Z M 0 0 V ${-r} l ${d} ${l} Z M 0 0 H ${r} l ${-l} ${d} Z M 0 0 H ${-r} l ${l} ${-d} Z`,
          stroke: "#222",
          strokeWidth: 3,
          fill: "#bbb",
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
          pipes: {
            position: {
              name: "line",
              args: {
                start: { x: "calc(w / 2)", y: "calc(h)" },
                end: { x: "calc(w / 2)", y: 0 },
              },
            },
            markup: util.svg`
                            <rect @selector="pipeBody" />
                            <rect @selector="pipeEnd" />
                        `,
            size: { width: 80, height: 30 },
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
          in: {
            position: "left",
            position: {
              name: "line",
              args: {
                start: { x: "calc(w / 2)", y: "calc(h)" },
                end: { x: "calc(w / 2)", y: 0 },
              },
            },
            markup: util.svg`
                            <rect @selector="pipeBody" />
                            <rect @selector="pipeEnd" />
                        `,
            size: { width: 80, height: 30 },
            // label: { position: { name: "outside", args: { offset: 30 } } },
            z: 1,
            attrs: {
              portRoot: {
                magnet: "active", // Allow outgoing connections
              },
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
              pipeBody: {
                width: "calc(w)",
                height: "calc(h)",
                y: "calc(h / -2)",
                x: "calc(-1 * w)",
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
                x: "calc(-1 * w)",
                stroke: "gray",
                strokeWidth: 3,
                fill: "white",
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
            // label: { position: { name: "outside", args: { offset: 30 } } },
            position: {
              name: "line",
              args: {
                start: { x: "calc(w / 2)", y: "calc(h)" },
                end: { x: "calc(w / 2)", y: 0 },
              },
            },
            markup: util.svg`
                            <rect @selector="pipeBody" />
                            <rect @selector="pipeEnd" />
                        `,
            z: 0,
            size: { width: 80, height: 30 },
            attrs: {
              portRoot: {
                magnet: "active", // Allow outgoing connections
              },
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
                x: "calc(w - 10)",
                stroke: "gray",
                strokeWidth: 3,
                fill: "white",
              },
              portLabel: { fontFamily: "sans-serif", pointerEvents: "none" },
              portBody: {
                d: "M 0 -calc(0.5 * h) h calc(w) l 3 calc(0.5 * h) l -3 calc(0.5 * h) H 0 A calc(0.5 * h) calc(0.5 * h) 1 1 1 0 -calc(0.5 * h) Z",
                magnet: "active",
              },
            },
          },
        },
        items: [
          {
            id: "left",
            group: "pipes",
            z: 1,
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
            <ellipse @selector="body" />
            <g @selector="rotorGroup">
                <circle @selector="rotorFrame" />
                <circle @selector="rotorBackground" />
                <path @selector="rotor" />
            </g>
            <text @selector="label" />
        `;
  }

  get power() {
    return this.get("power") || 0;
  }

  set power(value) {
    this.set("power", value);
  }
}

const PumpView = dia.ElementView.extend({
  presentationAttributes: dia.ElementView.addPresentationAttributes({
    power: [POWER_FLAG],
  }),

  initFlag: [dia.ElementView.Flags.RENDER, POWER_FLAG],

  powerAnimation: null,

  confirmUpdate(...args) {
    let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
    if (this.hasFlag(flags, POWER_FLAG)) {
      this.togglePower();
      flags = this.removeFlag(flags, POWER_FLAG);
    }
    return flags;
  },

  getSpinAnimation() {
    let { spinAnimation } = this;
    if (spinAnimation) return spinAnimation;
    const [rotorEl] = this.findBySelector("rotor");
    // It's important to use start and end frames to make it work in Safari.
    const keyframes = { transform: ["rotate(0deg)", "rotate(360deg)"] };
    spinAnimation = rotorEl.animate(keyframes, {
      fill: "forwards",
      duration: 1000,
      iterations: Infinity,
    });
    this.spinAnimation = spinAnimation;
    return spinAnimation;
  },

  togglePower() {
    const { model } = this;
    this.getSpinAnimation().playbackRate = model.power;
  },
});

export { Pump, PumpView };
