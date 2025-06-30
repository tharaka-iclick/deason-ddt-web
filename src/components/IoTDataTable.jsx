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

// Turbine metrics
const r = 16;
const a = 3;
const b = 4;

// Custom view flags
const POWER_FLAG = "POWER";
const LIGHT_FLAG = "LIGHT";

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
    };
  }

  get power() {
    return Math.round(this.get("power") * 100);
  }

  preinitialize() {
    this.markup = util.svg`
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
    // It's important to use start and end frames to make it work in Safari.
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
    this.markup = util.svg`
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

  glassAnimation: null,

  confirmUpdate(...args) {
    let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
    if (this.hasFlag(flags, LIGHT_FLAG)) {
      // Delay the light toggle to ensure elements are rendered
      setTimeout(() => this.toggleLight(), 50);
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
      z: -1,
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
    this.markup = util.svg`
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
  highlight: function (cellView) {
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
  highlight: function (cellView) {
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

const GeneratorCircuit = () => {
  const paperContainerRef = useRef(null);
  const [powerLevel, setPowerLevel] = useState(1);
  const [graph, setGraph] = useState(null);
  const [generator, setGenerator] = useState(null);
  const canvas = useRef(null);

  useEffect(() => {
    // if (!paperContainerRef.current) return;

    const namespace = {
      ...shapes,
      Generator,
      GeneratorView,
      Bulb,
      BulbView,
      Wire,
    };

    // const newGraph = new dia.Graph(
    //   {},
    //   {
    //     cellNamespace: namespace,
    //   }
    // );

    const graph = new dia.Graph(
      {},
      {
        cellNamespace: namespace,
      }
    );

    const paper = new dia.Paper({
      model: graph,
      background: {
        color: "#F8F9FA",
      },
      frozen: true,
      async: true,
      cellViewNamespace: shapes,
    });

    const scroller = new ui.PaperScroller({
      paper,
      autoResizePaper: true,
      cursor: "grab",
    });

    canvas.current?.appendChild(scroller.el);
    scroller.render().center();

    const rect = new shapes.standard.Rectangle({
      position: { x: 100, y: 100 },
      size: { width: 100, height: 50 },
      attrs: {
        label: {
          text: "Hello World",
        },
      },
    });

    graph.addCell(rect);
    paper.unfreeze();

    // paperContainerRef.current.appendChild(paper.el);

    const newGenerator = new Generator({
      position: { x: 50, y: 50 },
    });

    const setPlaybackRate = (playbackRate) => {
      newGenerator.set("power", playbackRate);
      setPowerLevel(playbackRate);
    };

    paper.on("element:power:click", ({ model }, evt) => {
      evt.stopPropagation();
      const playbackRate = model.get("power") ? 0 : 1;
      setPlaybackRate(playbackRate);
    });

    const bulb1 = Bulb.create(100).position(150, 45);
    const bulb2 = Bulb.create(40).position(150, 105);

    const wire1 = new Wire({
      source: { id: newGenerator.id },
      target: { id: bulb1.id },
    });

    const wire2 = new Wire({
      source: { id: newGenerator.id },
      target: { id: bulb2.id },
    });

    graph.addCells([newGenerator, bulb1, bulb2, wire1, wire2]);

    // // Wait for elements to be fully rendered before adding effects and scaling
    setTimeout(() => {
      try {
        const generatorView = newGenerator.findView(paper);
        if (generatorView) {
          StatusEffect.add(generatorView, "root", "status");
          PlaybackRateEffect.add(generatorView, "root", "playback-rate");
        }

        paper.scale(4);
        setPlaybackRate(1);

        const toggleLights = (graph, el) => {
          graph.getNeighbors(el, { outbound: true }).forEach((bulb) => {
            bulb.set("light", el.power >= bulb.get("watts"));
          });
        };

        graph.on("change:power", (el) => toggleLights(graph, el));
        toggleLights(graph, newGenerator);
      } catch (error) {
        console.error("Error setting up effects:", error);
      }
    }, 200);

    // setGraph(newGraph);
    setGenerator(newGenerator);

    // Cleanup function
    return () => {
      scroller.remove();
      paper.remove();
      if (paperContainerRef.current && paper.el) {
        paperContainerRef.current.removeChild(paper.el);
      }
    };
  }, []);

  const handlePowerChange = (event) => {
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
    // <div className="canvas" ref={canvas} />
    <div className="w-full h-screen bg-gray-50">
      <div
        ref={canvas}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />

   <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg">
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

export default GeneratorCircuit;

// import React, { useEffect, useRef, useState } from "react";
// import {
//   dia,
//   ui,
//   shapes,
//   util,
//   layout,
//   highlighters,
//   elementTools,
//   format,
// } from "@joint/plus";

// // Turbine metrics
// const r = 16;
// const a = 3;
// const b = 4;

// // Custom view flags
// const POWER_FLAG = "POWER";
// const LIGHT_FLAG = "LIGHT";

// class Generator extends dia.Element {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "Generator",
//       size: {
//         width: 60,
//         height: 80,
//       },
//       power: 0,
//       attrs: {
//         root: {
//           magnetSelector: "body",
//         },
//         body: {
//           width: "calc(w)",
//           height: "calc(h)",
//           stroke: "#7f4439",
//           strokeWidth: 2,
//           fill: "#945042",
//           rx: 5,
//           ry: 5,
//         },
//         label: {
//           text: "Generator",
//           textAnchor: "middle",
//           textVerticalAnchor: "top",
//           x: "calc(0.5*w)",
//           y: "calc(h+10)",
//           fontSize: "14",
//           fontFamily: "sans-serif",
//           fill: "#350100",
//         },
//         generatorGroup: {
//           transform: "translate(calc(w/2),calc(h/2))",
//           event: "element:power:click",
//           cursor: "pointer",
//         },
//         generatorBackground: {
//           r: 24,
//           fill: "#350100",
//           stroke: "#a95b4c",
//           strokeWidth: 2,
//         },
//         generator: {
//           d: `M ${a} ${a} ${b} ${r} -${b} ${r} -${a} ${a} -${r} ${b} -${r} -${b} -${a} -${a} -${b} -${r} ${b} -${r} ${a} -${a} ${r} -${b} ${r} ${b} Z`,
//           stroke: "#a95b4c",
//           strokeWidth: 2,
//           fill: "#c99287",
//         },
//       },
//     };
//   }

//   get power() {
//     return Math.round(this.get("power") * 100);
//   }

//   preinitialize() {
//     this.markup = util.svg`
//           <rect @selector="body" />
//           <g @selector="generatorGroup">
//             <circle @selector="generatorBackground" />
//             <path @selector="generator" />
//           </g>
//           <text @selector="label" />
//         `;
//   }
// }

// const GeneratorView = dia.ElementView.extend({
//   presentationAttributes: dia.ElementView.addPresentationAttributes({
//     power: [POWER_FLAG],
//   }),

//   initFlag: [dia.ElementView.Flags.RENDER, POWER_FLAG],

//   powerAnimation: null,

//   confirmUpdate(...args) {
//     let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
//     if (this.hasFlag(flags, POWER_FLAG)) {
//       this.togglePower();
//       flags = this.removeFlag(flags, POWER_FLAG);
//     }
//     return flags;
//   },

//   getSpinAnimation() {
//     let { spinAnimation } = this;
//     if (spinAnimation) return spinAnimation;
//     // const [generatorEl] = this.findBySelector("generator");
//     const elements = this.findBySelector("generator");
//     console.log("Found elements for selector 'generator':", elements); // Debug
//     const [generatorEl] = elements;
//     if (!generatorEl) {
//       console.error("No generator element found!");
//       return null; // Prevent further errors
//     }
//     const keyframes = { transform: ["rotate(0deg)", "rotate(360deg)"] };
//     spinAnimation = generatorEl.animate(keyframes, {
//       fill: "forwards",
//       duration: 1000,
//       iterations: Infinity,
//     });
//     this.spinAnimation = spinAnimation;
//     return spinAnimation;
//   },

//   togglePower() {
//     const { model } = this;
//     const playbackRate = model.get("power");
//     this.getSpinAnimation().playbackRate = playbackRate;
//   },
// });

// class Bulb extends dia.Element {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "Bulb",
//       size: {
//         width: 28,
//         height: 30,
//       },
//       attrs: {
//         root: {
//           magnetSelector: "glass",
//         },
//         cap1: {
//           y: "calc(h + 1)",
//           x: "calc(w / 2 - 6)",
//           width: 12,
//         },
//         cap2: {
//           y: "calc(h + 5)",
//           x: "calc(w / 2 - 5)",
//           width: 10,
//         },
//         cap: {
//           fill: "#350100",
//           height: 3,
//         },
//         glass: {
//           fill: "#f1f5f7",
//           stroke: "#659db3",
//           refD: "M 14.01 0 C 3.23 0.01 -3.49 11.68 1.91 21.01 C 2.93 22.78 4.33 24.31 6.01 25.48 L 6.01 32 L 22.01 32 L 22.01 25.48 C 30.85 19.31 29.69 5.89 19.93 1.32 C 18.08 0.45 16.06 0 14.01 0 Z",
//         },
//         label: {
//           textAnchor: "middle",
//           textVerticalAnchor: "middle",
//           x: "calc(w / 2)",
//           y: "calc(h / 2)",
//           fontSize: 7,
//           fontFamily: "sans-serif",
//           fill: "#350100",
//         },
//       },
//     };
//   }

//   preinitialize() {
//     this.markup = util.svg`
//           <rect @selector="cap1" @group-selector="cap"/>
//           <rect @selector="cap2" @group-selector="cap"/>
//           <path @selector="glass"/>
//           <text @selector="label" />
//         `;
//   }

//   static create(watts = 100) {
//     return new this({
//       watts: watts,
//       attrs: {
//         label: {
//           text: `${watts} W`,
//         },
//       },
//     });
//   }
// }

// const BulbView = dia.ElementView.extend({
//   presentationAttributes: dia.ElementView.addPresentationAttributes({
//     light: [LIGHT_FLAG],
//   }),

//   initFlag: [dia.ElementView.Flags.RENDER, LIGHT_FLAG],

//   glassAnimation: null,

//   confirmUpdate(...args) {
//     let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
//     if (this.hasFlag(flags, LIGHT_FLAG)) {
//       // Delay the light toggle to ensure elements are rendered
//       setTimeout(() => this.toggleLight(), 50);
//       flags = this.removeFlag(flags, LIGHT_FLAG);
//     }
//     return flags;
//   },

//   getGlassAnimation() {
//     let { glassAnimation } = this;
//     if (glassAnimation) return glassAnimation;
//     const [glassEl] = this.findBySelector("glass");
//     const keyframes = {
//       stroke: ["#edbc26"],
//       fill: ["#f5e5b7"],
//       strokeWidth: [2],
//     };
//     glassAnimation = glassEl.animate(keyframes, {
//       fill: "forwards",
//       duration: 500,
//       iterations: 1,
//     });
//     this.glassAnimation = glassAnimation;
//     return glassAnimation;
//   },

//   toggleLight() {
//     const { model } = this;
//     const state = model.get("light") ? 1 : -1;
//     this.getGlassAnimation().playbackRate = state;
//   },
// });

// class Wire extends dia.Link {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "Wire",
//       z: -1,
//       attrs: {
//         line: {
//           connection: true,
//           stroke: "#346f83",
//           strokeWidth: 2,
//           strokeLinejoin: "round",
//           strokeLinecap: "round",
//         },
//         outline: {
//           connection: true,
//           stroke: "#004456",
//           strokeWidth: 4,
//           strokeLinejoin: "round",
//           strokeLinecap: "round",
//         },
//       },
//     };
//   }

//   preinitialize() {
//     this.markup = util.svg`
//           <path @selector="outline" fill="none"/>
//           <path @selector="line" fill="none"/>
//         `;
//   }
// }

// const StatusEffect = dia.HighlighterView.extend({
//   UPDATE_ATTRIBUTES: ["power"],
//   tagName: "circle",
//   attributes: {
//     r: 5,
//     stroke: "white",
//     event: "element:power:click",
//     cursor: "pointer",
//   },
//   highlight: function (cellView) {
//     const { vel } = this;
//     const { model } = cellView;
//     const { width, height } = model.size();
//     const power = model.get("power");
//     vel.attr("fill", power === 0 ? "#ed4912" : "#65b374");
//     vel.attr("cx", width - 10);
//     vel.attr("cy", height - 10);
//   },
// });

// const PlaybackRateEffect = dia.HighlighterView.extend({
//   UPDATE_ATTRIBUTES: ["power"],
//   tagName: "text",
//   attributes: {
//     r: 5,
//     fill: "white",
//     "font-size": 7,
//     "font-family": "sans-serif",
//     "text-anchor": "end",
//   },
//   highlight: function (cellView) {
//     const { vel } = this;
//     const { model } = cellView;
//     const { width, height } = model.size();
//     const { power } = model;
//     let text;
//     switch (power) {
//       case 0:
//         text = "Off";
//         break;
//       case 100:
//         text = "On";
//         break;
//       case 400:
//         text = "Max";
//         break;
//       default:
//         text = `${power} %`;
//     }
//     vel.attr("x", width - 18);
//     vel.attr("y", height - 5);
//     vel.text(text, { textVerticalAnchor: "bottom" });
//   },
// });

// const GeneratorCircuit = () => {
//   const paperContainerRef = useRef(null);
//   const [powerLevel, setPowerLevel] = useState(1);
//   const [graph, setGraph] = useState(null);
//   const [generator, setGenerator] = useState(null);
//   const containerRef = useRef(null);

//   // const paperContainerRef = useRef<HTMLDivElement>(null);
//   const stencilContainerRef = useRef(null);
//   const toolbarContainerRef = useRef(null);
//   const playbackRateEl = useRef(null);
//   const playbackRateOutputEl = useRef(null);
//   const graphRef = useRef(null);
//   const paperRef = useRef(null);
//   const stencilRef = useRef(null);
//   const placeholderPaperRef = useRef(null);
//   const placeholderGraphRef = useRef(null);
//   const toolbarRef = useRef(null);

//   const canvas = useRef(null);

//   useEffect(() => {
//     if (!paperContainerRef.current) return;
//     const namespace = {
//       ...shapes,
//       Generator,
//       GeneratorView,
//       Bulb,
//       BulbView,
//       Wire,
//     };
//     const graph = new dia.Graph({}, { cellNamespace: namespace });

//     const paper = new dia.Paper({
//       model: graph,
//       background: {
//         color: "#F8F9FA",
//       },
//       frozen: true,
//       async: true,
//       cellViewNamespace: shapes,
//     });

//     const scroller = new ui.PaperScroller({
//       paper,
//       autoResizePaper: true,
//       cursor: "grab",
//     });

//     paperContainerRef.current.appendChild(scroller.el);
//     scroller.render().center();

//     paperContainerRef.current.appendChild(paper.el);

//     paper.on("element:power:click", ({ model }, evt) => {
//       evt.stopPropagation();
//       const playbackRate = model.get("power") ? 0 : 1;
//       setPlaybackRate(playbackRate);
//     });

//     const rect = new shapes.standard.Rectangle({
//       position: { x: 100, y: 100 },
//       size: { width: 100, height: 50 },
//       attrs: {
//         label: {
//           text: "Hello World",
//         },
//       },
//     });

//     // graph.addCell(rect);
//     paper.unfreeze();

//     paperContainerRef.current.addEventListener("input", ({ target }) => {
//       const playbackRate = parseFloat(target.value);
//       setPlaybackRate(playbackRate);
//     });

//     function setPlaybackRate(playbackRate) {
//       generator.set("power", playbackRate);
//       playbackRateEl.value = playbackRate;
//       playbackRateOutputEl.textContent = `${playbackRate} x`;
//     }

//     const generator = new Generator({
//       position: { x: 50, y: 50 },
//     });

//     const bulb1 = Bulb.create(100).position(150, 45);

//     const bulb2 = Bulb.create(40).position(150, 105);

//     const wire1 = new Wire({
//       source: { id: generator.id },
//       target: { id: bulb1.id },
//     });

//     const wire2 = new Wire({
//       source: { id: generator.id },
//       target: { id: bulb2.id },
//     });

//     graph.addCells([generator, bulb1, bulb2, wire1, wire2]);

//     StatusEffect.add(generator.findView(paper), "root", "status");
//     PlaybackRateEffect.add(generator.findView(paper), "root", "playback-rate");

//     paper.scale(4);
//     setPlaybackRate(4);

//     graph.on("change:power", (el) => toggleLights(graphRef.current, el));

//     function toggleLights(graph, el) {
//       graph.getNeighbors(el, { outbound: true }).forEach((bulb) => {
//         bulb.set("light", el.power >= bulb.get("watts"));
//       });
//     }

//     toggleLights(graph, generator);

//     if (paperContainerRef.current && paperRef.current) {
//       paperContainerRef.current.appendChild(paperRef.current.el);
//     }

//     const setupEventHandlers = () => {
//       if (
//         !graphRef.current ||
//         !paperRef.current ||
//         !placeholderPaperRef.current ||
//         !placeholderGraphRef.current ||
//         !toolbarRef.current
//       ) {
//         return;
//       }

//       paperRef.current.on("element:pointerclick", (elementView) => {
//         paperRef.current.removeTools();
//         const element = elementView.model;
//         if (element.get("uniqueKey") === "valve") {
//           const currentStatus = element.attr("state/status");
//           element.attr(
//             "state/status",
//             currentStatus === "open" ? "closed" : "open"
//           );
//           element.attr("label/text", `Valve (${element.attr("state/status")})`);
//           element.attr(
//             "body/fill",
//             currentStatus === "open" ? "#32CD32" : "#FF4500"
//           );
//         }
//         //   const toolsView = new dia.ToolsView({
//         //     tools: [
//         //       new elementTools.Boundary({ useModelGeometry: true }),
//         //       new elementTools.Connect({
//         //         useModelGeometry: true,
//         //         x: "calc(w + 10)",
//         //         y: "calc(h / 2)",
//         //       }),
//         //       new elementTools.Remove({
//         //         useModelGeometry: true,
//         //         x: -10,
//         //         y: -10,
//         //       }),
//         //     ],
//         //   });
//         //   elementView.addTools(toolsView);
//       });

//       paperRef.current.on("blank:pointerdown", () => {
//         paperRef.current.removeTools();
//       });
//     };

//     setupEventHandlers();

//     return () => {
//       paperRef.current?.remove();
//       scroller.remove();
//       paper.remove();
//     };
//   }, []);

//   return (
//     <div>
//       <div
//         ref={paperContainerRef}
//         // className="w-full h-full"
//         style={{ minHeight: "400px", border: "1px solid #000" }}
//       />

//       {/* <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg">
//         <label
//           htmlFor="power-input"
//           className="block text-sm font-medium text-gray-700 mb-2"
//         >
//           Power
//         </label>
//         <input
//           type="range"
//           id="power-input"
//           min="0"
//           max="4"
//           step="0.1"
//           value={powerLevel}
//           onChange={handlePowerChange}
//           className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//         />
//         <output
//           htmlFor="power-input"
//           className="block text-sm text-gray-600 mt-1"
//         >
//           {getPowerText()}
//         </output>
//       </div> */}
//     </div>
//   );
// };
