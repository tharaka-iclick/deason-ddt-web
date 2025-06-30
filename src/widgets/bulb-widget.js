import { dia, util } from "@joint/plus";

const LIGHT_FLAG = "LIGHT";

export class Bulb extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "Bulb",
      size: {
        width: 28,
        height: 30,
      },
      attrs: {
        root: {
          magnetSelector: "glass",
        },
        cap1: {
          y: "calc(h + 1)",
          x: "calc(w / 2 - 6)",
          width: 12,
        },
        cap2: {
          y: "calc(h + 5)",
          x: "calc(w / 2 - 5)",
          width: 10,
        },
        cap: {
          fill: "#350100",
          height: 3,
        },
        glass: {
          fill: "#f1f5f7",
          stroke: "#659db3",
          refD: "M 14.01 0 C 3.23 0.01 -3.49 11.68 1.91 21.01 C 2.93 22.78 4.33 24.31 6.01 25.48 L 6.01 32 L 22.01 32 L 22.01 25.48 C 30.85 19.31 29.69 5.89 19.93 1.32 C 18.08 0.45 16.06 0 14.01 0 Z",
        },
        label: {
          textAnchor: "middle",
          textVerticalAnchor: "middle",
          x: "calc(w / 2)",
          y: "calc(h / 2)",
          fontSize: 7,
          fontFamily: "sans-serif",
          fill: "#350100",
        },
      },
    };
  }

  preinitialize() {
    this.markup = util.svg/* xml */ `
      <rect @selector="cap1" @group-selector="cap"/>
      <rect @selector="cap2" @group-selector="cap"/>
      <path @selector="glass"/>
      <text @selector="label" />
    `;
  }

  static create(watts = 100) {
    return new this({
      watts: watts,
      attrs: {
        label: {
          text: `${watts} W`,
        },
      },
    });
  }
}

export const BulbView = dia.ElementView.extend({
  presentationAttributes: dia.ElementView.addPresentationAttributes({
    light: [LIGHT_FLAG],
  }),

  initFlag: [dia.ElementView.Flags.RENDER, LIGHT_FLAG],

  spinAnimation: null,

  confirmUpdate(...args) {
    let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
    if (this.hasFlag(flags, LIGHT_FLAG)) {
      this.toggleLight();
      flags = this.removeFlag(flags, LIGHT_FLAG);
    }
    return flags;
  },

  getGlassAnimation() {
    let { glassAnimation } = this;
    if (glassAnimation) return glassAnimation;
    const [glassEl] = this.findBySelector("glass");
    const keyframes = {
      stroke: ["#edbc26"],
      fill: ["#f5e5b7"],
      strokeWidth: [2],
    };
    glassAnimation = glassEl.animate(keyframes, {
      fill: "forwards",
      duration: 500,
      iterations: 1,
    });
    this.glassAnimation = glassAnimation;
    return glassAnimation;
  },

  toggleLight() {
    const { model } = this;
    const state = model.get("light") ? 1 : -1;
    this.getGlassAnimation().playbackRate = state;
  },
});
