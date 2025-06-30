import React, { useEffect, useRef, useState, useCallback } from "react";
import { Zap, Lightbulb, Cable, Power, RotateCcw, Trash2 } from "lucide-react";

// Types for our circuit elements
interface CircuitElement {
  id: string;
  type: "generator" | "bulb";
  x: number;
  y: number;
  power?: number;
  watts?: number;
  isOn?: boolean;
  width: number;
  height: number;
}

interface Connection {
  id: string;
  from: string;
  to: string;
}

// Generator Component
const Generator: React.FC<{
  element: CircuitElement;
  onPowerChange: (id: string, power: number) => void;
  onDrag: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
}> = ({ element, onPowerChange, onDrag, onDelete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  const power = element.power || 0;
  const isOn = power > 0;

  useEffect(() => {
    let animationId: number;
    if (isOn) {
      const animate = () => {
        setRotation((prev) => (prev + power * 3) % 360);
        animationId = requestAnimationFrame(animate);
      };
      animationId = requestAnimationFrame(animate);
    }
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isOn, power]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".delete-btn")) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const container = document.getElementById("circuit-canvas");
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const newX = Math.max(
            0,
            Math.min(
              container.clientWidth - element.width,
              e.clientX - containerRect.left - dragOffset.x
            )
          );
          const newY = Math.max(
            0,
            Math.min(
              container.clientHeight - element.height,
              e.clientY - containerRect.top - dragOffset.y
            )
          );
          onDrag(element.id, newX, newY);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [
    isDragging,
    dragOffset,
    element.id,
    element.width,
    element.height,
    onDrag,
  ]);

  const togglePower = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPower = power === 0 ? 1 : power === 1 ? 4 : 0;
    onPowerChange(element.id, newPower);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(element.id);
  };

  return (
    <div
      className="absolute select-none group"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Delete button */}
      <button
        className="delete-btn absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs z-10"
        onClick={handleDelete}
      >
        ×
      </button>

      <div className="relative bg-amber-800 border-2 border-amber-900 rounded-lg w-full h-full flex flex-col items-center justify-center shadow-lg">
        {/* Generator turbine */}
        <div
          className="w-12 h-12 rounded-full bg-amber-900 border-2 border-amber-700 flex items-center justify-center relative overflow-hidden cursor-pointer hover:bg-amber-800 transition-colors"
          onClick={togglePower}
        >
          <div
            className="w-8 h-8 transition-transform duration-75"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <path
                d="M 16 2 L 22 14 L 30 16 L 22 18 L 16 30 L 10 18 L 2 16 L 10 14 Z"
                fill="#d4a574"
                stroke="#8b6914"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>

        {/* Status indicator */}
        <div
          className={`absolute -top-1 -left-1 w-4 h-4 rounded-full border-2 border-white ${
            power === 0 ? "bg-red-500" : "bg-green-500"
          } shadow-sm`}
        />

        {/* Power level indicator */}
        <div className="absolute -bottom-1 -right-1 text-xs text-white bg-black bg-opacity-75 px-1 py-0.5 rounded text-center min-w-8">
          {power === 0
            ? "Off"
            : power === 1
            ? "On"
            : power === 4
            ? "Max"
            : `${Math.round(power * 100)}%`}
        </div>
      </div>
      <div className="text-center text-xs mt-1 font-semibold text-amber-900">
        Generator
      </div>
    </div>
  );
};

// Bulb Component
const Bulb: React.FC<{
  element: CircuitElement;
  onDrag: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
}> = ({ element, onDrag, onDelete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const watts = element.watts || 100;
  const isLit = element.isOn || false;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".delete-btn")) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const container = document.getElementById("circuit-canvas");
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const newX = Math.max(
            0,
            Math.min(
              container.clientWidth - element.width,
              e.clientX - containerRect.left - dragOffset.x
            )
          );
          const newY = Math.max(
            0,
            Math.min(
              container.clientHeight - element.height,
              e.clientY - containerRect.top - dragOffset.y
            )
          );
          onDrag(element.id, newX, newY);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [
    isDragging,
    dragOffset,
    element.id,
    element.width,
    element.height,
    onDrag,
  ]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(element.id);
  };

  return (
    <div
      className="absolute select-none group"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Delete button */}
      <button
        className="delete-btn absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs z-10"
        onClick={handleDelete}
      >
        ×
      </button>

      <div className="relative flex flex-col items-center">
        {/* Bulb glass */}
        <div
          className={`w-8 h-10 rounded-full border-2 transition-all duration-300 shadow-lg ${
            isLit
              ? "bg-yellow-200 border-yellow-400 shadow-yellow-300"
              : "bg-gray-100 border-gray-400 shadow-gray-300"
          }`}
        >
          {/* Filament */}
          <div
            className={`w-4 h-4 rounded-full mx-auto mt-3 transition-colors ${
              isLit ? "bg-yellow-600" : "bg-gray-400"
            }`}
          />
        </div>

        {/* Screw base */}
        <div className="w-6 h-1 bg-gray-800" />
        <div className="w-5 h-1 bg-gray-700" />

        {/* Wattage label */}
        <div className="text-center text-xs mt-1 font-semibold text-gray-700">
          {watts}W
        </div>
      </div>
    </div>
  );
};

// Wire Component
const Wire: React.FC<{
  connection: Connection;
  elements: CircuitElement[];
}> = ({ connection, elements }) => {
  const fromElement = elements.find((el) => el.id === connection.from);
  const toElement = elements.find((el) => el.id === connection.to);

  if (!fromElement || !toElement) return null;

  // Calculate connection points
  const startX = fromElement.x + fromElement.width / 2;
  const startY = fromElement.y + fromElement.height / 2;
  const endX = toElement.x + toElement.width / 2;
  const endY = toElement.y + toElement.height / 2;

  // Create a curved path
  const midX = (startX + endX) / 2;
  const midY = Math.min(startY, endY) - 30;

  const pathData = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ zIndex: 1 }}
      width="100%"
      height="100%"
    >
      <defs>
        <marker
          id={`arrowhead-${connection.id}`}
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#346f83" />
        </marker>
      </defs>
      {/* Wire outline */}
      <path
        d={pathData}
        stroke="#004456"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wire main line */}
      <path
        d={pathData}
        stroke="#346f83"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#arrowhead-${connection.id})`}
      />
    </svg>
  );
};

