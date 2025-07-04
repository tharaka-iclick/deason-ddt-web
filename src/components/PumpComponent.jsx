// src/Diagram.js
import React, { useEffect, useRef } from "react";
import { dia, util, shapes } from "@joint/plus";
import "./styles.css";

// Constants
const LIQUID_COLOR = "#00f"; // Blue color for flowing liquid
const FLOW_FLAG = "FLOW"; // Flag for flow updates

// Pipe01 Link Model
class Pipe01 extends dia.Link {
  defaults() {
    return {
      ...super.defaults,
      type: "Pipe01",
      z: 1,
      flow: 1,
      attrs: {
        outline: {
          connection: true,
          stroke: "#444",
          strokeWidth: 16,
          strokeLinejoin: "round",
          strokeLinecap: "round",
          fill: "none",
        },
        line: {
          connection: true,
          stroke: "#eee",
          strokeWidth: 12,
          strokeLinejoin: "round",
          strokeLinecap: "round",
          fill: "none",
        },
        liquid: {
          connection: true,
          stroke: LIQUID_COLOR,
          strokeWidth: 8,
          strokeLinejoin: "round",
          strokeLinecap: "round",
          strokeDasharray: "10,10",
          fill: "none",
        },
      },
    };
  }

  preinitialize() {
    this.markup = util.svg`
      <path @selector="outline"/>
      <path @selector="line"/>
      <path @selector="liquid"/>
    `;
  }

  get flow() {
    return this.get("flow") || 1;
  }

  set flow(value) {
    this.set("flow", value);
    this.trigger("change:flow", this, value);
  }
}

// PipeView01 Link View
const PipeView01 = dia.LinkView.extend({
  presentationAttributes: dia.LinkView.addPresentationAttributes({
    flow: [FLOW_FLAG],
  }),

  initFlag: [...dia.LinkView.prototype.initFlag, FLOW_FLAG],

  flowAnimation: null,

  initialize() {
    dia.LinkView.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, "change:flow", this.onFlowChange);
  },

  onFlowChange() {
    this.updateFlow();
  },

  confirmUpdate(...args) {
    let flags = dia.LinkView.prototype.confirmUpdate.call(this, ...args);
    if (this.hasFlag(flags, FLOW_FLAG)) {
      this.updateFlow();
      flags = this.removeFlag(flags, FLOW_FLAG);
    }
    return flags;
  },

  render() {
    const result = dia.LinkView.prototype.render.apply(this, arguments);

    // Start animation after render
    requestAnimationFrame(() => {
      this.startFlowAnimation();
    });

    return result;
  },

  startFlowAnimation() {
    const liquidPath = this.findBySelector("liquid")[0];
    if (!liquidPath) {
      console.warn("Liquid path not found");
      return;
    }

    // Stop existing animation
    if (this.flowAnimation) {
      this.flowAnimation.cancel();
    }

    // Create flowing animation
    const dashLength = 20; // 10 + 10 from strokeDasharray
    this.flowAnimation = liquidPath.animate(
      { strokeDashoffset: [dashLength, 0] },
      {
        duration: 2000,
        iterations: Infinity,
        easing: "linear",
      }
    );

    // Set initial flow rate
    this.updateFlow();
  },

  updateFlow() {
    if (!this.flowAnimation) return;

    const flowRate = this.model.get("flow") || 0;
    const liquidPath = this.findBySelector("liquid")[0];

    if (liquidPath) {
      // Update animation speed
      this.flowAnimation.playbackRate = flowRate;

      // Change color based on flow
      if (flowRate === 0) {
        liquidPath.style.stroke = "#ccc";
        liquidPath.style.strokeOpacity = "0.5";
      } else {
        liquidPath.style.stroke = LIQUID_COLOR;
        liquidPath.style.strokeOpacity = "1";
      }
    }
  },

  remove() {
    if (this.flowAnimation) {
      this.flowAnimation.cancel();
      this.flowAnimation = null;
    }
    dia.LinkView.prototype.remove.apply(this, arguments);
  },
});

// React Component
const Diagram = () => {
  const paperContainer = useRef(null);

  useEffect(() => {
    // Create namespace
    const namespace = {
      ...shapes,
      Pipe01,
      Pipe01View: PipeView01,
    };

    // Initialize JointJS Graph and Paper
    const graph = new dia.Graph({}, { cellNamespace: namespace });

    const paper = new dia.Paper({
      el: paperContainer.current,
      model: graph,
      width: 800,
      height: 600,
      gridSize: 20,
      drawGrid: true,
      cellViewNamespace: namespace,
      background: { color: "#f8f9fa" },
    });

    // Create some basic shapes as connection points
    const source = new shapes.standard.Circle({
      position: { x: 100, y: 200 },
      size: { width: 60, height: 60 },
      attrs: {
        body: { fill: "#4CAF50", stroke: "#2E7D32", strokeWidth: 3 },
        label: { text: "Source", fill: "white", fontSize: 12 },
      },
    });

    const target = new shapes.standard.Rectangle({
      position: { x: 600, y: 300 },
      size: { width: 80, height: 60 },
      attrs: {
        body: { fill: "#2196F3", stroke: "#1565C0", strokeWidth: 3 },
        label: { text: "Tank", fill: "white", fontSize: 12 },
      },
    });

    // Add shapes to graph
    source.addTo(graph);
    target.addTo(graph);

    const pipe1 = new Pipe01({
      source: { id: source.id },
      target: { id: target.id },
      flow: 1,
      router: { name: "orthogonal" },
      connector: { name: "rounded" },
    });

    const pipe2 = new Pipe01({
      source: { x: 100, y: 100 },
      target: { x: 400, y: 150 },
      flow: 0.5,
      router: { name: "manhattan" },
    });

    const pipe3 = new Pipe01({
      source: { x: 200, y: 400 },
      target: { x: 500, y: 500 },
      flow: 2,
    });

    pipe1.addTo(graph);
    pipe2.addTo(graph);
    pipe3.addTo(graph);

    let currentFlow = 1;
    const flowInterval = setInterval(() => {
      currentFlow = currentFlow === 0 ? 2 : currentFlow === 2 ? 0.5 : 0;
      console.log(`Changing flow to: ${currentFlow}`);
      pipe1.set("flow", currentFlow);
    }, 3000);

    // Clean up on unmount
    return () => {
      clearInterval(flowInterval);
      if (paper) paper.remove();
      if (graph) graph.clear();
    };
  }, []);

  return (
    <div>
      <div
        ref={paperContainer}
        style={{
          border: "2px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      />
      {/* <div style={{ display: "flex", flex: 1 }}>
        <div
          ref={paperContainer}
          id="paper"
          style={{ flex: 1, background: "#F5F5F5" }}
        />
      </div> */}
    </div>
  );
};

export default Diagram;
