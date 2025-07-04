// Pump.js
import { dia, util } from "@joint/core";

export const POWER_FLAG = "power";

export class Pump extends dia.Element {
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

  defaults() {
    return {
      ...super.defaults,
      type: "Pump",
      size: { width: 100, height: 100 },
      power: 1,
      attrs: {
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
        },
        rotor: {
          d: `M 0 0 V 30 l -5 -10 Z M 0 0 V -30 l 5 10 Z M 0 0 H 30 l -10 5 Z M 0 0 H -30 l 10 -5 Z`,
          stroke: "#222",
          strokeWidth: 3,
          fill: "#bbb",
        },
      },
    };
  }

  get power() {
    return this.get("power") || 0;
  }

  set power(value) {
    this.set("power", value);
  }
}

export const PumpView = dia.ElementView.extend({
  presentationAttributes: dia.ElementView.addPresentationAttributes({
    power: [POWER_FLAG],
  }),
  initFlag: [dia.ElementView.Flags.RENDER, POWER_FLAG],
  spinAnimation: null,

  confirmUpdate(...args) {
    let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
    if (this.hasFlag(flags, POWER_FLAG)) {
      this.togglePower();
      flags = this.removeFlag(flags, POWER_FLAG);
    }
    return flags;
  },

  getSpinAnimation() {
    if (this.spinAnimation) return this.spinAnimation;

    const [rotorEl] = this.findBySelector("rotor");
    if (!rotorEl) return;

    const keyframes = { transform: ["rotate(0deg)", "rotate(360deg)"] };
    this.spinAnimation = rotorEl.animate(keyframes, {
      duration: 1000,
      iterations: Infinity,
    });

    return this.spinAnimation;
  },

  togglePower() {
    const anim = this.getSpinAnimation();
    if (anim) {
      anim.playbackRate = this.model.power;
    }
  },
});