// Stencil Component
const Stencil: React.FC<{
  onDragStart: (type: string, watts?: number) => void;
}> = ({ onDragStart }) => {
  const stencilItems = [
    {
      type: "generator",
      icon: Zap,
      label: "Generator",
      color: "bg-amber-100 border-amber-300 hover:bg-amber-200",
    },
    {
      type: "bulb-100",
      icon: Lightbulb,
      label: "100W Bulb",
      color: "bg-yellow-100 border-yellow-300 hover:bg-yellow-200",
      watts: 100,
    },
    {
      type: "bulb-40",
      icon: Lightbulb,
      label: "40W Bulb",
      color: "bg-blue-100 border-blue-300 hover:bg-blue-200",
      watts: 40,
    },
  ];

  return (
    <div className="bg-white border-r border-gray-300 p-4 w-52 h-full overflow-y-auto shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
        <Cable className="w-5 h-5 mr-2" />
        Components
      </h3>
      <div className="space-y-3">
        {stencilItems.map((item) => (
          <div
            key={item.type}
            className={`p-3 border-2 rounded-lg cursor-move transition-all duration-200 ${item.color} select-none`}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("component-type", item.type);
              e.dataTransfer.setData(
                "component-watts",
                item.watts?.toString() || ""
              );
              onDragStart(item.type, item.watts);
            }}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-6 h-6 text-gray-700" />
              <span className="text-sm font-medium text-gray-800">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold mb-2 text-gray-700">
          Instructions
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Drag components to canvas</li>
          <li>• Click generator to toggle power</li>
          <li>• Drag elements to move them</li>
          <li>• Hover and click × to delete</li>
          <li>• Bulbs auto-connect to generators</li>
        </ul>
      </div>
    </div>
  );
};

// Main Circuit Simulator Component
const CircuitSimulator: React.FC = () => {
  const [elements, setElements] = useState<CircuitElement[]>([
    {
      id: "gen1",
      type: "generator",
      x: 100,
      y: 100,
      power: 1,
      width: 80,
      height: 90,
    },
    {
      id: "bulb1",
      type: "bulb",
      x: 300,
      y: 80,
      watts: 100,
      isOn: false,
      width: 50,
      height: 70,
    },
    {
      id: "bulb2",
      type: "bulb",
      x: 300,
      y: 180,
      watts: 40,
      isOn: false,
      width: 50,
      height: 70,
    },
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { id: "wire1", from: "gen1", to: "bulb1" },
    { id: "wire2", from: "gen1", to: "bulb2" },
  ]);

  const [powerLevel, setPowerLevel] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-connect new bulbs to generators
  const updateConnections = useCallback((newElements: CircuitElement[]) => {
    const generators = newElements.filter((el) => el.type === "generator");
    const bulbs = newElements.filter((el) => el.type === "bulb");

    const newConnections: Connection[] = [];

    generators.forEach((generator) => {
      bulbs.forEach((bulb) => {
        const connectionId = `wire-${generator.id}-${bulb.id}`;
        newConnections.push({
          id: connectionId,
          from: generator.id,
          to: bulb.id,
        });
      });
    });

    setConnections(newConnections);
  }, []);

  // Update bulb states based on generator power
  useEffect(() => {
    setElements((prev) => {
      const generators = prev.filter((el) => el.type === "generator");

      return prev.map((el) => {
        if (el.type === "bulb") {
          // Check if any generator provides enough power
          const hasEnoughPower = generators.some((gen) => {
            const generatorPower = (gen.power || 0) * 100;
            const bulbWatts = el.watts || 100;
            return generatorPower >= bulbWatts;
          });

          return { ...el, isOn: hasEnoughPower };
        }
        return el;
      });
    });
  }, [elements]);

  // Update connections when elements change
  useEffect(() => {
    updateConnections(elements);
  }, [elements, updateConnections]);

  const handlePowerChange = (id: string, power: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, power } : el))
    );
    // Update power level display based on any generator
    const generator = elements.find((el) => el.id === id);
    if (generator) {
      setPowerLevel(power);
    }
  };

  const handleDrag = (id: string, x: number, y: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  };

  const handleDelete = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData("component-type");
    const componentWatts =
      parseInt(e.dataTransfer.getData("component-watts")) || 100;

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newId = `${componentType.split("-")[0]}_${Date.now()}`;

      const newElement: CircuitElement = {
        id: newId,
        type: componentType.startsWith("bulb") ? "bulb" : "generator",
        x: Math.max(0, x - 40),
        y: Math.max(0, y - 40),
        width: componentType === "generator" ? 80 : 50,
        height: componentType === "generator" ? 90 : 70,
        ...(componentType.startsWith("bulb") && {
          watts: componentWatts,
          isOn: false,
        }),
        ...(componentType === "generator" && { power: 0 }),
      };

      setElements((prev) => [...prev, newElement]);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    setConnections([]);
    setPowerLevel(0);
  };

  const resetDemo = () => {
    setElements([
      {
        id: "gen1",
        type: "generator",
        x: 100,
        y: 100,
        power: 1,
        width: 80,
        height: 90,
      },
      {
        id: "bulb1",
        type: "bulb",
        x: 300,
        y: 80,
        watts: 100,
        isOn: false,
        width: 50,
        height: 70,
      },
      {
        id: "bulb2",
        type: "bulb",
        x: 300,
        y: 180,
        watts: 40,
        isOn: false,
        width: 50,
        height: 70,
      },
    ]);
    setPowerLevel(1);
  };

  const totalGenerators = elements.filter(
    (el) => el.type === "generator"
  ).length;
  const totalBulbs = elements.filter((el) => el.type === "bulb").length;
  const litBulbs = elements.filter(
    (el) => el.type === "bulb" && el.isOn
  ).length;

  return (
    <div className="flex h-screen bg-gray-100">
      <Stencil onDragStart={() => {}} />

      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-blue-600" />
              Circuit Simulator
            </h1>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>{totalGenerators} Generators</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lightbulb className="w-4 h-4" />
                <span>
                  {litBulbs}/{totalBulbs} Bulbs Lit
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Power className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                Power:{" "}
                {powerLevel === 0
                  ? "Off"
                  : powerLevel === 1
                  ? "On"
                  : powerLevel === 4
                  ? "Max"
                  : `${powerLevel}x`}
              </span>
            </div>

            <button
              onClick={resetDemo}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-1 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>

            <button
              onClick={clearCanvas}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-1 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          id="circuit-canvas"
          className="flex-1 relative bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Render wires first (background layer) */}
          <div className="absolute inset-0" style={{ zIndex: 1 }}>
            {connections.map((connection) => (
              <Wire
                key={connection.id}
                connection={connection}
                elements={elements}
              />
            ))}
          </div>

          {/* Render elements on top */}
          <div className="absolute inset-0" style={{ zIndex: 2 }}>
            {elements.map((element) => {
              if (element.type === "generator") {
                return (
                  <Generator
                    key={element.id}
                    element={element}
                    onPowerChange={handlePowerChange}
                    onDrag={handleDrag}
                    onDelete={handleDelete}
                  />
                );
              } else if (element.type === "bulb") {
                return (
                  <Bulb
                    key={element.id}
                    element={element}
                    onDrag={handleDrag}
                    onDelete={handleDelete}
                  />
                );
              }
              return null;
            })}
          </div>

          {/* Drop zone hint */}
          {elements.length === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 3 }}
            >
              <div className="text-center text-gray-500">
                <Cable className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  Drag components from the stencil to start building
                </p>
                <p className="text-sm mt-2">
                  Components will automatically connect with wires
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircuitSimulator;

// /*! JointJS+ v3.7.0 - HTML5 Diagramming Framework

// Copyright (c) 2023 client IO

//  2023-07-12

// This Source Code Form is subject to the terms of the JointJS+ License
// , v. 2.0. If a copy of the JointJS+ License was not distributed with this
// file, You can obtain one at https://www.jointjs.com/license
//  or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/

// const { dia, shapes, util, ui } = joint;

// const paperContainerEl = document.getElementById("paper-container");
// const toolbarContainerEl = document.getElementById("toolbar-container");

// // Custom view flags
// const POWER_FLAG = "POWER";
// const LIGHT_FLAG = "LIGHT";
// const FLOW_FLAG = "FLOW";
// const OPEN_FLAG = "OPEN";

// // Constants
// const LIQUID_COLOR = "#0EAD69";
// const MAX_LIQUID_COLOR = "#ED2637";
// const MIN_LIQUID_COLOR = "#FFD23F";
// const START_LIQUID = 70;
// const PRESSURE_COLOR = "#1446A0";
// const MAX_PRESSURE_COLOR = "#ED2637";

// document.documentElement.style.setProperty("--liquid-color", LIQUID_COLOR);

// // Pump metrics
// const r = 30;
// const d = 10;
// const l = (3 * r) / 4;
// const step = 20;

