import { dia, util } from "@joint/plus";

const POWER_FLAG = "POWER";

class HeatPump extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "HeatPump",
      size: {
        width: 340,
        height: 198,
      },
      power: 0,
      temperature: 22,
      mode: "heat", // heat, cool, auto
      attrs: {
        root: {
          magnetSelector: "body",
        },

        // Main body background
        body: {
          width: "calc(0.91 * w)",
          height: "calc(0.92 * h)",
          x: "calc(0.003 * w)",
          y: "calc(0.005 * h)",
          rx: 4,
          fill: "url(#bodyGradient)",
          stroke: "#808080",
          strokeWidth: 2,
        },

        // Fan housing
        fanHousing: {
          r: "calc(0.207 * w)",
          cx: "calc(0.623 * w)",
          cy: "calc(0.475 * h)",
          fill: "url(#fanHousingGradient)",
          stroke: "#808080",
          strokeWidth: 7,
        },

        // Fan blades group
        fanGroup: {
          transform: "translate(calc(0.623 * w), calc(0.475 * h))",
          event: "element:fan:click",
          cursor: "pointer",
        },

        // Fan blades path
        fanBlades: {
          d: "M 0,-60 L 15,-45 L 0,-30 L -15,-45 Z M 0,60 L -15,45 L 0,30 L 15,45 Z M 60,0 L 45,15 L 30,0 L 45,-15 Z M -60,0 L -45,-15 L -30,0 L -45,15 Z M 42,-42 L 30,-30 L 42,-18 L 54,-30 Z M -42,42 L -54,30 L -42,18 L -30,30 Z M 42,42 L 54,30 L 42,18 L 30,30 Z M -42,-42 L -30,-30 L -42,-18 L -54,-30 Z",
          fill: "url(#fanBladeGradient)",
          stroke: "#222",
          strokeWidth: 1.5,
          style: {
            transition: "transform 0.3s ease-in-out",
          },
        },

        // Fan center
        fanCenter: {
          r: 16,
          fill: "#bbb",
          stroke: "#222",
          strokeWidth: 1.5,
        },

        // Fan mesh rings
        fanMesh1: {
          r: 52,
          fill: "none",
          stroke: "#808080",
          strokeWidth: 1.5,
        },
        fanMesh2: {
          r: 38,
          fill: "none",
          stroke: "#808080",
          strokeWidth: 1.5,
        },
        fanMesh3: {
          r: 25,
          fill: "none",
          stroke: "#808080",
          strokeWidth: 1.5,
        },

        // Display panel
        display: {
          width: "calc(0.281 * w)",
          height: "calc(0.515 * h)",
          x: "calc(0.106 * w)",
          y: "calc(0.202 * h)",
          rx: 4,
          fill: "white",
          stroke: "#737373",
          strokeWidth: 1.5,
        },

        // Display text
        displayTemp: {
          text: "22°C",
          textAnchor: "middle",
          textVerticalAnchor: "middle",
          x: "calc(0.246 * w)",
          y: "calc(0.35 * h)",
          fontSize: 16,
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          fill: "#000",
        },

        displayMode: {
          text: "HEAT",
          textAnchor: "middle",
          textVerticalAnchor: "middle",
          x: "calc(0.246 * w)",
          y: "calc(0.55 * h)",
          fontSize: 10,
          fontFamily: "Arial, sans-serif",
          fill: "#666",
        },

        // Air vent
        airVent: {
          width: "calc(0.21 * w)",
          height: "calc(0.343 * h)",
          x: "calc(0.125 * w)",
          y: "calc(0.641 * h)",
          rx: 2,
          fill: "white",
          stroke: "#808080",
          strokeWidth: 1,
        },

        // Vent lines
        ventLines: {
          d: "M calc(0.135 * w) calc(0.66 * h) L calc(0.325 * w) calc(0.66 * h) M calc(0.135 * w) calc(0.68 * h) L calc(0.325 * w) calc(0.68 * h) M calc(0.135 * w) calc(0.70 * h) L calc(0.325 * w) calc(0.70 * h) M calc(0.135 * w) calc(0.72 * h) L calc(0.325 * w) calc(0.72 * h) M calc(0.135 * w) calc(0.74 * h) L calc(0.325 * w) calc(0.74 * h) M calc(0.135 * w) calc(0.76 * h) L calc(0.325 * w) calc(0.76 * h) M calc(0.135 * w) calc(0.78 * h) L calc(0.325 * w) calc(0.78 * h) M calc(0.135 * w) calc(0.80 * h) L calc(0.325 * w) calc(0.80 * h) M calc(0.135 * w) calc(0.82 * h) L calc(0.325 * w) calc(0.82 * h) M calc(0.135 * w) calc(0.84 * h) L calc(0.325 * w) calc(0.84 * h) M calc(0.135 * w) calc(0.86 * h) L calc(0.325 * w) calc(0.86 * h) M calc(0.135 * w) calc(0.88 * h) L calc(0.325 * w) calc(0.88 * h) M calc(0.135 * w) calc(0.90 * h) L calc(0.325 * w) calc(0.90 * h) M calc(0.135 * w) calc(0.92 * h) L calc(0.325 * w) calc(0.92 * h) M calc(0.135 * w) calc(0.94 * h) L calc(0.325 * w) calc(0.94 * h) M calc(0.135 * w) calc(0.96 * h) L calc(0.325 * w) calc(0.96 * h)",
          stroke: "#808080",
          strokeWidth: 1,
        },

        // Connectors
        connector1: {
          width: "calc(0.111 * w)",
          height: "calc(0.313 * h)",
          x: "calc(0.914 * w)",
          y: "calc(0.237 * h)",
          fill: "url(#connectorGradient)",
          stroke: "#808080",
          strokeWidth: 1,
        },

        connector2: {
          width: "calc(0.111 * w)",
          height: "calc(0.313 * h)",
          x: "calc(0.914 * w)",
          y: "calc(0.652 * h)",
          fill: "url(#connectorGradient)",
          stroke: "#808080",
          strokeWidth: 1,
        },

        // Feet
        foot1: {
          width: "calc(0.17 * w)",
          height: "calc(0.056 * h)",
          x: "calc(0.241 * w)",
          y: "calc(0.934 * h)",
          fill: "url(#footGradient)",
        },

        foot2: {
          width: "calc(0.17 * w)",
          height: "calc(0.056 * h)",
          x: "calc(0.7 * w)",
          y: "calc(0.934 * h)",
          fill: "url(#footGradient)",
        },

        footBase1: {
          width: "calc(0.376 * w)",
          height: "calc(0.076 * h)",
          x: "calc(0.138 * w)",
          y: "calc(0.963 * h)",
          fill: "#808080",
        },

        footBase2: {
          width: "calc(0.376 * w)",
          height: "calc(0.076 * h)",
          x: "calc(0.649 * w)",
          y: "calc(0.963 * h)",
          fill: "#808080",
        },

        // Label
        label: {
          text: "Heat Pump",
          textAnchor: "middle",
          textVerticalAnchor: "top",
          x: "calc(0.5 * w)",
          y: "calc(h + 10)",
          fontSize: 14,
          fontFamily: "sans-serif",
          fill: "#350100",
        },
      },
    };
  }

  markup = [
    {
      tagName: "defs",
      children: [
        {
          tagName: "linearGradient",
          attributes: {
            id: "bodyGradient",
            x1: "0%",
            y1: "0%",
            x2: "100%",
            y2: "0%",
          },
          children: [
            {
              tagName: "stop",
              attributes: { offset: "0%", "stop-color": "#808080" },
            },
            {
              tagName: "stop",
              attributes: { offset: "28%", "stop-color": "#E2E2E2" },
            },
            {
              tagName: "stop",
              attributes: { offset: "52%", "stop-color": "white" },
            },
            {
              tagName: "stop",
              attributes: { offset: "73%", "stop-color": "#E2E2E2" },
            },
            {
              tagName: "stop",
              attributes: { offset: "100%", "stop-color": "#808080" },
            },
          ],
        },
        {
          tagName: "radialGradient",
          attributes: {
            id: "fanHousingGradient",
            cx: "50%",
            cy: "50%",
            r: "50%",
          },
          children: [
            {
              tagName: "stop",
              attributes: { offset: "82%", "stop-color": "white" },
            },
            {
              tagName: "stop",
              attributes: { offset: "100%", "stop-color": "#999999" },
            },
          ],
        },
        {
          tagName: "radialGradient",
          attributes: {
            id: "fanBladeGradient",
            cx: "50%",
            cy: "50%",
            r: "50%",
          },
          children: [
            {
              tagName: "stop",
              attributes: { offset: "0%", "stop-color": "#9DFF98" },
            },
            {
              tagName: "stop",
              attributes: { offset: "100%", "stop-color": "#078C00" },
            },
          ],
        },
        {
          tagName: "linearGradient",
          attributes: {
            id: "connectorGradient",
            x1: "0%",
            y1: "0%",
            x2: "0%",
            y2: "100%",
          },
          children: [
            {
              tagName: "stop",
              attributes: { offset: "0%", "stop-color": "#737373" },
            },
            {
              tagName: "stop",
              attributes: { offset: "51%", "stop-color": "#D9D9D9" },
            },
            {
              tagName: "stop",
              attributes: { offset: "100%", "stop-color": "#737373" },
            },
          ],
        },
        {
          tagName: "linearGradient",
          attributes: {
            id: "footGradient",
            x1: "0%",
            y1: "0%",
            x2: "100%",
            y2: "0%",
          },
          children: [
            {
              tagName: "stop",
              attributes: { offset: "0%", "stop-color": "#737373" },
            },
            {
              tagName: "stop",
              attributes: { offset: "51%", "stop-color": "#D9D9D9" },
            },
            {
              tagName: "stop",
              attributes: { offset: "100%", "stop-color": "#737373" },
            },
          ],
        },
      ],
    },
    {
      tagName: "rect",
      selector: "body",
    },
    {
      tagName: "circle",
      selector: "fanHousing",
    },
    {
      tagName: "g",
      selector: "fanGroup",
      children: [
        {
          tagName: "path",
          selector: "fanBlades",
        },
        {
          tagName: "circle",
          selector: "fanCenter",
        },
        {
          tagName: "circle",
          selector: "fanMesh1",
        },
        {
          tagName: "circle",
          selector: "fanMesh2",
        },
        {
          tagName: "circle",
          selector: "fanMesh3",
        },
      ],
    },
    {
      tagName: "rect",
      selector: "display",
    },
    {
      tagName: "text",
      selector: "displayTemp",
    },
    {
      tagName: "text",
      selector: "displayMode",
    },
    {
      tagName: "rect",
      selector: "airVent",
    },
    {
      tagName: "path",
      selector: "ventLines",
    },
    {
      tagName: "rect",
      selector: "connector1",
    },
    {
      tagName: "rect",
      selector: "connector2",
    },
    {
      tagName: "rect",
      selector: "foot1",
    },
    {
      tagName: "rect",
      selector: "foot2",
    },
    {
      tagName: "rect",
      selector: "footBase1",
    },
    {
      tagName: "rect",
      selector: "footBase2",
    },
    {
      tagName: "text",
      selector: "label",
    },
  ];

  // Custom methods
  setPower(power) {
    this.set("power", power);
    this.attr(
      "fanBlades/style/transform",
      power > 0 ? "rotate(360deg)" : "rotate(0deg)"
    );
    return this;
  }

  setTemperature(temp) {
    this.set("temperature", temp);
    this.attr("displayTemp/text", `${temp}°C`);
    return this;
  }

  setMode(mode) {
    this.set("mode", mode);
    this.attr("displayMode/text", mode.toUpperCase());

    // Change fan blade color based on mode
    if (mode === "heat") {
      this.attr("fanBlades/fill", "url(#fanBladeGradient)");
    } else if (mode === "cool") {
      this.attr("fanBlades/fill", "#4A90E2");
    } else {
      this.attr("fanBlades/fill", "#FFA500");
    }

    return this;
  }

  // Event handlers
  onFanClick() {
    const currentPower = this.get("power");
    this.setPower(currentPower > 0 ? 0 : 1);
  }
}

// Register custom events
HeatPump.prototype.defaults.attrs.fanGroup.event = "element:fan:click";

export default HeatPump;
