import React, { useEffect, useRef, useState } from "react";

const Generator = ({
  width = 100,
  height = 120,
  initialPower = 0,
  x = 0,
  y = 0,
  onPowerClick,
}) => {
  const generatorRef = useRef(null);
  const [power, setPower] = useState(initialPower);
  const [isAnimating, setIsAnimating] = useState(false);

  // Constants for generator path
  const a = 10;
  const b = 5;
  const r = 15;

  // Corrected generator path data
  const generatorPath = `
    M ${a} ${a} L ${b} ${r} L -${b} ${r} L -${a} ${a} L -${r} ${b} L -${r} -${b}
    L -${a} -${a} L -${b} -${r} L ${b} -${r} L ${a} -${a} L ${r} -${b} L ${r} ${b} Z
  `;

  useEffect(() => {
    const generatorEl = generatorRef.current;
    if (!generatorEl) return;

    let animation = null;
    if (power > 0) {
      // Create animation only when power is on
      const keyframes = [
        { transform: "rotate(0deg)" },
        { transform: "rotate(360deg)" },
      ];

      animation = generatorEl.animate(keyframes, {
        fill: "forwards",
        duration: 1000,
        iterations: Infinity,
        playbackRate: power,
      });
      setIsAnimating(true);
    } else {
      // Reset rotation when off
      generatorEl.style.transform = "none";
      setIsAnimating(false);
    }

    return () => {
      if (animation) {
        animation.cancel();
      }
    };
  }, [power]);

  // Toggle power state
  const togglePower = () => {
    const newPower = power === 0 ? 1 : 0;
    setPower(newPower);
  };

  // Calculate transform for centering
  const groupTransform = `translate(${width / 2}, ${height / 2})`;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={height}
        fill="#945042"
        stroke="#7f4439"
        strokeWidth={2}
        rx={5}
        ry={5}
      />
      <g
        transform={groupTransform}
        onClick={onPowerClick}
        style={{ cursor: "pointer" }}
      >
        <circle r={24} fill="#350100" stroke="#a95b4c" strokeWidth={2} />
        <path
          ref={generatorRef}
          d={generatorPath}
          stroke="#a95b4c"
          strokeWidth={2}
          fill="#c99287"
        />
      </g>
      <text
        x={width / 2}
        y={height + 10}
        textAnchor="middle"
        fontSize={14}
        fontFamily="sans-serif"
        fill="#350100"
      >
        Generator
      </text>
      <g
        transform={`translate(${width - 20}, ${height + 20})`}
        onClick={togglePower}
        style={{ cursor: "pointer" }}
      >
        <rect
          width={16}
          height={16}
          rx={3}
          fill={power > 0 ? "#4CAF50" : "#F44336"}
          stroke="#350100"
          strokeWidth={1}
        />
        <text
          x={8}
          y={12}
          textAnchor="middle"
          fontSize={10}
          fontFamily="sans-serif"
          fill="#FFFFFF"
        >
          {power > 0 ? "ON" : "OFF"}
        </text>
      </g>
    </g>
  );
};

export default Generator;