// class Pump extends dia.Element {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "Pump",
//       size: {
//         width: 100,
//         height: 100
//       },
//       power: 0,
//       attrs: {
//         root: {
//           magnetSelector: "body"
//         },
//         body: {
//           rx: "calc(w / 2)",
//           ry: "calc(h / 2)",
//           cx: "calc(w / 2)",
//           cy: "calc(h / 2)",
//           stroke: "gray",
//           strokeWidth: 2,
//           fill: "lightgray"
//         },
//         label: {
//           text: "Pump",
//           textAnchor: "middle",
//           textVerticalAnchor: "top",
//           x: "calc(0.5*w)",
//           y: "calc(h+10)",
//           fontSize: 14,
//           fontFamily: "sans-serif",
//           fill: "#350100"
//         },
//         rotorGroup: {
//           transform: "translate(calc(w/2),calc(h/2))",
//           event: "element:power:click",
//           cursor: "pointer"
//         },
//         rotorFrame: {
//           r: 40,
//           fill: "#eee",
//           stroke: "#666",
//           strokeWidth: 2
//         },
//         rotorBackground: {
//           r: 34,
//           fill: "#777",
//           stroke: "#222",
//           strokeWidth: 1,
//           style: {
//             transition: "fill 0.5s ease-in-out"
//           }
//         },
//         rotor: {
//           // d: `M ${a} ${a} ${b} ${r} -${b} ${r} -${a} ${a} -${r} ${b} -${r} -${b} -${a} -${a} -${b} -${r} ${b} -${r} ${a} -${a} ${r} -${b} ${r} ${b} Z`,
//           d: `M 0 0 V ${r} l ${-d} ${-l} Z M 0 0 V ${-r} l ${d} ${l} Z M 0 0 H ${r} l ${-l} ${d} Z M 0 0 H ${-r} l ${l} ${-d} Z`,
//           stroke: "#222",
//           strokeWidth: 3,
//           fill: "#bbb"
//         }
//       },
//       ports: {
//         groups: {
//           pipes: {
//             position: {
//               name: "line",
//               args: {
//                 start: { x: "calc(w / 2)", y: "calc(h)" },
//                 end: { x: "calc(w / 2)", y: 0 }
//               }
//             },
//             markup: util.svg`
//                             <rect @selector="pipeBody" />
//                             <rect @selector="pipeEnd" />
//                         `,
//             size: { width: 80, height: 30 },
//             attrs: {
//               portRoot: {
//                 magnetSelector: "pipeEnd"
//               },
//               pipeBody: {
//                 width: "calc(w)",
//                 height: "calc(h)",
//                 y: "calc(h / -2)",
//                 fill: {
//                   type: "linearGradient",
//                   stops: [
//                     { offset: "0%", color: "gray" },
//                     { offset: "30%", color: "white" },
//                     { offset: "70%", color: "white" },
//                     { offset: "100%", color: "gray" }
//                   ],
//                   attrs: {
//                     x1: "0%",
//                     y1: "0%",
//                     x2: "0%",
//                     y2: "100%"
//                   }
//                 }
//               },
//               pipeEnd: {
//                 width: 10,
//                 height: "calc(h+6)",
//                 y: "calc(h / -2 - 3)",
//                 stroke: "gray",
//                 strokeWidth: 3,
//                 fill: "white"
//               }
//             }
//           }
//         },
//         items: [
//           {
//             id: "left",
//             group: "pipes",
//             z: 1,
//             attrs: {
//               pipeBody: {
//                 x: "calc(-1 * w)"
//               },
//               pipeEnd: {
//                 x: "calc(-1 * w)"
//               }
//             }
//           },
//           {
//             id: "right",
//             group: "pipes",
//             z: 0,
//             attrs: {
//               pipeEnd: {
//                 x: "calc(w - 10)"
//               }
//             }
//           }
//         ]
//       }
//     };
//   }

//   preinitialize() {
//     this.markup = util.svg/* xml */ `
//             <ellipse @selector="body" />
//             <g @selector="rotorGroup">
//                 <circle @selector="rotorFrame" />
//                 <circle @selector="rotorBackground" />
//                 <path @selector="rotor" />
//             </g>
//             <text @selector="label" />
//         `;
//   }

//   get power() {
//     return this.get("power") || 0;
//   }

//   set power(value) {
//     this.set("power", value);
//   }
// }

// const PumpView = dia.ElementView.extend({
//   presentationAttributes: dia.ElementView.addPresentationAttributes({
//     power: [POWER_FLAG]
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
//     const [rotorEl] = this.findBySelector("rotor");
//     // It's important to use start and end frames to make it work in Safari.
//     const keyframes = { transform: ["rotate(0deg)", "rotate(360deg)"] };
//     spinAnimation = rotorEl.animate(keyframes, {
//       fill: "forwards",
//       duration: 1000,
//       iterations: Infinity
//     });
//     this.spinAnimation = spinAnimation;
//     return spinAnimation;
//   },

//   togglePower() {
//     const { model } = this;
//     this.getSpinAnimation().playbackRate = model.power;
//   }
// });

// class ControlValve extends dia.Element {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "ControlValve",
//       size: {
//         width: 60,
//         height: 60
//       },
//       open: 1,
//       attrs: {
//         root: {
//           magnetSelector: "body"
//         },
//         body: {
//           rx: "calc(w / 2)",
//           ry: "calc(h / 2)",
//           cx: "calc(w / 2)",
//           cy: "calc(h / 2)",
//           stroke: "gray",
//           strokeWidth: 2,
//           fill: {
//             type: "radialGradient",
//             stops: [
//               { offset: "80%", color: "white" },
//               { offset: "100%", color: "gray" }
//             ]
//           }
//         },
//         liquid: {
//           // We use path instead of rect to make it possible to animate
//           // the stroke-dasharray to show the liquid flow.
//           d: "M calc(w / 2 + 12) calc(h / 2) h -24",
//           stroke: LIQUID_COLOR,
//           strokeWidth: 24,
//           strokeDasharray: "3,1"
//         },
//         cover: {
//           x: "calc(w / 2 - 12)",
//           y: "calc(h / 2 - 12)",
//           width: 24,
//           height: 24,
//           stroke: "#333",
//           strokeWidth: 2,
//           fill: "#fff"
//         },
//         coverFrame: {
//           x: "calc(w / 2 - 15)",
//           y: "calc(h / 2 - 15)",
//           width: 30,
//           height: 30,
//           stroke: "#777",
//           strokeWidth: 2,
//           fill: "none",
//           rx: 1,
//           ry: 1
//         },
//         stem: {
//           width: 10,
//           height: 30,
//           x: "calc(w / 2 - 5)",
//           y: -30,
//           stroke: "#333",
//           strokeWidth: 2,
//           fill: "#555"
//         },
//         control: {
//           d: "M 0 0 C 0 -30 60 -30 60 0 Z",
//           transform: "translate(calc(w / 2 - 30), -20)",
//           stroke: "#333",
//           strokeWidth: 2,
//           rx: 5,
//           ry: 5,
//           fill: "#666"
//         },
//         label: {
//           text: "Valve",
//           textAnchor: "middle",
//           textVerticalAnchor: "top",
//           x: "calc(0.5*w)",
//           y: "calc(h+10)",
//           fontSize: 14,
//           fontFamily: "sans-serif",
//           fill: "#350100"
//         }
//       },
//       ports: {
//         groups: {
//           pipes: {
//             position: {
//               name: "absolute",
//               args: {
//                 x: "calc(w / 2)",
//                 y: "calc(h / 2)"
//               }
//             },
//             markup: util.svg`
//                           <rect @selector="pipeBody" />
//                           <rect @selector="pipeEnd" />
//                       `,
//             size: { width: 50, height: 30 },
//             attrs: {
//               portRoot: {
//                 magnetSelector: "pipeEnd"
//               },
//               pipeBody: {
//                 width: "calc(w)",
//                 height: "calc(h)",
//                 y: "calc(h / -2)",
//                 fill: {
//                   type: "linearGradient",
//                   stops: [
//                     { offset: "0%", color: "gray" },
//                     { offset: "30%", color: "white" },
//                     { offset: "70%", color: "white" },
//                     { offset: "100%", color: "gray" }
//                   ],
//                   attrs: {
//                     x1: "0%",
//                     y1: "0%",
//                     x2: "0%",
//                     y2: "100%"
//                   }
//                 }
//               },
//               pipeEnd: {
//                 width: 10,
//                 height: "calc(h+6)",
//                 y: "calc(h / -2 - 3)",
//                 stroke: "gray",
//                 strokeWidth: 3,
//                 fill: "white"
//               }
//             }
//           }
//         },
//         items: [
//           {
//             id: "left",
//             group: "pipes",
//             z: 0,
//             attrs: {
//               pipeBody: {
//                 x: "calc(-1 * w)"
//               },
//               pipeEnd: {
//                 x: "calc(-1 * w)"
//               }
//             }
//           },
//           {
//             id: "right",
//             group: "pipes",
//             z: 0,
//             attrs: {
//               pipeEnd: {
//                 x: "calc(w - 10)"
//               }
//             }
//           }
//         ]
//       }
//     };
//   }

//   preinitialize() {
//     this.markup = util.svg/* xml */ `
//           <rect @selector="stem" />
//           <path @selector="control" />
//           <ellipse @selector="body" />
//           <rect @selector="coverFrame" />
//           <path @selector="liquid" />
//           <rect @selector="cover" />
//           <text @selector="label" />
//       `;
//   }
// }

// const ControlValveView = dia.ElementView.extend({
//   presentationAttributes: dia.ElementView.addPresentationAttributes({
//     open: [OPEN_FLAG]
//   }),

//   initFlag: [dia.ElementView.Flags.RENDER, OPEN_FLAG],

//   framePadding: 6,

//   liquidAnimation: null,

