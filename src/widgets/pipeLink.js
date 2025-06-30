import { dia, util } from "@joint/plus";

const LIQUID_COLOR = "#00f";
const FLOW_FLAG = "FLOW";

export class Pipe01 extends dia.Link {
  defaults() {
    return {
      ...super.defaults,
      type: "Pipe",
      z: -1,
      router: { name: "rightAngle" },
      flow: 1,
      attrs: {
        liquid: {
          connection: true,
          stroke: LIQUID_COLOR,
          strokeWidth: 10,
          strokeLinejoin: "round",
          strokeLinecap: "square",
          strokeDasharray: "10,20",
        },
        line: {
          connection: true,
          stroke: "#eee",
          strokeWidth: 10,
          strokeLinejoin: "round",
          strokeLinecap: "round",
        },
        outline: {
          connection: true,
          stroke: "#444",
          strokeWidth: 16,
          strokeLinejoin: "round",
          strokeLinecap: "round",
        },
      },
    };
  }

  preinitialize() {
    this.markup = util.svg`
            <path @selector="outline" fill="none"/>
            <path @selector="line" fill="none"/>
            <path @selector="liquid" fill="none"/>
        `;
  }

  get flow() {
    return this.get("flow") || 0;
  }

  set flow(value) {
    this.set("flow", value);
  }
}

export const PipeView01 = dia.LinkView.extend({
  presentationAttributes: dia.LinkView.addPresentationAttributes({
    flow: [FLOW_FLAG],
  }),

  initFlag: [...dia.LinkView.prototype.initFlag, FLOW_FLAG],

  flowAnimation: null,

  confirmUpdate(...args) {
    let flags = dia.LinkView.prototype.confirmUpdate.call(this, ...args);
    if (this.hasFlag(flags, FLOW_FLAG)) {
      this.updateFlow();
      flags = this.removeFlag(flags, FLOW_FLAG);
    }
    return flags;
  },

  getFlowAnimation() {
    let { flowAnimation } = this;
    if (flowAnimation) return flowAnimation;
    const [liquidEl] = this.findBySelector("liquid");
    const keyframes = { strokeDashoffset: [90, 0] };
    flowAnimation = liquidEl.animate(keyframes, {
      fill: "forwards",
      duration: 1000,
      iterations: Infinity,
    });
    this.flowAnimation = flowAnimation;
    return flowAnimation;
  },

  updateFlow() {
    const { model } = this;
    const flowRate = model.get("flow") || 0;
    this.getFlowAnimation().playbackRate = flowRate;
    const [liquidEl] = this.findBySelector("liquid");
    liquidEl.style.stroke = flowRate === 0 ? "#ccc" : LIQUID_COLOR;
  },
});

export const createPipe = (id) => {
  return new Pipe01({
    id: `pipe${id}`,
    attrs: {
      labels: [
        {
          attrs: {
            text: {
              text: ` Pipe ${id} `,
              fontFamily: "sans-serif",
              fontSize: 10,
            },
            rect: { fillOpacity: 0.9 },
          },
          position: { args: { keepGradient: true, ensureLegibility: true } },
        },
      ],
    },
  });
};
