import React, { useEffect, useRef, useState } from "react";
import {
  dia,
  ui,
  shapes,
  util,
  layout,
  highlighters,
  elementTools,
  format,
} from "@joint/plus";
import "./App.scss";

// Define StencilGroup constants
const StencilGroup = {
  Equipment: "equipment",
  Sensors: "sensors",
  SymbolShapes: "symbol-shapes",
} as const;

const r = 16;
const a = 3;
const b = 4;

const POWER_FLAG = "POWER";
const LIGHT_FLAG = "LIGHT";

// import { Placeholder, equipmentPlaceholder, sensorsPlaceholder } from "./components/";

type StencilGroupType = (typeof StencilGroup)[keyof typeof StencilGroup];

// Interface for SCADA shape configuration
interface ScadaShape {
  uniqueKey: string;
  type: string;
  size: { width: number; height: number };
  attrs: {
    body?: { [key: string]: any };
    label?: { [key: string]: any };
    state?: { [key: string]: any };
    root?: { [key: string]: any };
  };
  keywords: string[];
  ports?: Array<{
    id: string;
    group: string;
    attrs: { portBody: { magnet: boolean; fill: string } };
  }>;
  portMarkup?: Array<{ tagName: string; selector: string }>;
  portGroups?: {
    [key: string]: {
      position: { name: string };
      attrs: { portBody: { magnet: boolean; r: number; fill: string } };
    };
  };
}

const d = 10;
const l = (3 * r) / 4;
const step = 20;

class ConicTank extends dia.Element {
  defaults(): dia.Element.Attributes {
    return {
      ...super.defaults,
      type: "ConicTank",
      size: {
        width: 160,
        height: 100,
      },
      attrs: {
        root: {
          magnetSelector: "body",
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
        bottom: {
          d: "M 0 0 L calc(w) 0 L calc(w / 2 + 10) 70 h -20 Z",
          transform: "translate(0, calc(h - 10))",
          stroke: "gray",
          strokeLinejoin: "round",
          strokeWidth: 2,
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "10%", color: "#aaa" },
              { offset: "30%", color: "#fff" },
              { offset: "90%", color: "#aaa" },
            ],
            attrs: {
              gradientTransform: "rotate(-10)",
            },
          },
        },
        label: {
          text: "Tank 2",
          textAnchor: "middle",
          textVerticalAnchor: "bottom",
          x: "calc(w / 2)",
          y: -10,
          fontSize: 14,
          fontFamily: "sans-serif",
          fill: "#350100",
        },
      },
    };
  }

  preinitialize() {
    this.markup = util.svg/* xml */ `
          <path @selector="bottom"/>
          <rect @selector="body"/>
          <rect @selector="top"/>
          <text @selector="label" />
      `;
  }
}