//   confirmUpdate(...args) {
//     let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
//     this.animateLiquid();
//     if (this.hasFlag(flags, OPEN_FLAG)) {
//       this.updateCover();
//       flags = this.removeFlag(flags, OPEN_FLAG);
//     }
//     return flags;
//   },

//   updateCover() {
//     const { model } = this;
//     const opening = Math.max(0, Math.min(1, model.get("open") || 0));
//     const [coverEl] = this.findBySelector("cover");
//     const [coverFrameEl] = this.findBySelector("coverFrame");
//     const frameWidth =
//       Number(coverFrameEl.getAttribute("width")) - this.framePadding;
//     const width = Math.round(frameWidth * (1 - opening));
//     coverEl.animate(
//       {
//         width: [`${width}px`]
//       },
//       {
//         fill: "forwards",
//         duration: 200
//       }
//     );
//   },

//   animateLiquid() {
//     if (this.liquidAnimation) return;
//     const [liquidEl] = this.findBySelector("liquid");
//     this.liquidAnimation = liquidEl.animate(
//       {
//         // 24 matches the length of the liquid path
//         strokeDashoffset: [0, 24]
//       },
//       {
//         fill: "forwards",
//         iterations: Infinity,
//         duration: 3000
//       }
//     );
//   }
// });

// class HandValve extends dia.Element {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "HandValve",
//       size: {
//         width: 50,
//         height: 50
//       },
//       power: 0,
//       attrs: {
//         root: {
//           magnetSelector: "body"
//         },
//         body: {
//           rx: "calc(w / 2)",
//           ry: "calc(h / 2)",
//           cx: "calc(w / 2)",
//           cy: "calc(h / 2)",
//           stroke: "gray",
//           strokeWidth: 2,
//           fill: {
//             type: "radialGradient",
//             stops: [
//               { offset: "70%", color: "white" },
//               { offset: "100%", color: "gray" }
//             ]
//           }
//         },
//         stem: {
//           width: 10,
//           height: 30,
//           x: "calc(w / 2 - 5)",
//           y: -30,
//           stroke: "#333",
//           strokeWidth: 2,
//           fill: "#555"
//         },
//         handwheel: {
//           width: 60,
//           height: 10,
//           x: "calc(w / 2 - 30)",
//           y: -30,
//           stroke: "#333",
//           strokeWidth: 2,
//           rx: 5,
//           ry: 5,
//           fill: "#666"
//         },
//         label: {
//           text: "Valve",
//           textAnchor: "middle",
//           textVerticalAnchor: "top",
//           x: "calc(0.5*w)",
//           y: "calc(h+10)",
//           fontSize: "14",
//           fontFamily: "sans-serif",
//           fill: "#350100"
//         }
//       },
//       ports: {
//         groups: {
//           pipes: {
//             position: {
//               name: "absolute",
//               args: {
//                 x: "calc(w / 2)",
//                 y: "calc(h / 2)"
//               }
//             },
//             markup: util.svg`
//                           <rect @selector="pipeBody" />
//                           <rect @selector="pipeEnd" />
//                       `,
//             size: { width: 50, height: 30 },
//             attrs: {
//               portRoot: {
//                 magnetSelector: "pipeEnd"
//               },
//               pipeBody: {
//                 width: "calc(w)",
//                 height: "calc(h)",
//                 y: "calc(h / -2)",
//                 fill: {
//                   type: "linearGradient",
//                   stops: [
//                     { offset: "0%", color: "gray" },
//                     { offset: "30%", color: "white" },
//                     { offset: "70%", color: "white" },
//                     { offset: "100%", color: "gray" }
//                   ],
//                   attrs: {
//                     x1: "0%",
//                     y1: "0%",
//                     x2: "0%",
//                     y2: "100%"
//                   }
//                 }
//               },
//               pipeEnd: {
//                 width: 10,
//                 height: "calc(h+6)",
//                 y: "calc(h / -2 - 3)",
//                 stroke: "gray",
//                 strokeWidth: 3,
//                 fill: "white"
//               }
//             }
//           }
//         },
//         items: [
//           {
//             id: "left",
//             group: "pipes",
//             z: 0,
//             attrs: {
//               pipeBody: {
//                 x: "calc(-1 * w)"
//               },
//               pipeEnd: {
//                 x: "calc(-1 * w)"
//               }
//             }
//           },
//           {
//             id: "right",
//             group: "pipes",
//             z: 0,
//             attrs: {
//               pipeEnd: {
//                 x: "calc(w - 10)"
//               }
//             }
//           }
//         ]
//       }
//     };
//   }

//   preinitialize() {
//     this.markup = util.svg/* xml */ `
//           <rect @selector="stem" />
//           <rect @selector="handwheel" />
//           <ellipse @selector="body" />
//           <text @selector="label" />
//       `;
//   }
// }
// class LiquidTank extends dia.Element {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "LiquidTank",
//       size: {
//         width: 160,
//         height: 300
//       },
//       attrs: {
//         root: {
//           magnetSelector: "body"
//         },
//         legs: {
//           fill: "none",
//           stroke: "#350100",
//           strokeWidth: 8,
//           strokeLinecap: "round",
//           d: "M 20 calc(h) l -5 10 M calc(w - 20) calc(h) l 5 10"
//         },
//         body: {
//           stroke: "gray",
//           strokeWidth: 4,
//           x: 0,
//           y: 0,
//           width: "calc(w)",
//           height: "calc(h)",
//           rx: 120,
//           ry: 10,
//           fill: {
//             type: "linearGradient",
//             stops: [
//               { offset: "0%", color: "gray" },
//               { offset: "30%", color: "white" },
//               { offset: "70%", color: "white" },
//               { offset: "100%", color: "gray" }
//             ]
//           }
//         },
//         top: {
//           x: 0,
//           y: 20,
//           width: "calc(w)",
//           height: 20,
//           fill: "none",
//           stroke: "gray",
//           strokeWidth: 2
//         },
//         label: {
//           text: "Tank 1",
//           textAnchor: "middle",
//           textVerticalAnchor: "top",
//           x: "calc(w / 2)",
//           y: "calc(h + 10)",
//           fontSize: 14,
//           fontFamily: "sans-serif",
//           fill: "#350100"
//         }
//       }
//     };
//   }

//   preinitialize() {
//     this.markup = util.svg/* xml */ `
//             <path @selector="legs"/>
//             <rect @selector="body"/>
//             <rect @selector="top"/>
//             <text @selector="label" />
//         `;
//   }

//   get level() {
//     return this.get("level") || 0;
//   }

//   set level(level) {
//     const newLevel = Math.max(0, Math.min(100, level));
//     this.set("level", newLevel);
//   }
// }

// const LEVEL_FLAG = "LEVEl";

// const PanelView = dia.ElementView.extend({
//   presentationAttributes: dia.ElementView.addPresentationAttributes({
//     level: [LEVEL_FLAG],
//     color: [LEVEL_FLAG]
//   }),

//   initFlag: [dia.ElementView.Flags.RENDER, LEVEL_FLAG],

//   confirmUpdate(...args) {
//     let flags = dia.ElementView.prototype.confirmUpdate.call(this, ...args);
//     if (this.hasFlag(flags, LEVEL_FLAG)) {
//       this.updateLevel();
//       flags = this.removeFlag(flags, LEVEL_FLAG);
//     }
//     return flags;
//   },

//   updateLevel() {
//     const { model } = this;
//     const level = Math.max(0, Math.min(100, model.get("level") || 0));
//     const color = model.get("color") || "red";
//     const [liquidEl] = this.findBySelector("liquid");
//     const [windowEl] = this.findBySelector("frame");
//     const windowHeight = Number(windowEl.getAttribute("height"));
//     const height = Math.round((windowHeight * level) / 100);
//     liquidEl.animate(
//       {
//         height: [`${height}px`],
//         fill: [color]
//       },
//       {
//         fill: "forwards",
//         duration: 1000
//       }
//     );
//   }
// });

