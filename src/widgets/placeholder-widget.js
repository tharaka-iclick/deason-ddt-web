import { dia } from "@joint/plus";

export class Placeholder extends dia.Element {
  defaults() {
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

  static isPlaceholder(element) {
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
export const equipmentPlaceholder = new Placeholder({
  size: { width: 200, height: 80 },
  attrs: {
    body: { strokeWidth: 2, strokeDasharray: "5,5", stroke: "#87A7C0" },
    label: { text: "Drop equipment here.", fill: "#87A7C0" },
  },
});

export const sensorsPlaceholder = new Placeholder({
  size: { width: 200, height: 80 },
  attrs: {
    body: { strokeWidth: 2, strokeDasharray: "5,5", stroke: "#87A7C0" },
    label: { text: "Drop sensors here.", fill: "#87A7C0" },
  },
});