class Pump extends dia.Element {
  defaults(): dia.Element.Attributes {
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
            // size: { width: 80, height: 30 },
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

  confirmUpdate(...args: [number, any]): any {
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

class HandValve extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "HandValve",
      size: {
        width: 50,
        height: 50,
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
        handwheel: {
          width: 60,
          height: 10,
          x: "calc(w / 2 - 30)",
          y: -30,
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
          fontSize: "14",
          fontFamily: "sans-serif",
          fill: "#350100",
        },
      },
      ports: {
        groups: {
          in: portsIn,
          out: portsOut,
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
              },
              pipeEnd: {
                width: 10,
                height: "calc(h+6)",
                y: "calc(h / -2 - 3)",
                stroke: "gray",
                strokeWidth: 3,
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

class Generator extends dia.Element {
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

const GeneratorView = dia.ElementView.extend({
  presentationAttributes: dia.ElementView.addPresentationAttributes({
    power: [POWER_FLAG],
  }),

  initFlag: [dia.ElementView.Flags.RENDER, POWER_FLAG],

  powerAnimation: null,

  confirmUpdate(...args: [number, any]): number {
    let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
    if (this.hasFlag(flags, POWER_FLAG)) {
      this.togglePower();
      flags = this.removeFlag(flags, POWER_FLAG);
    }
    return flags;
  },

  getSpinAnimation() {
    let { spinAnimation } = this;
    if (spinAnimation) {
      console.log("Returning existing animation:", spinAnimation);
      return spinAnimation;
    }
    const [generatorEl] = this.findBySelector("generator");
    console.log("Generator element:", generatorEl);
    if (!generatorEl) {
      console.error("Generator element not found");
      return null;
    }
    const keyframes = [
      { transform: "rotate(0deg)" },
      { transform: "rotate(360deg)" },
    ];
    spinAnimation = generatorEl.animate(keyframes, {
      fill: "forwards",
      duration: 1000,
      iterations: Infinity,
    });
    this.spinAnimation = spinAnimation;
    console.log("New animation created:", spinAnimation);
    return spinAnimation;
  },

  togglePower() {
    const { model } = this;
    const playbackRate = model.get("power");
    this.getSpinAnimation().playbackRate = playbackRate;
  },
});

const portsIn = {
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

const portsOut = {
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

class Bulb extends dia.Element {
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

const BulbView = dia.ElementView.extend({
  presentationAttributes: dia.ElementView.addPresentationAttributes({
    light: [LIGHT_FLAG],
  }),

  initFlag: [dia.ElementView.Flags.RENDER, LIGHT_FLAG],

  spinAnimation: null,

  confirmUpdate(...args: [number, any]): number {
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

class Wire extends dia.Link {
  defaults() {
    return {
      ...super.defaults,
      type: "Wire",
      //   z: -1,
      attrs: {
        line: {
          connection: true,
          stroke: "#346f83",
          strokeWidth: 2,
          strokeLinejoin: "round",
          strokeLinecap: "round",
        },
        outline: {
          connection: true,
          stroke: "#004456",
          strokeWidth: 4,
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
        `;
  }
}

const StatusEffect = dia.HighlighterView.extend({
  UPDATE_ATTRIBUTES: ["power"],
  tagName: "circle",
  attributes: {
    r: 5,
    stroke: "white",
    event: "element:power:click",
    cursor: "pointer",
  },
  highlight: function (cellView: any) {
    const { vel } = this;
    const { model } = cellView;
    const { width, height } = model.size();
    const power = model.get("power");
    vel.attr("fill", power === 0 ? "#ed4912" : "#65b374");
    vel.attr("cx", width - 10);
    vel.attr("cy", height - 10);
  },
});

const PlaybackRateEffect = dia.HighlighterView.extend({
  UPDATE_ATTRIBUTES: ["power"],
  tagName: "text",
  attributes: {
    r: 5,
    fill: "white",
    "font-size": 7,
    "font-family": "sans-serif",
    "text-anchor": "end",
  },
  highlight: function (cellView: any) {
    const { vel } = this;
    const { model } = cellView;
    const { width, height } = model.size();
    const { power } = model;
    let text;
    switch (power) {
      case 0:
        text = "Off";
        break;
      case 100:
        text = "On";
        break;
      case 400:
        text = "Max";
        break;
      default:
        text = `${power} %`;
    }
    vel.attr("x", width - 18);
    vel.attr("y", height - 5);
    vel.text(text, { textVerticalAnchor: "bottom" });
  },
});

// Placeholder class
class Placeholder extends dia.Element {
  defaults(): dia.Element.Attributes {
    return {
      ...super.defaults,
      type: "Placeholder",
      position: { x: 10, y: 10 },
      attrs: {
        root: {},
        body: {
          class: "jjPlaceholderBody",
          fill: "transparent",
          x: 0,
          y: 0,
          width: "calc(w)",
          height: "calc(h)",
        },
        label: {
          class: "jjPlaceholderLabel",
          fontSize: 14,
          fontFamily: "sans-serif",
          textVerticalAnchor: "middle",
          textAnchor: "middle",
          x: "calc(w/2)",
          y: "calc(h/2)",
        },
      },
    };
  }

  static isPlaceholder(element: dia.Element): boolean {
    return element.get("type") === "Placeholder";
  }

  preinitialize() {
    this.markup = [
      { tagName: "rect", selector: "body" },
      { tagName: "text", selector: "label" },
    ];
  }
}

// Placeholder instances
const equipmentPlaceholder = new Placeholder({
  size: { width: 200, height: 80 },
  attrs: {
    body: { strokeWidth: 2, strokeDasharray: "5,5", stroke: "#87A7C0" },
    label: { text: "Drop equipment here.", fill: "#87A7C0" },
  },
});

const sensorsPlaceholder = new Placeholder({
  size: { width: 200, height: 80 },
  attrs: {
    body: { strokeWidth: 2, strokeDasharray: "5,5", stroke: "#87A7C0" },
    label: { text: "Drop sensors here.", fill: "#87A7C0" },
  },
});

// SCADA shapes
const shapesJSON: ScadaShape[] = [
  {
    uniqueKey: "tank",
    type: "standard.Rectangle",
    size: { width: 80, height: 100 },
    attrs: {
      body: {
        fill: "#A9A9A9",
        stroke: "#000000",
        strokeWidth: 2,
        rx: 5,
        ry: 5,
      },
      label: {
        text: "Tank",
        fill: "#000000",
        fontSize: 12,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        x: "calc(w/2)",
        y: "calc(h/2)",
      },
    },
    keywords: ["tank", "storage"],
    ports: [
      {
        id: "in",
        group: "in",
        attrs: { portBody: { magnet: true, fill: "#000000" } },
      },
      {
        id: "out",
        group: "out",
        attrs: { portBody: { magnet: true, fill: "#000000" } },
      },
    ],
  },
  // {
  //   uniqueKey: "pump",
  //   type: "standard.Circle",
  //   size: { width: 50, height: 50 },
  //   attrs: {
  //     body: { fill: "#4682B4", stroke: "#000000", strokeWidth: 2 },
  //     label: {
  //       text: "Pump",
  //       fill: "#FFFFFF",
  //       fontSize: 12,
  //       textAnchor: "middle",
  //       textVerticalAnchor: "middle",
  //       x: "calc(w/2)",
  //       y: "calc(h/2)",
  //     },
  //   },
  //   keywords: ["pump", "motor"],
  //   ports: [
  //     {
  //       id: "in",
  //       group: "in",
  //       attrs: { portBody: { magnet: true, fill: "#000000" } },
  //     },
  //     {
  //       id: "out",
  //       group: "out",
  //       attrs: { portBody: { magnet: true, fill: "#000000" } },
  //     },
  //   ],
  // },
  {
    uniqueKey: "valve",
    type: "standard.Path",
    size: { width: 40, height: 40 },
    attrs: {
      body: {
        d: "M 0 20 L 20 0 L 40 20 L 20 40 Z",
        fill: "#FF4500",
        stroke: "#000000",
        strokeWidth: 2,
      },
      label: {
        text: "Valve (closed)",
        fill: "#FFFFFF",
        fontSize: 12,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        x: "calc(w/2)",
        y: "calc(h/2)",
      },
      state: { status: "closed" },
    },
    keywords: ["valve", "control"],
    ports: [
      {
        id: "in",
        group: "in",
        attrs: { portBody: { magnet: true, fill: "#000000" } },
      },
      {
        id: "out",
        group: "out",
        attrs: { portBody: { magnet: true, fill: "#000000" } },
      },
    ],
  },
  {
    uniqueKey: "sensor",
    type: "standard.Ellipse",
    size: { width: 60, height: 40 },
    attrs: {
      body: { fill: "#FFD700", stroke: "#000000", strokeWidth: 2 },
      label: {
        text: "Sensor (0)",
        fill: "#000000",
        fontSize: 12,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        x: "calc(w/2)",
        y: "calc(h/2)",
      },
      state: { value: 0 },
    },
    keywords: ["sensor", "monitor"],
    ports: [
      {
        id: "out",
        group: "out",
        attrs: { portBody: { magnet: true, fill: "#000000" } },
      },
    ],
  },
];

const portGroups = {
  in: {
    position: { name: "left" },
    attrs: { portBody: { magnet: true, r: 6, fill: "#000000" } },
  },
  out: {
    position: { name: "right" },
    attrs: { portBody: { magnet: true, r: 6, fill: "#000000" } },
  },
};

shapesJSON.forEach((shape) => {
  shape.ports = shape.ports || [];
  shape.portMarkup = [{ tagName: "circle", selector: "portBody" }];
  shape.portGroups = portGroups;
  util.setByPath(shape, ["attrs", "root", "title"], String(shape.keywords));
  util.setByPath(shape, ["attrs", "root", "magnetSelector"], "body");
  util.setByPath(shape, ["attrs", "root", "highlighterSelector"], "body");
});

const shapesJSONMap: { [key: string]: ScadaShape } = {};
shapesJSON.forEach((shapeJSON, index) => {
  shapeJSON.uniqueKey = `scada_${index + 1}`;
  shapesJSONMap[shapeJSON.uniqueKey] = shapeJSON;
});

const Scada_02: React.FC = () => {
  const paperContainerRef = useRef<HTMLDivElement>(null);
  const stencilContainerRef = useRef<HTMLDivElement>(null);
  const toolbarContainerRef = useRef<HTMLDivElement>(null);
  const playbackRateEl = useRef<HTMLDivElement | any>(null);
  const playbackRateOutputEl = useRef<HTMLDivElement>(null);
  const graphRef = useRef<dia.Graph | null>(null);
  const paperRef = useRef<dia.Paper | null>(null);
  const stencilRef = useRef<ui.Stencil | null>(null);
  const placeholderPaperRef = useRef<dia.Paper | null>(null);
  const placeholderGraphRef = useRef<dia.Graph | null>(null);
  const toolbarRef = useRef<ui.Toolbar | null>(null);

  const [powerLevel, setPowerLevel] = useState(1);
  const [generator, setGenerator] = useState<any>(null);
  const generatorRef = useRef(null);

  useEffect(() => {
    const namespace = {
      ...shapes,
      Generator,
      GeneratorView,
      Bulb,
      BulbView,
      Wire,
      HandValve,
      Pump,
      PumpView,
      StatusEffect,
      PlaybackRateEffect,
    };
    graphRef.current = new dia.Graph({}, { cellNamespace: namespace });

    paperRef.current = new dia.Paper({
      model: graphRef.current,
      cellViewNamespace: shapes,
      width: "100%",
      height: "100%",
      gridSize: 1,
      //   async: true,
      clickThreshold: 10,
      defaultElementView: GeneratorView,
      sorting: dia.Paper.sorting.APPROX,
      background: { color: "#dde6ed" },
      defaultConnectionPoint: { name: "boundary", args: { selector: false } },
      defaultLink: () => new Wire(),
      linkPinning: false,
      highlighting: {
        connecting: {
          name: "mask",
          options: { attrs: { stroke: "#0075f2", "stroke-width": 2 } },
        },
      },
    });

    paperContainerRef.current!.appendChild(paperRef.current.el);

    paperRef.current.on("element:power:click", ({ model }, evt) => {
      evt.stopPropagation();
      const playbackRate = model.get("power") ? 0 : 1;
      setPlaybackRate(playbackRate);
    });

    paperContainerRef.current!.addEventListener("input", ({ target }) => {
      const playbackRate = parseFloat((target as any).value);
      setPlaybackRate(playbackRate);
    });

    function setPlaybackRate(playbackRate: any) {
      generator.set("power", playbackRate);
      setPowerLevel(playbackRate);
      // (playbackRateEl as any).value = playbackRate;
      // (playbackRateOutputEl as any).textContent = `${playbackRate} x`;
    }

    const pump1 = new Pump({
      position: { x: 50, y: 50 },
      attrs: {
        label: {
          text: "Pump 1",
        },
      },
    });

    pump1.addTo(graphRef.current);
    pump1.power = 1;

    const generator = new Generator({
      position: { x: 50, y: 50 },
    });

    const HandValve01 = new HandValve({
      position: { x: 50, y: 50 },
    });

    const bulb1 = Bulb.create(100).position(150, 45);

    const bulb2 = Bulb.create(40).position(150, 105);

    const wire1 = new Wire({
      source: { id: generator.id },
      target: { id: bulb1.id },
    });

    const wire2 = new Wire({
      source: { id: generator.id },
      target: { id: bulb2.id },
    });

    const tank2 = new ConicTank({
      position: { x: 40, y: 40 },
    });

    tank2.addTo(graphRef.current);

    const portsIn = {
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

    const portsOut = {
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

    HandValve01.addPorts([
      { group: "in", attrs: { label: { text: "in1" } } },
      { group: "in", attrs: { label: { text: "in2" } } },
      { group: "out", attrs: { label: { text: "out" } } },
    ]);

    graphRef.current.addCells([
      generator,
      bulb1,
      bulb2,
      wire1,
      wire2,
      HandValve01,
    ]);

    StatusEffect.add(generator.findView(paperRef.current), "root", "status");

    PlaybackRateEffect.add(
      generator.findView(paperRef.current),
      "root",
      "playback-rate"
    );

    paperRef.current.scale(4);
    setPlaybackRate(4);

    graphRef.current.on("change:power", (el) =>
      toggleLights(graphRef.current, el)
    );

    function toggleLights(graphRef: any, el: any) {
      graphRef.getNeighbors(el, { outbound: true }).forEach((bulb: any) => {
        bulb.set("light", el.power >= bulb.get("watts"));
      });
    }

    toggleLights(graphRef.current, generator);

    if (paperContainerRef.current && paperRef.current) {
      paperContainerRef.current.appendChild(paperRef.current.el);
    }

    stencilRef.current = new ui.Stencil({
      paper: paperRef.current,
      usePaperGrid: true,
      width: 200,
      height: "100%",
      dropAnimation: true,
      paperOptions: () => ({
        model: new dia.Graph({}, { cellNamespace: shapes }),
        cellViewNamespace: shapes,
        background: { color: "#FFFFFF" },
        overflow: true,
      }),
      search: (cell: dia.Cell, keyword: string) => {
        if (keyword === "") return true;
        if (Placeholder.isPlaceholder(cell as dia.Element)) return true;
        const keywords = cell.get("keywords") || [];
        return keywords.some((kw: string) =>
          kw.toLowerCase().includes(keyword.toLowerCase())
        );
      },
      dragStartClone: (cell: dia.Cell) => {
        const dragClone = cell.clone() as dia.Element;
        dragClone.attr(["body", "fill"], "#dde6ed");
        dragClone.set("group", cell.graph.get("group"));
        return dragClone;
      },
      contentOptions: { useModelGeometry: true },
      canDrag: (
        cellView: dia.CellView,
        _evt: dia.Event,
        _groupName: string | null
      ) => {
        return (
          cellView instanceof dia.ElementView &&
          !Placeholder.isPlaceholder(cellView.model as dia.Element)
        );
      },
      layout: (graph: dia.Graph, group: StencilGroupType) => {
        const groupElements = graph.getElements();
        const layoutElements = groupElements.filter(
          (element) => !Placeholder.isPlaceholder(element)
        );
        const rowGap = 20;
        const layoutOptions: any = {
          columns: 2,
          rowHeight: "compact",
          columnWidth: 90,
          horizontalAlign: "middle",
          rowGap,
          marginY: rowGap,
        };
        if (groupElements.length !== layoutElements.length) {
          const { height: placeholderHeight } = equipmentPlaceholder.size();
          layoutOptions.marginY = placeholderHeight + 2 * rowGap;
        }
        layout.GridLayout.layout(layoutElements, layoutOptions);
      },
      groups: {
        [StencilGroup.Equipment]: { index: 1, label: "Equipment" },
        [StencilGroup.Sensors]: { index: 2, label: "Sensors" },
        [StencilGroup.SymbolShapes]: { index: 3, label: "Other Symbols" },
      },
    });

    stencilRef.current.render();
    if (stencilContainerRef.current && stencilRef.current) {
      stencilContainerRef.current.appendChild(stencilRef.current.el);
      const searchInput = stencilRef.current.el.querySelector(
        ".search"
      ) as HTMLInputElement | null;
      if (searchInput) {
        searchInput.setAttribute("placeholder", "Find SCADA components...");
      }
    }

    placeholderPaperRef.current = stencilRef.current.getPaper(
      StencilGroup.Equipment
    );
    placeholderGraphRef.current = stencilRef.current.getGraph(
      StencilGroup.Equipment
    );

    toolbarRef.current = new ui.Toolbar({
      tools: [
        {
          type: "button",
          name: "export-json",
          text: "Export JSON",
          attrs: {
            button: {
              className: "btn btn-sm btn-outline-primary mr-2",
            },
          },
        },
        {
          type: "button",
          name: "export-svg",
          text: "Export SVG",
          attrs: {
            button: {
              className: "btn btn-sm btn-outline-primary mr-2",
            },
          },
        },
        {
          type: "zoomToFit",
          name: "zoom-to-fit",
          attrs: {
            button: {
              className: "btn btn-sm btn-outline-primary mr-2",
            },
          },
        },
        "zoomToFit",
        "zoomSlider",
      ],
      references: { paperScroller: paperRef.current },
    });

    toolbarRef.current.render();

    if (toolbarContainerRef.current && toolbarRef.current) {
      console.log(
        "Appending toolbar to container:",
        toolbarContainerRef.current
      );
      toolbarContainerRef.current.appendChild(toolbarRef.current.el);
    }

    const setupEventHandlers = () => {
      if (
        !graphRef.current ||
        !paperRef.current ||
        !stencilRef.current ||
        !placeholderPaperRef.current ||
        !placeholderGraphRef.current ||
        !toolbarRef.current
      ) {
        return;
      }

      graphRef.current.on("add remove", (cell: dia.Cell) => {
        if (cell.isLink()) return;
        resetUsedShapes(graphRef.current!, stencilRef.current!);
      });
      graphRef.current.on("reset", () =>
        resetUsedShapes(graphRef.current!, stencilRef.current!)
      );

      placeholderGraphRef.current.on("reset", () => {
        addToolsToStencilGroup(
          stencilRef.current!,
          placeholderPaperRef.current!,
          placeholderGraphRef.current!.getElements()
        );
      });

      stencilRef.current.on(
        "filter",
        (filteredGraph: dia.Graph, group: StencilGroupType) => {
          if (group !== StencilGroup.Equipment) return;
          addToolsToStencilGroup(
            stencilRef.current!,
            placeholderPaperRef.current!,
            filteredGraph.getElements()
          );
        }
      );

      paperRef.current.on(
        "element:pointerclick",
        (elementView: dia.ElementView) => {
          paperRef.current!.removeTools();
          const element = elementView.model as dia.Element;
          if (element.get("uniqueKey") === "valve") {
            const currentStatus = element.attr("state/status") as string;
            element.attr(
              "state/status",
              currentStatus === "open" ? "closed" : "open"
            );
            element.attr(
              "label/text",
              `Valve (${element.attr("state/status")})`
            );
            element.attr(
              "body/fill",
              currentStatus === "open" ? "#32CD32" : "#FF4500"
            );
          }
          //   const toolsView = new dia.ToolsView({
          //     tools: [
          //       new elementTools.Boundary({ useModelGeometry: true }),
          //       new elementTools.Connect({
          //         useModelGeometry: true,
          //         x: "calc(w + 10)",
          //         y: "calc(h / 2)",
          //       }),
          //       new elementTools.Remove({
          //         useModelGeometry: true,
          //         x: -10,
          //         y: -10,
          //       }),
          //     ],
          //   });
          //   elementView.addTools(toolsView);
        }
      );

      paperRef.current.on("blank:pointerdown", () => {
        paperRef.current!.removeTools();
      });

      const equipmentGroupEl = stencilRef.current.el.querySelector(
        `.group[data-name="${StencilGroup.Equipment}"]`
      ) as HTMLElement | null;
      stencilRef.current.on(
        "element:drag",
        (
          dragView: dia.ElementView,
          evt: dia.Event & { data: { save: boolean } },
          cloneArea: dia.BBox,
          validArea: boolean
        ) => {
          evt.data.save = false;
          highlighters.addClass.removeAll(
            placeholderPaperRef.current!,
            "hgl-favorite"
          );
          if (validArea) return;
          if (dragView.model.get("group") === StencilGroup.Equipment) return;
          if (stencilRef.current!.isGroupOpen(StencilGroup.Equipment)) {
            const placeholderArea =
              placeholderPaperRef.current!.clientToLocalRect(
                paperRef.current!.localToClientRect(cloneArea)
              );
            if (placeholderArea.intersect(equipmentPlaceholder.getBBox())) {
              evt.data.save = true;
              highlighters.addClass.add(
                equipmentPlaceholder.findView(placeholderPaperRef.current!),
                "root",
                "hgl-favorite"
              );
            }
          } else {
            if (evt.target.matches(".group-label")) {
              const groupEl = evt.target.closest(
                ".group"
              ) as HTMLElement | null;
              if (groupEl === equipmentGroupEl) {
                evt.data.save = true;
                equipmentGroupEl!.classList.add("groupHglFavorite");
                return;
              }
            }
            equipmentGroupEl!.classList.remove("groupHglFavorite");
          }
        }
      );

      stencilRef.current.on(
        "element:dragend",
        (
          dragView: dia.ElementView,
          evt: dia.Event & { data: { save: boolean } }
        ) => {
          equipmentGroupEl!.classList.remove("groupHglFavorite");
          highlighters.addClass.removeAll(placeholderPaperRef.current!);
          if (!evt.data.save) return;
          addFavoriteElement(
            dragView.model as dia.Element,
            stencilRef.current!
          );
          stencilRef.current!.cancelDrag({ dropAnimation: false });
        }
      );

      toolbarRef.current.on("export-json:pointerclick", () => {
        const graphJSON = graphRef.current!.toJSON();
        const blob = new Blob([JSON.stringify(graphJSON, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diagram.json";
        a.click();
        URL.revokeObjectURL(url);
      });

      toolbarRef.current.on("export-svg:pointerclick", () => {
        format.toSVG(
          paperRef.current!,
          (svg) => {
            util.downloadDataUri(
              `data:image/svg+xml,${encodeURIComponent(svg)}`,
              "joint-plus.svg"
            );
          },
          { useComputedStyles: false }
        );
      });
    };

    const resetUsedShapes = (graph: dia.Graph, stencil: ui.Stencil) => {
      const usedElementsKeys = Object.keys(
        util.groupBy(graph.getElements(), getElementUniqueKey)
      );
      const usedElements = [...mapUniqueKeysToShapes(usedElementsKeys)];
      stencil.load({ [StencilGroup.Equipment]: usedElements });
    };

    const getElementUniqueKey = (element: dia.Element): string =>
      element.get("uniqueKey") as string;

    const addFavoriteElement = (element: dia.Element, stencil: ui.Stencil) => {
      const favoriteShapeKeys = readFavoriteShapesUniqueKeys();
      const elementUniqueKey = getElementUniqueKey(element);
      if (favoriteShapeKeys.includes(elementUniqueKey)) return;
      const favoriteShapes = mapUniqueKeysToShapes([
        ...favoriteShapeKeys,
        elementUniqueKey,
      ]);
      stencil.load({
        [StencilGroup.Equipment]: [equipmentPlaceholder, ...favoriteShapes],
      });
      saveFavoriteShapes();
      refreshStencilSearch(stencil);
    };

    const removeFavoriteElement = (
      element: dia.Element,
      stencil: ui.Stencil
    ) => {
      const elementUniqueKey = getElementUniqueKey(element);
      const favoriteShapes = mapUniqueKeysToShapes(
        readFavoriteShapesUniqueKeys().filter((id) => id !== elementUniqueKey)
      );
      stencil.load({
        [StencilGroup.Equipment]: [equipmentPlaceholder, ...favoriteShapes],
      });
      saveFavoriteShapes();
      refreshStencilSearch(stencil);
    };

    const saveFavoriteShapes = () => {
      const favoriteShapes = stencilRef
        .current!.getGraph(StencilGroup.Equipment)
        .getElements()
        .filter((element) => !Placeholder.isPlaceholder(element))
        .map((element) => element.get("uniqueKey") as string);
      localStorage.setItem("favoriteShapes", JSON.stringify(favoriteShapes));
    };

    const loadFavoriteShapes = () => {
      const favoriteShapes = mapUniqueKeysToShapes(
        readFavoriteShapesUniqueKeys()
      );
      stencilRef.current!.load({
        [StencilGroup.Equipment]: [equipmentPlaceholder, ...favoriteShapes],
      });
    };

    const readFavoriteShapesUniqueKeys = (): string[] =>
      JSON.parse(localStorage.getItem("favoriteShapes") || "[]");

    const mapUniqueKeysToShapes = (shapeUniqueKeys: string[]): ScadaShape[] =>
      shapeUniqueKeys
        .map((uniqueKey) => shapesJSONMap[uniqueKey])
        .filter(Boolean) as ScadaShape[];

    const refreshStencilSearch = (stencil: ui.Stencil) => {
      const searchInput = stencil.el.querySelector(
        ".search"
      ) as HTMLInputElement | null;
      if (searchInput) stencil.filter(searchInput.value);
    };

    const addToolsToStencilGroup = (
      stencil: ui.Stencil,
      favoriteGroupPaper: dia.Paper,
      elements: dia.Element[]
    ) => {
      favoriteGroupPaper.removeTools();
      elements.forEach((element) => {
        if (Placeholder.isPlaceholder(element)) return;
        const toolsView = new dia.ToolsView({
          tools: [
            new elementTools.Remove({
              useModelGeometry: true,
              x: "calc(w - 10)",
              y: "calc(h + 10)",
              action: () => removeFavoriteElement(element, stencil),
            }),
          ],
        });
        favoriteGroupPaper.findViewByModel(element).addTools(toolsView);
      });
    };

    stencilRef.current!.load({
      [StencilGroup.Equipment]: shapesJSON.filter((shape) =>
        ["tank", "pump", "valve"].includes(shape.uniqueKey)
      ),
      [StencilGroup.Sensors]: shapesJSON.filter((shape) =>
        ["sensor"].includes(shape.uniqueKey)
      ),
      [StencilGroup.SymbolShapes]: shapesJSON,
    });

    setupEventHandlers();
    resetUsedShapes(graphRef.current!, stencilRef.current!);
    loadFavoriteShapes();
    setGenerator(generator);

    return () => {
      paperRef.current?.remove();
      stencilRef.current?.remove();
      toolbarRef.current?.remove();
    };
  }, []);

  const handlePowerChange = (event: any) => {
    const playbackRate = parseFloat(event.target.value);
    if (generator) {
      generator.set("power", playbackRate);
      setPowerLevel(playbackRate);
    }
  };

  const getPowerText = () => {
    return `${powerLevel} x`;
  };

  return (
    <div className="diagram-container">
      <div ref={stencilContainerRef} id="stencil-container" />

      <div ref={paperContainerRef} id="paper-container">
        <div ref={toolbarContainerRef} id="toolbar" />
        <label
          htmlFor="power-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Power
        </label>
        <input
          type="range"
          id="power-input"
          min="0"
          max="4"
          step="0.1"
          value={powerLevel}
          onChange={handlePowerChange}
          className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <output
          htmlFor="power-input"
          className="block text-sm text-gray-600 mt-1"
        >
          {getPowerText()}
        </output>
      </div>
      <div>
        <label
          htmlFor="power-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Power
        </label>
        <input
          type="range"
          id="power-input"
          min="0"
          max="4"
          step="0.1"
          value={powerLevel}
          onChange={handlePowerChange}
          className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <output
          htmlFor="power-input"
          className="block text-sm text-gray-600 mt-1"
        >
          {getPowerText()}
        </output>
      </div>
    </div>
  );
};

export default Scada_02;