// class ConicTank extends dia.Element {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "ConicTank",
//       size: {
//         width: 160,
//         height: 100
//       },
//       attrs: {
//         root: {
//           magnetSelector: "body"
//         },
//         body: {
//           stroke: "gray",
//           strokeWidth: 4,
//           x: 0,
//           y: 0,
//           width: "calc(w)",
//           height: "calc(h)",
//           rx: 120,
//           ry: 10,
//           fill: {
//             type: "linearGradient",
//             stops: [
//               { offset: "0%", color: "gray" },
//               { offset: "30%", color: "white" },
//               { offset: "70%", color: "white" },
//               { offset: "100%", color: "gray" }
//             ]
//           }
//         },
//         top: {
//           x: 0,
//           y: 20,
//           width: "calc(w)",
//           height: 20,
//           fill: "none",
//           stroke: "gray",
//           strokeWidth: 2
//         },
//         bottom: {
//           d: "M 0 0 L calc(w) 0 L calc(w / 2 + 10) 70 h -20 Z",
//           transform: "translate(0, calc(h - 10))",
//           stroke: "gray",
//           strokeLinejoin: "round",
//           strokeWidth: 2,
//           fill: {
//             type: "linearGradient",
//             stops: [
//               { offset: "10%", color: "#aaa" },
//               { offset: "30%", color: "#fff" },
//               { offset: "90%", color: "#aaa" }
//             ],
//             attrs: {
//               gradientTransform: "rotate(-10)"
//             }
//           }
//         },
//         label: {
//           text: "Tank 2",
//           textAnchor: "middle",
//           textVerticalAnchor: "bottom",
//           x: "calc(w / 2)",
//           y: -10,
//           fontSize: 14,
//           fontFamily: "sans-serif",
//           fill: "#350100"
//         }
//       }
//     };
//   }

//   preinitialize() {
//     this.markup = util.svg/* xml */ `
//           <path @selector="bottom"/>
//           <rect @selector="body"/>
//           <rect @selector="top"/>
//           <text @selector="label" />
//       `;
//   }
// }

// class Panel extends dia.Element {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "Panel",
//       size: {
//         width: 100,
//         height: 230
//       },
//       level: 0,
//       attrs: {
//         root: {
//           magnetSelector: "panelBody"
//         },
//         panelBody: {
//           x: 0,
//           y: 0,
//           width: "calc(w)",
//           height: "calc(h)",
//           rx: 1,
//           ry: 1,
//           fill: "lightgray",
//           stroke: "gray",
//           strokeWidth: 1
//         },
//         panelWindow: {
//           // turn the panel over so that we can grow the liquid from the bottom
//           // by increasing the height of the bar.
//           transform: "translate(10, 10) rotate(180) translate(-40,-205)"
//         },
//         panelTicks: {
//           transform: "translate(55, 15)",
//           d: `M 0 0 h 8 M 0 ${step} h 8 M 0 ${step * 2} h 8 M 0 ${
//             step * 3
//           } h 8 M 0 ${step * 4} h 8 M 0 ${step * 5} h 8 M 0 ${
//             step * 6
//           } h 8 M 0 ${step * 7} h 8 M 0 ${step * 8} h 8 M 0 ${
//             step * 9
//           } h 8 M 0 ${step * 10} h 8`,
//           fill: "none",
//           stroke: "black",
//           strokeWidth: 2,
//           strokeLinecap: "round"
//         },
//         panelValues: {
//           text: "100\n90\n80\n70\n60\n50\n40\n30\n20\n10\n0",
//           textAnchor: "middle",
//           textVerticalAnchor: "top",
//           x: 80,
//           y: 10,
//           lineHeight: step,
//           fontSize: 14,
//           fontFamily: "sans-serif"
//         },
//         frame: {
//           width: 40,
//           height: 200,
//           rx: 1,
//           ry: 1,
//           fill: "none",
//           stroke: "black",
//           strokeWidth: 3
//         },
//         liquid: {
//           x: 0,
//           y: 0,
//           width: 40,
//           height: 0,
//           stroke: "black",
//           strokeWidth: 2,
//           strokeOpacity: 0.2,
//           fill: MIN_LIQUID_COLOR
//         },
//         glass: {
//           x: 0,
//           y: 0,
//           width: 40,
//           height: 200,
//           fill: "blue",
//           stroke: "none",
//           fillOpacity: 0.1
//         },
//         label: {
//           text: "Tank 1",
//           textAnchor: "middle",
//           textVerticalAnchor: "top",
//           x: "calc(w / 2)",
//           y: "calc(h + 10)",
//           fontSize: 20,
//           fontFamily: "sans-serif",
//           fill: "#350100"
//         }
//       }
//     };
//   }

//   preinitialize() {
//     this.markup = util.svg/* xml */ `
//             <rect @selector="panelBody"/>
//             <path @selector="panelTicks"/>
//             <text @selector="panelValues" />
//             <g @selector="panelWindow">
//                 <rect @selector="glass"/>
//                 <rect @selector="liquid"/>
//                 <rect @selector="frame"/>
//             </g>
//       `;
//   }
// }

// class Pipe extends dia.Link {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "Pipe",
//       z: -1,
//       router: { name: "rightAngle" },
//       flow: 1,
//       attrs: {
//         liquid: {
//           connection: true,
//           stroke: LIQUID_COLOR,
//           strokeWidth: 10,
//           strokeLinejoin: "round",
//           strokeLinecap: "square",
//           strokeDasharray: "10,20"
//         },
//         line: {
//           connection: true,
//           stroke: "#eee",
//           strokeWidth: 10,
//           strokeLinejoin: "round",
//           strokeLinecap: "round"
//         },
//         outline: {
//           connection: true,
//           stroke: "#444",
//           strokeWidth: 16,
//           strokeLinejoin: "round",
//           strokeLinecap: "round"
//         }
//       }
//     };
//   }

//   preinitialize() {
//     this.markup = util.svg/* xml */ `
//             <path @selector="outline" fill="none"/>
//             <path @selector="line" fill="none"/>
//             <path @selector="liquid" fill="none"/>
//         `;
//   }
// }

// const PipeView = dia.LinkView.extend({
//   presentationAttributes: dia.LinkView.addPresentationAttributes({
//     flow: [FLOW_FLAG]
//   }),

//   initFlag: [...dia.LinkView.prototype.initFlag, FLOW_FLAG],

//   flowAnimation: null,

//   confirmUpdate(...args) {
//     let flags = dia.LinkView.prototype.confirmUpdate.call(this, ...args);
//     if (this.hasFlag(flags, FLOW_FLAG)) {
//       this.updateFlow();
//       flags = this.removeFlag(flags, FLOW_FLAG);
//     }
//     return flags;
//   },

//   getFlowAnimation() {
//     let { flowAnimation } = this;
//     if (flowAnimation) return flowAnimation;
//     const [liquidEl] = this.findBySelector("liquid");
//     // stroke-dashoffset = sum(stroke-dasharray) * n;
//     // 90 = 10 + 20 + 10 + 20 + 10 + 20
//     const keyframes = { strokeDashoffset: [90, 0] };
//     flowAnimation = liquidEl.animate(keyframes, {
//       fill: "forwards",
//       duration: 1000,
//       iterations: Infinity
//     });
//     this.flowAnimation = flowAnimation;
//     return flowAnimation;
//   },

//   updateFlow() {
//     const { model } = this;
//     const flowRate = model.get("flow") || 0;
//     this.getFlowAnimation().playbackRate = flowRate;
//     const [liquidEl] = this.findBySelector("liquid");
//     liquidEl.style.stroke = flowRate === 0 ? "#ccc" : "";
//   }
// });

// class Zone extends joint.dia.Element {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "Zone",
//       size: {
//         width: 120,
//         height: 40
//       },
//       attrs: {
//         body: {
//           fill: "#ffffff",
//           stroke: "#cad8e3",
//           strokeWidth: 1,
//           d: "M 0 calc(0.5*h) calc(0.5*h) 0 H calc(w) V calc(h) H calc(0.5*h) Z"
//         },
//         label: {
//           fontSize: 14,
//           fontFamily: "sans-serif",
//           fontWeight: "bold",
//           fill: LIQUID_COLOR,
//           textVerticalAnchor: "middle",
//           textAnchor: "middle",
//           x: "calc(w / 2 + 10)",
//           y: "calc(h / 2)"
//         }
//       }
//     };
//   }

//   preinitialize() {
//     this.markup = util.svg/* xml */ `
//             <path @selector="body"/>
//             <text @selector="label"/>
//         `;
//   }
// }

