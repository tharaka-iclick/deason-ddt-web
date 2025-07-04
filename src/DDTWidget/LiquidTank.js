import { dia, util } from "@joint/plus";

const LEVEL_FLAG = "LEVEl";

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

class LiquidTank extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "LiquidTank",
      size: {
        width: 160,
        height: 300,
      },
      attrs: {
        root: {
          magnetSelector: "body",
        },
        legs: {
          fill: "none",
          stroke: "#350100",
          strokeWidth: 8,
          strokeLinecap: "round",
          d: "M 20 calc(h) l -5 10 M calc(w - 20) calc(h) l 5 10",
        },
        body: {
          stroke: "gray",
          strokeWidth: 4,
          x: 0,
          y: 0,
          width: "calc(w)",
          height: "calc(h)",
          rx: 120,
          ry: 10,
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "gray" },
              { offset: "30%", color: "white" },
              { offset: "70%", color: "white" },
              { offset: "100%", color: "gray" },
            ],
          },
        },
        top: {
          x: 0,
          y: 20,
          width: "calc(w)",
          height: 20,
          fill: "none",
          stroke: "gray",
          strokeWidth: 2,
        },
        label: {
          text: "Tank 1",
          textAnchor: "middle",
          textVerticalAnchor: "top",
          x: "calc(w / 2)",
          y: "calc(h + 10)",
          fontSize: 14,
          fontFamily: "sans-serif",
          fill: "#350100",
        },
      },
    };
  }

  preinitialize() {
    this.markup = util.svg/* xml */ `
            <path @selector="legs"/>
            <rect @selector="body"/>
            <rect @selector="top"/>
            <text @selector="label" />
        `;
  }

  get level() {
    return this.get("level") || 0;
  }

  set level(level) {
    const newLevel = Math.max(0, Math.min(100, level));
    this.set("level", newLevel);
  }
}

const PanelView = dia.ElementView.extend({
  presentationAttributes: dia.ElementView.addPresentationAttributes({
    level: [LEVEL_FLAG],
    color: [LEVEL_FLAG],
  }),

  initFlag: [dia.ElementView.Flags.RENDER, LEVEL_FLAG],

  confirmUpdate(...args) {
    let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
    if (this.hasFlag(flags, LEVEL_FLAG)) {
      this.updateLevel();
      flags = this.removeFlag(flags, LEVEL_FLAG);
    }
    return flags;
  },

  updateLevel() {
    const { model } = this;
    const level = Math.max(0, Math.min(100, model.get("level") || 0));
    const color = model.get("color") || "red";
    const [liquidEl] = this.findBySelector("liquid");
    const [windowEl] = this.findBySelector("frame");
    const windowHeight = Number(windowEl.getAttribute("height"));
    const height = Math.round((windowHeight * level) / 100);
    liquidEl.animate(
      {
        height: [`${height}px`],
        fill: [color],
      },
      {
        fill: "forwards",
        duration: 1000,
      }
    );
  },
});

export { LiquidTank, PanelView };
