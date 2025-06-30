import { dia } from "@joint/plus";

export const StatusEffect = dia.HighlighterView.extend({
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

export const PlaybackRateEffect = dia.HighlighterView.extend({
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