// class Join extends dia.Element {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "Join",
//       size: {
//         width: 30,
//         height: 30
//       },
//       attrs: {
//         body: {
//           fill: "#eee",
//           stroke: "#666",
//           strokeWidth: 2,
//           d:
//             "M 10 0 H calc(w - 10) l 10 10 V calc(h - 10) l -10 10 H 10 l -10 -10 V 10 Z"
//         }
//       }
//     };
//   }

//   preinitialize() {
//     this.markup = util.svg/* xml */ `
//             <path @selector="body"/>
//         `;
//   }
// }

// const namespace = {
//   ...shapes,
//   Zone,
//   Pipe,
//   PipeView,
//   LiquidTank,
//   ConicTank,
//   Panel,
//   PanelView,
//   Pump,
//   PumpView,
//   ControlValve,
//   ControlValveView,
//   HandValve,
//   Join
// };

// const graph = new dia.Graph(
//   {},
//   {
//     cellNamespace: namespace
//   }
// );

// const paper = new dia.Paper({
//   model: graph,
//   width: "100%",
//   height: "100%",
//   async: true,
//   frozen: true,
//   sorting: dia.Paper.sorting.APPROX,
//   background: { color: "#F3F7F6" },
//   interactive: {
//     linkMove: false,
//     stopDelegation: false
//   },
//   cellViewNamespace: namespace,
//   defaultAnchor: {
//     name: "perpendicular"
//   }
// });

// paperContainerEl.appendChild(paper.el);

// // Tanks

// const tank1 = new LiquidTank({
//   position: { x: 50, y: 250 }
// });
// const panel1 = new Panel({
//   position: { x: 70, y: 300 }
// });

// // When the tank level changes, update the panel level and color.
// panel1.listenTo(tank1, "change:level", (_, level) => {
//   const color =
//     level > 80
//       ? MAX_LIQUID_COLOR
//       : level < 20
//       ? MIN_LIQUID_COLOR
//       : LIQUID_COLOR;
//   panel1.set({ level, color });
// });

// tank1.addTo(graph);
// panel1.addTo(graph);
// tank1.embed(panel1);

// // Tank 2

// const tank2 = new ConicTank({
//   position: { x: 820, y: 200 }
// });

// tank2.addTo(graph);

// // Pumps

// const pump1 = new Pump({
//   position: { x: 460, y: 250 },
//   attrs: {
//     label: {
//       text: "Pump 1"
//     }
//   }
// });

// pump1.addTo(graph);
// pump1.power = 1;

// const pump2 = new Pump({
//   position: { x: 460, y: 450 },
//   attrs: {
//     label: {
//       text: "Pump 2"
//     }
//   }
// });

// pump2.addTo(graph);
// pump2.power = 0;

// // CTRL Valves

// const controlValve1 = new ControlValve({
//   position: { x: 300, y: 295 },
//   open: 1,
//   attrs: {
//     label: {
//       text: "CTRL Valve 1"
//     }
//   }
// });

// controlValve1.addTo(graph);

// const controlValve2 = new ControlValve({
//   position: { x: 300, y: 495 },
//   open: 0.25,
//   attrs: {
//     label: {
//       text: "CTRL Valve 2"
//     }
//   }
// });

// controlValve2.addTo(graph);

// // Zones

// const zone1 = new Zone({
//   position: { x: 50, y: 600 },
//   attrs: {
//     label: {
//       text: "Zone 1"
//     }
//   }
// });

// const zone2 = new Zone({
//   position: { x: 865, y: 600 },
//   attrs: {
//     label: {
//       text: "Zone 2"
//     }
//   }
// });

// graph.addCells([zone1, zone2]);

// // Hand Valves

// const handValve1 = new HandValve({
//   position: { x: 875, y: 450 },
//   open: 1,
//   angle: 270,
//   attrs: {
//     label: {
//       text: "Valve 1"
//     }
//   }
// });

// handValve1.addTo(graph);

// const handValve2 = new HandValve({
//   position: { x: 650, y: 250 },
//   open: 1,
//   angle: 0,
//   attrs: {
//     label: {
//       text: "Valve 2"
//     }
//   }
// });

// handValve2.addTo(graph);

// const handValve3 = new HandValve({
//   position: { x: 650, y: 450 },
//   open: 1,
//   angle: 0,
//   attrs: {
//     label: {
//       text: "Valve 3"
//     }
//   }
// });

// handValve3.addTo(graph);

// // Joins

// const join1 = new Join({
//   position: { x: 772, y: 460 }
// });

// join1.addTo(graph);

// const join2 = new Join({
//   position: { x: 810, y: 605 }
// });

// join2.addTo(graph);

// // Pipes

// const tank1Pipe1 = new Pipe({
//   source: {
//     id: tank1.id,
//     anchor: { name: "right", args: { dy: -25 } },
//     connectionPoint: { name: "anchor" }
//   },
//   target: {
//     id: controlValve1.id,
//     port: "left",
//     anchor: { name: "left" }
//   }
// });

// tank1Pipe1.addTo(graph);

// const tank1Pipe2 = new Pipe({
//   source: {
//     id: tank1.id,
//     anchor: { name: "bottomRight", args: { dy: -40 } },
//     connectionPoint: { name: "anchor" }
//   },
//   target: {
//     id: controlValve2.id,
//     port: "left",
//     anchor: { name: "left" },
//     connectionPoint: { name: "anchor" }
//   }
// });

// tank1Pipe2.addTo(graph);

// const tank2Pipe1 = new Pipe({
//   source: {
//     id: tank2.id,
//     selector: "bottom",
//     anchor: { name: "bottom" },
//     connectionPoint: { name: "anchor" }
//   },
//   target: {
//     id: handValve1.id,
//     port: "right",
//     anchor: { name: "right", args: { rotate: true } },
//     connectionPoint: { name: "anchor" }
//   }
// });

// tank2Pipe1.addTo(graph);

// const ctrlValve1Pipe1 = new Pipe({
//   source: { id: controlValve1.id, port: "right", anchor: { name: "right" } },
//   target: { id: pump1.id, port: "left", anchor: { name: "left" } }
// });

// ctrlValve1Pipe1.addTo(graph);

// const valve2Pipe1 = new Pipe({
//   source: {
//     id: handValve2.id,
//     port: "right",
//     anchor: { name: "right", args: { rotate: true } },
//     connectionPoint: { name: "anchor" }
//   },
//   target: {
//     id: join1.id,
//     anchor: { name: "top" },
//     connectionPoint: { name: "anchor" }
//   }
// });

// valve2Pipe1.addTo(graph);

// const valve1Pipe1 = new Pipe({
//   source: {
//     id: handValve1.id,
//     port: "left",
//     anchor: { name: "left", args: { rotate: true } },
//     connectionPoint: { name: "anchor" }
//   },
//   target: {
//     id: join2.id,
//     anchor: { name: "top" },
//     connectionPoint: { name: "anchor" }
//   }
// });

// valve1Pipe1.addTo(graph);

// const pump1Pipe1 = new Pipe({
//   source: {
//     id: pump1.id,
//     port: "right",
//     anchor: { name: "right", args: { rotate: true } },
//     connectionPoint: { name: "anchor" }
//   },
//   target: {
//     id: handValve2.id,
//     port: "left",
//     anchor: { name: "left", args: { rotate: true } },
//     connectionPoint: { name: "anchor" }
//   }
// });

// pump1Pipe1.addTo(graph);

// const valve3Pipe1 = new Pipe({
//   source: {
//     id: handValve3.id,
//     port: "right",
//     anchor: { name: "right", args: { rotate: true } },
//     connectionPoint: { name: "anchor" }
//   },
//   target: {
//     id: join1.id,
//     anchor: { name: "left" },
//     connectionPoint: { name: "anchor" }
//   }
// });

// valve3Pipe1.addTo(graph);

// const pump2Pipe1 = new Pipe({
//   source: {
//     id: pump2.id,
//     port: "right",
//     anchor: { name: "right", args: { rotate: true } },
//     connectionPoint: { name: "anchor" }
//   },
//   target: {
//     id: handValve3.id,
//     port: "left",
//     anchor: { name: "left", args: { rotate: true } },
//     connectionPoint: { name: "anchor" }
//   }
// });

// pump2Pipe1.addTo(graph);

// const ctrlValve2Pipe1 = new Pipe({
//   source: { id: controlValve2.id, port: "right", anchor: { name: "right" } },
//   target: {
//     id: pump2.id,
//     port: "left",
//     anchor: { name: "left", args: { rotate: true } },
//     connectionPoint: { name: "anchor" }
//   }
// });

