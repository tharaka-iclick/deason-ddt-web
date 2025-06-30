import { dia, util } from "@joint/plus";

const POWER_FLAG = "POWER";
const a = 3;
const b = 4;
const r = 16;

// Port configurations
export const portsIn = {
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

export const portsOut = {
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

export class Generator extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "Generator",
      size: {
        width: 60,
        height: 80,
      },
      power: 0,
      attrs: {
        root: {
          magnetSelector: "body",
        },
        body: {
          width: "calc(w)",
          height: "calc(h)",
          stroke: "#7f4439",
          strokeWidth: 2,
          fill: "#945042",
          rx: 5,
          ry: 5,
        },
        label: {
          text: "Generator",
          textAnchor: "middle",
          textVerticalAnchor: "top",
          x: "calc(0.5*w)",
          y: "calc(h+10)",
          fontSize: "14",
          fontFamily: "sans-serif",
          fill: "#350100",
        },
        generatorGroup: {
          transform: "translate(calc(w/2),calc(h/2))",
          event: "element:power:click",
          cursor: "pointer",
        },
        generatorBackground: {
          r: 24,
          fill: "#350100",
          stroke: "#a95b4c",
          strokeWidth: 2,
        },
        generator: {
          d: `M ${a} ${a} ${b} ${r} -${b} ${r} -${a} ${a} -${r} ${b} -${r} -${b} -${a} -${a} -${b} -${r} ${b} -${r} ${a} -${a} ${r} -${b} ${r} ${b} Z`,
          stroke: "#a95b4c",
          strokeWidth: 2,
          fill: "#c99287",
        },
      },
      ports: {
        groups: {
          in: portsIn,
          out: portsOut,
        },
      },
    };
  }

  get power() {
    return Math.round(this.get("power") * 100);
  }

  preinitialize() {
    this.markup = util.svg/* xml */ `
      <rect @selector="body" />
      <g @selector="generatorGroup">
          <circle @selector="generatorBackground" />
          <path @selector="generator" />
      </g>
      <text @selector="label" />
    `;
  }
}

export const GeneratorView = dia.ElementView.extend({
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
    const [generatorEl] = this.findBySelector("generator");
    const keyframes = { transform: ["rotate(0deg)", "rotate(360deg)"] };
    spinAnimation = generatorEl.animate(keyframes, {
      fill: "forwards",
      duration: 1000,
      iterations: Infinity,
    });
    this.spinAnimation = spinAnimation;
    return spinAnimation;
  },

  togglePower() {
    const { model } = this;
    const playbackRate = model.get("power");
    this.getSpinAnimation().playbackRate = playbackRate;
  },
});
