import { dia, util } from "@joint/plus";

const FLOW_FLAG = "FLOW";

const LIQUID_COLOR = "#0EAD69";
const r = 30;
const d = 10;
const l = (3 * r) / 4;
const step = 20;

class Pipe extends dia.Link {
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
    this.markup = util.svg/* xml */ `
            <path @selector="outline" fill="none"/>
            <path @selector="line" fill="none"/>
            <path @selector="liquid" fill="none"/>
        `;
  }
}

const PipeView = dia.LinkView.extend({
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
    // stroke-dashoffset = sum(stroke-dasharray) * n;
    // 90 = 10 + 20 + 10 + 20 + 10 + 20
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
    liquidEl.style.stroke = flowRate === 0 ? "#ccc" : "";
  },
});

export { Pipe, PipeView };