// ctrlValve2Pipe1.addTo(graph);

// const zone1Pipe1 = new Pipe({
//   source: {
//     id: zone1.id,
//     port: "left",
//     anchor: { name: "left", args: { rotate: true, dx: 10 } },
//     connectionPoint: { name: "anchor" }
//   },
//   target: {
//     id: tank1.id,
//     anchor: { name: "bottomLeft", args: { dy: -30 } },
//     connectionPoint: { name: "anchor" }
//   }
// });

// zone1Pipe1.addTo(graph);

// const join1Pipe1 = new Pipe({
//   source: {
//     id: join1.id,
//     anchor: { name: "bottom" },
//     connectionPoint: { name: "anchor" }
//   },
//   target: {
//     id: join2.id,
//     anchor: { name: "left" },
//     connectionPoint: { name: "anchor" }
//   }
// });

// join1Pipe1.addTo(graph);

// const join2Pipe1 = new Pipe({
//   source: {
//     id: join2.id,
//     anchor: { name: "right" },
//     connectionPoint: { name: "anchor" }
//   },
//   target: {
//     id: zone2.id,
//     anchor: { name: "left", args: { dx: 10 } },
//     connectionPoint: { name: "anchor" }
//   }
// });

// join2Pipe1.addTo(graph);

// // Charts

// const maxPoints = 10;
// const tankChart = new shapes.chart.Plot({
//   position: { x: 50, y: 50 },
//   size: { width: 300, height: 150 },
//   series: [
//     {
//       name: "level",
//       interpolate: "linear",
//       showLegend: false,
//       fillPadding: { top: 10 },
//       data: Array.from({ length: maxPoints }).map((_, i) => ({
//         x: i,
//         y: START_LIQUID
//       }))
//     }
//   ],
//   axis: {
//     "y-axis": {
//       min: 0,
//       max: 100,
//       ticks: 10
//     },
//     "x-axis": {
//       tickFormat: function (t) {
//         const d = new Date(t * 1000);
//         return (
//           d.getMinutes().toString().padStart(2, "0") +
//           ":" +
//           d.getSeconds().toString().padStart(2, "0")
//         );
//       }
//     }
//   },
//   padding: 0,
//   markings: [
//     {
//       name: "max",
//       start: { y: 80 }
//     },
//     {
//       name: "min",
//       end: { y: 20 }
//     }
//   ],
//   // Historically, the chart shapes are defined without camel-cased attributes
//   attrs: {
//     ".": {
//       "font-family": "sans-serif"
//     },
//     ".level path": {
//       stroke: "#0075f2",
//       "stroke-width": 1,
//       "stroke-opacity": "0.8",
//       fill: "#0075f2",
//       "fill-opacity": "0.3"
//     },
//     ".marking.max rect": {
//       fill: MAX_LIQUID_COLOR,
//       height: 3
//     },
//     ".marking.min rect": {
//       fill: MIN_LIQUID_COLOR,
//       height: 3
//     },
//     ".point circle": {
//       fill: "#0075f2",
//       stroke: "none",
//       opacity: 1
//     },
//     ".y-axis > path, .x-axis > path": {
//       stroke: "#131e29",
//       "stroke-width": 2
//     },
//     ".background rect": {
//       fill: "#999",
//       "fill-opacity": "0.1"
//     }
//   }
// });

// tankChart.addTo(graph);

// const tankChartLink = new shapes.standard.Link({
//   source: { id: tankChart.id },
//   target: { id: tank1.id },
//   attrs: {
//     line: {
//       strokeDasharray: "5 5",
//       targetMarker: null,
//       stroke: "#aaa"
//     }
//   }
// });

// tankChartLink.addTo(graph);

// const gauge1 = new shapes.chart.Knob({
//   position: { x: 380, y: 100 },
//   size: { width: 120, height: 120 },
//   min: 0,
//   max: 10,
//   step: 0.1,
//   value: 1,
//   fill: PRESSURE_COLOR,
//   // Historically, the chart shapes are defined without camel-cased attributes
//   attrs: {
//     root: {
//       "font-family": "sans-serif"
//     }
//   },
//   serieDefaults: {
//     startAngle: 90,
//     label: "Ⓟ bar"
//   },
//   sliceDefaults: {
//     legendLabel: "{value:.1f}",
//     onClickEffect: { type: "none" }
//   }
// });

// gauge1.addTo(graph);

// const gauge1Link = new shapes.standard.Link({
//   source: { id: gauge1.id, anchor: { name: "bottom" } },
//   target: { id: ctrlValve1Pipe1.id },
//   z: -1,
//   attrs: {
//     line: {
//       strokeDasharray: "5 5",
//       targetMarker: {
//         type: "circle",
//         r: 12,
//         fill: "#eee",
//         stroke: "#666",
//         "stroke-width": 2
//       },
//       stroke: "#aaa"
//     }
//   }
// });

// gauge1Link.addTo(graph);

// const gauge2 = gauge1.clone();
// const gauge2Link = gauge1Link.clone();

// gauge2.position(380, 600);

// gauge2Link.source({ id: gauge2.id, anchor: { name: "bottom" } });
// gauge2Link.target({ id: ctrlValve2Pipe1.id });

// gauge2.addTo(graph);
// gauge2Link.addTo(graph);

// // Controls
// // A custom highlighters using the foreignObject element to embed HTML form controls
// // The styling is done in CSS

// const PumpControl = dia.HighlighterView.extend({
//   UPDATE_ATTRIBUTES: ["power"],
//   tagName: "g",
//   children: util.svg/* xml */ `
//         <foreignObject width="20" height="20">
//             <div class="jj-checkbox" xmlns="http://www.w3.org/1999/xhtml">
//                 <input @selector="input" class="jj-checkbox-input" type="checkbox" style="width: 14px; height: 14px; box-sizing: border-box; margin: 2px;"/>
//             </div>
//         </foreignObject>
//     `,
//   events: {
//     "change input": "onChange"
//   },
//   attributes: {
//     transform: "translate(5, 5)"
//   },
//   highlight: function (cellView) {
//     this.renderChildren();
//     this.childNodes.input.checked = Boolean(cellView.model.power);
//   },
//   onChange: function (evt) {
//     this.cellView.model.power = evt.target.checked ? 1 : 0;
//   }
// });

// const ToggleValveControl = dia.HighlighterView.extend({
//   UPDATE_ATTRIBUTES: ["open"],
//   children: util.svg/* xml */ `
//         <foreignObject width="100" height="50">
//             <div class="jj-switch" xmlns="http://www.w3.org/1999/xhtml">
//                 <div @selector="label" class="jj-switch-label" style=""></div>
//                 <button @selector="buttonOn" class="jj-switch-on">open</button>
//                 <button @selector="buttonOff" class="jj-switch-off">close</button>
//             </div>
//         </foreignObject>
//     `,
//   events: {
//     "click button": "onButtonClick"
//   },
//   highlight: function (cellView) {
//     this.renderChildren();
//     const { model } = cellView;
//     const { el, childNodes } = this;
//     const size = model.size();
//     const isOpen = model.get("open");
//     el.setAttribute(
//       "transform",
//       `translate(${size.width / 2 - 50}, ${size.height + 10})`
//     );
//     childNodes.buttonOn.disabled = !isOpen;
//     childNodes.buttonOff.disabled = isOpen;
//     childNodes.label.textContent = model.attr("label/text");
//   },
//   onButtonClick: function (evt) {
//     const { model } = this.cellView;
//     const isOpen = model.get("open");
//     model.set("open", !isOpen);
//   }
// });

