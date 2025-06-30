import { dia, util } from "@joint/plus";

export class Wire extends dia.Link {
  defaults() {
    return {
      ...super.defaults,
      type: "Wire",
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
