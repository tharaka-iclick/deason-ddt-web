import React, { useState } from "react";

const Bulb = ({
  width = 40,
  height = 40,
  initialState = false,
  x = 0,
  y = 0,
  onClick,
}) => {
  const [isOn, setIsOn] = useState(initialState);

  const toggleState = () => {
    setIsOn(!isOn);
  };

  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle
        cx={width / 2}
        cy={height / 2}
        r={18}
        fill={isOn ? "#FFFF99" : "#CCCCCC"}
        stroke="#333333"
        strokeWidth={2}
        onClick={onClick}
        style={{ cursor: "pointer" }}
      />
      <text
        x={width / 2}
        y={height + 10}
        textAnchor="middle"
        fontSize={12}
        fontFamily="sans-serif"
        fill="#333333"
      >
        Bulb
      </text>
      <g
        transform={`translate(${width - 16}, ${height + 20})`}
        onClick={toggleState}
        style={{ cursor: "pointer" }}
      >
        <rect
          width={16}
          height={16}
          rx={3}
          fill={isOn ? "#4CAF50" : "#F44336"}
          stroke="#333333"
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
          {isOn ? "ON" : "OFF"}
        </text>
      </g>
    </g>
  );
};

export default Bulb;
