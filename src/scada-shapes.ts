import { dia, shapes } from "@joint/plus";

// Define the shape defaults interface
interface SCADAShapeDefaults {
  type: string;
  size: { width: number; height: number };
  attrs: {
    label: {
      text: string;
      refY: string;
      refY2: number;
      textAnchor: string;
      textVerticalAnchor: string;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

// Base SCADA shape with common properties
class SCADAShape extends dia.Element {
  defaults(): SCADAShapeDefaults {
    return {
      ...super.defaults,
      type: "scada.Shape",
      size: { width: 60, height: 60 },
      attrs: {
        label: {
          text: "",
          refY: "100%",
          refY2: 5,
          textAnchor: "middle",
          textVerticalAnchor: "top",
        },
      },
    };
  }
}

// Pump shape
export class Pump extends SCADAShape {
  markup = [
    { tagName: "path", selector: "body" },
    { tagName: "path", selector: "inlet" },
    { tagName: "path", selector: "outlet" },
    { tagName: "text", selector: "label" },
  ];

  defaults(): SCADAShapeDefaults {
    return {
      ...super.defaults(),
      type: "scada.Pump",
      size: { width: 80, height: 60 },
      attrs: {
        ...super.defaults().attrs,
        body: {
          fill: "#3498DB",
          stroke: "#2980B9",
          strokeWidth: 2,
          d: "M 10 30 L 30 10 L 50 30 L 30 50 Z M 30 10 L 30 50 M 50 30 L 70 30",
        },
        inlet: {
          fill: "none",
          stroke: "#2980B9",
          strokeWidth: 2,
          d: "M 0 30 L 10 30",
        },
        outlet: {
          fill: "none",
          stroke: "#2980B9",
          strokeWidth: 2,
          d: "M 70 30 L 80 30",
        },
        label: {
          ...super.defaults().attrs.label,
          text: "Pump",
        },
      },
    };
  }
}

// Valve shape
export class Valve extends SCADAShape {
  markup = [
    { tagName: "path", selector: "body" },
    { tagName: "path", selector: "handle" },
    { tagName: "text", selector: "label" },
  ];

  defaults(): SCADAShapeDefaults {
    return {
      ...super.defaults(),
      type: "scada.Valve",
      size: { width: 80, height: 60 },
      attrs: {
        ...super.defaults().attrs,
        body: {
          fill: "#E74C3C",
          stroke: "#C0392B",
          strokeWidth: 2,
          d: "M 10 30 L 30 10 L 50 30 L 30 50 Z M 0 30 L 10 30 M 50 30 L 80 30",
        },
        handle: {
          fill: "none",
          stroke: "#C0392B",
          strokeWidth: 2,
          d: "M 30 50 L 30 70",
        },
        label: {
          ...super.defaults().attrs.label,
          text: "Valve",
        },
      },
    };
  }
}

// Tank shape
export class Tank extends SCADAShape {
  markup = [
    { tagName: "path", selector: "body" },
    { tagName: "text", selector: "label" },
  ];

  defaults(): SCADAShapeDefaults {
    return {
      ...super.defaults(),
      type: "scada.Tank",
      size: { width: 60, height: 80 },
      attrs: {
        ...super.defaults().attrs,
        body: {
          fill: "#2ECC71",
          stroke: "#27AE60",
          strokeWidth: 2,
          d: "M 10 10 L 10 70 C 10 80 50 80 50 70 L 50 10 Z",
        },
        label: {
          ...super.defaults().attrs.label,
          text: "Tank",
        },
      },
    };
  }
}

// Flowmeter shape
export class Flowmeter extends SCADAShape {
  markup = [
    { tagName: "path", selector: "body" },
    { tagName: "path", selector: "indicator" },
    { tagName: "text", selector: "label" },
  ];

  defaults(): SCADAShapeDefaults {
    return {
      ...super.defaults(),
      type: "scada.Flowmeter",
      size: { width: 80, height: 60 },
      attrs: {
        ...super.defaults().attrs,
        body: {
          fill: "#9B59B6",
          stroke: "#8E44AD",
          strokeWidth: 2,
          d: "M 10 30 L 30 10 L 50 30 L 30 50 Z M 0 30 L 10 30 M 50 30 L 80 30",
        },
        indicator: {
          fill: "none",
          stroke: "#8E44AD",
          strokeWidth: 2,
          d: "M 20 20 L 40 40 M 20 40 L 40 20",
        },
        label: {
          ...super.defaults().attrs.label,
          text: "Flow Meter",
        },
      },
    };
  }
}
// Pressure Sensor shape
export class PressureSensor extends SCADAShape {
  markup = [
    { tagName: "path", selector: "body" },
    { tagName: "path", selector: "connection" },
    { tagName: "text", selector: "label" },
  ];

  defaults(): SCADAShapeDefaults {
    return {
      ...super.defaults(),
      type: "scada.PressureSensor",
      size: { width: 60, height: 60 },
      attrs: {
        ...super.defaults().attrs,
        body: {
          fill: "#F39C12",
          stroke: "#D35400",
          strokeWidth: 2,
          d: "M 30 10 L 50 30 L 30 50 L 10 30 Z",
        },
        connection: {
          fill: "none",
          stroke: "#D35400",
          strokeWidth: 2,
          d: "M 30 50 L 30 70",
        },
        label: {
          ...super.defaults().attrs.label,
          text: "Pressure",
        },
      },
    };
  }
}

// Temperature Sensor shape
export class TemperatureSensor extends SCADAShape {
  markup = [
    { tagName: "path", selector: "body" },
    { tagName: "path", selector: "indicator" },
    { tagName: "text", selector: "label" },
  ];

  defaults(): SCADAShapeDefaults {
    return {
      ...super.defaults(),
      type: "scada.TemperatureSensor",
      size: { width: 60, height: 60 },
      attrs: {
        ...super.defaults().attrs,
        body: {
          fill: "#E67E22",
          stroke: "#D35400",
          strokeWidth: 2,
          d: "M 30 10 L 50 30 L 30 50 L 10 30 Z",
        },
        indicator: {
          fill: "none",
          stroke: "#D35400",
          strokeWidth: 2,
          d: "M 30 30 L 30 50 M 30 40 L 20 40 M 30 40 L 40 40",
        },
        label: {
          ...super.defaults().attrs.label,
          text: "Temperature",
        },
      },
    };
  }
}
// Pipe element
export class Pipe extends SCADAShape {
  markup = [
    { tagName: "path", selector: "line" },
    { tagName: "text", selector: "label" },
  ];

  defaults(): SCADAShapeDefaults {
    return {
      ...super.defaults(),
      type: "scada.Pipe",
      size: { width: 80, height: 20 },
      attrs: {
        ...super.defaults().attrs,
        line: {
          fill: "none",
          stroke: "#7F8C8D",
          strokeWidth: 8,
          d: "M 0 10 L 80 10",
        },
        label: {
          ...super.defaults().attrs.label,
          text: "Pipe",
        },
      },
    };
  }
}
// Controller (PLC) shape
export class Controller extends SCADAShape {
  markup = [
    { tagName: "path", selector: "body" },
    { tagName: "path", selector: "display" },
    { tagName: "text", selector: "label" },
  ];

  defaults(): SCADAShapeDefaults {
    return {
      ...super.defaults(),
      type: "scada.Controller",
      size: { width: 70, height: 50 },
      attrs: {
        ...super.defaults().attrs,
        body: {
          fill: "#34495E",
          stroke: "#2C3E50",
          strokeWidth: 2,
          d: "M 10 10 L 60 10 L 60 40 L 10 40 Z",
        },
        display: {
          fill: "#ECF0F1",
          stroke: "#BDC3C7",
          strokeWidth: 1,
          d: "M 15 15 L 55 15 L 55 35 L 15 35 Z",
        },
        label: {
          ...super.defaults().attrs.label,
          text: "PLC",
        },
      },
    };
  }
}
// Register all custom shapes
export function registerSCADAShapes() {
  // const namespace = { ...shapes };

  const namespace = {
    ...shapes,
    scada: {
      Pump,
      Valve,
      Tank,
      Flowmeter,
      PressureSensor,
      TemperatureSensor,
      Pipe,
      Controller,
    },
  };

  dia.Element.define("scada.Pump", Pump);
  dia.Element.define("scada.Valve", Valve);
  dia.Element.define("scada.Tank", Tank);
  dia.Element.define("scada.Flowmeter", Flowmeter);
  dia.Element.define("scada.PressureSensor", PressureSensor);
  dia.Element.define("scada.TemperatureSensor", TemperatureSensor);
  dia.Element.define("scada.Pipe", Pipe);
  dia.Element.define("scada.Controller", Controller);

  return namespace;
}