// const SliderValveControl = dia.HighlighterView.extend({
//   UPDATE_ATTRIBUTES: ["open"],
//   children: util.svg/* xml */ `
//         <foreignObject width="100" height="60">
//             <div class="jj-slider" xmlns="http://www.w3.org/1999/xhtml">
//                 <div @selector="label" class="jj-slider-label" style="">Valve 4</div>
//                 <input @selector="slider" class="jj-slider-input" type="range" min="0" max="100" step="25" style="width:100%;"/>
//                 <output @selector="value" class="jj-slider-output"></output>
//             </div>
//         </foreignObject>
//     `,
//   events: {
//     "input input": "onInput"
//   },
//   highlight: function (cellView) {
//     const { name = "" } = this.options;
//     const { model } = cellView;
//     const size = model.size();
//     if (!this.childNodes) {
//       // Render the slider only once to allow the user to drag it.
//       this.renderChildren();
//       this.childNodes.slider.value = model.get("open") * 100;
//     }
//     this.el.setAttribute(
//       "transform",
//       `translate(${size.width / 2 - 50}, ${size.height + 10})`
//     );
//     this.childNodes.label.textContent = name;
//     this.childNodes.value.textContent = this.getSliderTextValue(
//       model.get("open")
//     );
//   },
//   getSliderTextValue: function (value = 0) {
//     if (value === 0) {
//       return "Closed";
//     }
//     if (value === 1) {
//       return "Open";
//     }
//     return `${value * 100}% open`;
//   },
//   onInput: function (evt) {
//     this.cellView.model.set("open", Number(evt.target.value) / 100);
//   }
// });

// // Create all controls and add them to the graph
// addControls(paper);

// // Transform the paper so that the content fits the viewport
// paper.transformToFitContent({
//   useModelGeometry: true,
//   padding: { top: 80, bottom: 10, horizontal: 50 },
//   horizontalAlign: "middle",
//   verticalAlign: "top"
// });

// // Start rendering the content and highlighters
// paper.unfreeze();

// // Toolbar

// const toolbar = new ui.Toolbar({
//   tools: [
//     {
//       type: "label",
//       name: "title",
//       text: "SCADA: Piping & Instrumentation Diagram"
//     },
//     {
//       type: "separator"
//     },
//     {
//       type: "checkbox",
//       name: "controls",
//       label: "Controls",
//       value: true
//     },
//     {
//       type: "checkbox",
//       name: "instrumentation",
//       label: "Instrumentation",
//       value: true
//     },
//     {
//       type: "separator"
//     },
//     {
//       type: "label",
//       text: "Color"
//     },
//     {
//       type: "color-picker",
//       name: "color",
//       value: getComputedStyle(document.documentElement).getPropertyValue(
//         "--accent-color"
//       )
//     }
//   ]
// });

// toolbarContainerEl.appendChild(toolbar.el);

// toolbar.render();
// toolbar.on({
//   "controls:change": (value) => {
//     if (value) {
//       addControls(paper);
//     } else {
//       removeControls(paper);
//     }
//   },
//   "instrumentation:change": (value) => {
//     if (value) {
//       addCharts(paper);
//     } else {
//       removeCharts(paper);
//     }
//   },
//   "color:input": (value) => {
//     document.documentElement.style.setProperty("--accent-color", value);
//   }
// });

// function addControls(paper) {
//   const graph = paper.model;
//   graph.getElements().forEach((cell) => {
//     switch (cell.get("type")) {
//       case "ControlValve":
//         SliderValveControl.add(cell.findView(paper), "root", "slider", {
//           name: cell.attr("label/text")
//         });
//         break;
//       case "HandValve":
//         ToggleValveControl.add(cell.findView(paper), "root", "button");
//         break;
//       case "Pump":
//         PumpControl.add(cell.findView(paper), "root", "selection");
//         break;
//     }
//   });
// }

// function removeControls(paper) {
//   SliderValveControl.removeAll(paper);
//   ToggleValveControl.removeAll(paper);
//   PumpControl.removeAll(paper);
// }

// function addCharts(paper) {
//   paper.options.viewport = null;
// }

// function removeCharts(paper) {
//   const chartTypes = ["chart.Knob", "chart.Plot", "standard.Link"];
//   paper.options.viewport = (view) => {
//     return !chartTypes.includes(view.model.get("type"));
//   };
// }

// // Simulation
// // A dummy system for the purpose of this demo

// tank1.level = START_LIQUID;

// let extraLiquid = 0;

// setInterval(function () {
//   const tank1Level = tank1.level;
//   const liquidIn = g.random(0, 15);

//   let newLevel = tank1Level + liquidIn;
//   if (newLevel >= 100) {
//     extraLiquid += newLevel - 100;
//   } else {
//     extraLiquid = 0;
//   }

//   // Tank 1 Instrumentation
//   tankChart.addPoint(
//     { x: tankChart.lastPoint("level").x + 1, y: tank1Level },
//     "level",
//     { maxLen: maxPoints }
//   );

//   // Tank 1 Pipes
//   const tank1Pipe1Flow = tank1Level > 70 ? 1 : 0;
//   const tank1Pipe2Flow = tank1Level > 0 ? 1 : 0;
//   tank1Pipe1.set("flow", tank1Pipe1Flow);
//   tank1Pipe2.set("flow", tank1Pipe2Flow);

//   // CTRL Valve 1
//   const ctrlValve1Open = controlValve1.get("open");
//   const ctrlValve1Pipe1Flow = tank1Pipe1Flow * ctrlValve1Open;
//   ctrlValve1Pipe1.set("flow", ctrlValve1Pipe1Flow);
//   // CTRL Valve 2
//   const ctrlValve2Open = controlValve2.get("open");
//   const ctrlValve2Pipe1Flow = tank1Pipe2Flow * ctrlValve2Open;
//   ctrlValve2Pipe1.set("flow", ctrlValve2Pipe1Flow);

//   // Pump 1
//   const pump1Power = pump1.power;
//   const pump1Pipe1Flow = ctrlValve1Pipe1Flow * (1 + 2 * pump1Power);
//   pump1Pipe1.set("flow", pump1Pipe1Flow);

//   // Pump 2
//   const pump2Power = pump2.power;
//   const pump2Pipe1Flow = ctrlValve2Pipe1Flow * (1 + 2 * pump2Power);
//   pump2Pipe1.set("flow", pump2Pipe1Flow);

//   // Hand Valve 2
//   const handValve2Open = Number(handValve2.get("open"));
//   const handValve2Pipe1Flow = pump1Pipe1Flow * handValve2Open;
//   valve2Pipe1.set("flow", handValve2Pipe1Flow);

//   // Hand Valve 3
//   const handValve3Open = Number(handValve3.get("open"));
//   const handValve3Pipe1Flow = pump2Pipe1Flow * handValve3Open;
//   valve3Pipe1.set("flow", handValve3Pipe1Flow);

//   // Join 1
//   const join1Pipe1Flow = handValve2Pipe1Flow + handValve3Pipe1Flow;
//   join1Pipe1.set("flow", join1Pipe1Flow);

//   // Tank 2
//   const tank2Pipe1Flow = 0.5; // constant flow
//   tank2Pipe1.set("flow", tank2Pipe1Flow);

//   // Hand Valve 1
//   const handValve1Open = Number(handValve1.get("open"));
//   const handValve1Pipe1Flow = tank2Pipe1Flow * handValve1Open;
//   valve1Pipe1.set("flow", handValve1Pipe1Flow);

//   // Join 2
//   const join2Pipe1Flow = join1Pipe1Flow + handValve1Pipe1Flow;
//   join2Pipe1.set("flow", join2Pipe1Flow);

//   // Tank1
//   const liquidOut = join2Pipe1Flow * 4;
//   tank1.level = tank1Level + liquidIn - liquidOut;

//   // Gauge 1
//   let pressure1 = ctrlValve1Pipe1Flow * 10;
//   if (pressure1 > 0) {
//     pressure1 += Math.min(30, extraLiquid * Math.max(1.1 - handValve2Open));
//     if (handValve2Open === 0) {
//       pressure1 += Math.max(0, tank1Level - 70) * 0.3;
//     }
//   }
//   gauge1.transition("value", pressure1 / 10);
//   gauge1.transition(
//     "fill",
//     pressure1 > 30 ? MAX_PRESSURE_COLOR : PRESSURE_COLOR,
//     { valueFunction: util.interpolate.hexColor, duration: 1000 }
//   );

//   // Gauge 2
//   let pressure2 = ctrlValve2Pipe1Flow * 10;
//   if (pressure2 > 0) {
//     pressure2 += Math.min(30, extraLiquid * Math.max(1.1 - handValve3Open));
//     if (handValve3Open === 0) {
//       pressure2 += tank1Level * 0.3;
//     }
//   }
//   gauge2.transition("value", pressure2 / 10);
//   gauge2.transition(
//     "fill",
//     pressure2 > 30 ? MAX_PRESSURE_COLOR : PRESSURE_COLOR,
//     { valueFunction: util.interpolate.hexColor, duration: 1000 }
//   );
// }, 1000);
