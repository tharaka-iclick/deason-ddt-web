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
  connectors,
  anchors,
  linkTools,
} from "@joint/plus";
import "./styles.css";
import {
  Shape,
  PortTargetArrowhead,
  createShapes,
} from "./../widgets/diagramElements";
import { Pipe01, PipeView01, createPipe } from "./../widgets/pipeLink";
import { Pump, PumpView } from "../DDTWidget/Pump";
import { ConicTank } from "../DDTWidget/ConicTank";
import { ControlValve, ControlValveView } from "../DDTWidget/ControlValve";
import { HandValve } from "../DDTWidget/HandValve";
import { Join } from "../DDTWidget/Join";
import { LiquidTank, PanelView } from "../DDTWidget/LiquidTank";
import { Panel } from "../DDTWidget/Panel";
import { Pipe, PipeView } from "../DDTWidget/Pipe";
import { Zone } from "../DDTWidget/Zone";

const POWER_FLAG = "POWER";
const LIGHT_FLAG = "LIGHT";
const FLOW_FLAG = "FLOW";
const OPEN_FLAG = "OPEN";

const LIQUID_COLOR = "#0EAD69";
const MAX_LIQUID_COLOR = "#ED2637";
const MIN_LIQUID_COLOR = "#FFD23F";
const START_LIQUID = 70;
const PRESSURE_COLOR = "#1446A0";
const MAX_PRESSURE_COLOR = "#ED2637";

const r = 30;
const d = 10;
const l = (3 * r) / 4;
const step = 20;

const HeatPumpSVG = `<?xml version="1.0" ?>
<svg width="680" height="396" viewBox="0 0 680 396" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="680" height="396" fill="#F5F5F5"/>
<g id="Heat Pump">
<g id="Body">
<g id="Feet">
<rect id="Rectangle 1" x="82" y="370" width="58" height="11" fill="url(#paint0_linear_0_1)"/>
<rect id="Rectangle 2" x="47" y="381" width="128" height="15" fill="#808080"/>
</g>
<g id="Feet_2">
<rect id="Rectangle 1_2" x="476" y="370" width="58" height="11" fill="url(#paint1_linear_0_1)"/>
<rect id="Rectangle 2_2" x="441" y="381" width="128" height="15" fill="#808080"/>
</g>
<g id="ConnectorTwo">
<rect id="Rectangle 3" x="621" y="129.811" width="37.7213" height="61.982" fill="url(#paint2_linear_0_1)"/>
<rect id="Rectangle 4" x="658.721" y="121.883" width="6.77049" height="77.1171" fill="#808080"/>
<rect id="Rectangle 5" x="665.492" y="121.883" width="14.5082" height="77.1171" fill="#C2C2C2"/>
</g>
<g id="ConnectorOne">
<rect id="Rectangle 3_2" x="621" y="46.9279" width="37.7213" height="61.982" fill="url(#paint3_linear_0_1)"/>
<rect id="Rectangle 4_2" x="658.721" y="39" width="6.77049" height="77.1171" fill="#808080"/>
<rect id="Rectangle 5_2" x="665.492" y="39" width="14.5082" height="77.1171" fill="#C2C2C2"/>
</g>
<rect id="BodyFrame" x="2" y="2" width="617" height="366" rx="8" fill="url(#paint4_linear_0_1)" stroke="#808080" stroke-width="4"/>
<g id="AirVent">
<rect id="VentBG" x="42.7462" y="260" width="71.5398" height="68" fill="white"/>
<path id="AirVent_2" d="M116.517 254H40.483C38.0106 254 36 255.892 36 258.219V329.781C36 332.108 38.0106 334 40.483 334H116.517C118.989 334 121 332.108 121 329.781V258.219C121 255.892 118.989 254 116.517 254ZM118.675 329.781C118.675 330.9 117.706 331.811 116.517 331.811H40.483C39.2938 331.811 38.3253 330.9 38.3253 329.781V258.219C38.3253 257.1 39.2938 256.188 40.483 256.188H116.517C117.706 256.188 118.675 257.1 118.675 258.219V329.781ZM114.523 259H42.4735C41.8319 259 41.3129 259.488 41.3129 260.092V327.903C41.3129 328.507 41.8319 328.996 42.4735 328.996H114.523C115.164 328.996 115.683 328.507 115.683 327.903L115.687 260.092C115.687 259.488 115.168 259 114.527 259H114.523ZM43.6378 280.807L50.3152 278.953V286.845L43.6378 288.699V280.807ZM52.6405 289.126L59.3219 290.98V298.872L52.6405 297.018V289.126ZM61.6472 290.98L68.3286 289.126V297.018L61.6472 298.872V290.98ZM70.6539 289.126L77.3353 290.98V298.872L70.6539 297.018V289.126ZM79.6606 290.98L86.342 289.126V297.018L79.6606 298.872V290.98ZM88.6673 289.126L95.3487 290.98V298.872L88.6673 297.018V289.126ZM97.674 290.98L104.355 289.126V297.018L97.674 298.872V290.98ZM104.355 286.845L97.674 288.699V280.807L104.355 278.953V286.845ZM95.3487 288.699L88.6673 286.845V278.953L95.3487 280.807V288.699ZM86.342 286.842L79.6606 288.695V280.803L86.342 278.949V286.842ZM77.3353 288.699L70.6539 286.845V278.953L77.3353 280.807V288.699ZM68.3286 286.842L61.6472 288.695V280.803L68.3286 278.949V286.842ZM59.3219 288.695L52.6405 286.842V278.949L59.3219 280.803V288.695ZM52.6405 299.296L59.3219 301.15V309.042L52.6405 307.188V299.296ZM61.6472 301.15L68.3286 299.296V307.188L61.6472 309.042V301.15ZM70.6539 299.296L77.3353 301.15V309.042L70.6539 307.188V299.296ZM79.6606 301.15L86.342 299.296V307.188L79.6606 309.042V301.15ZM88.6673 299.296L95.3487 301.15V309.042L88.6673 307.188V299.296ZM97.674 301.15L104.355 299.296V307.188L97.674 309.042V301.15ZM106.681 289.119L113.37 290.972V298.865L106.681 297.011V289.119ZM113.37 288.692L106.681 286.838V278.946L113.37 280.799V288.692ZM104.36 276.661L97.6781 278.515V270.618L104.36 268.765V276.661ZM95.3528 278.515L88.6714 276.661V268.765L95.3528 270.618V278.515ZM86.3461 276.657L79.6647 278.511V270.615L86.3461 268.761V276.657ZM77.3394 278.515L70.658 276.661V268.765L77.3394 270.618V278.515ZM68.3327 276.657L61.6513 278.511V270.615L68.3327 268.761V276.657ZM59.326 278.511L52.6445 276.657V268.761L59.326 270.615V278.511ZM43.6421 290.964L50.3195 289.11V297.002L43.6421 298.856V290.964ZM43.6421 301.137L50.3195 299.283V307.175L43.6421 309.029V301.137ZM52.6447 309.456L59.3262 311.31V319.206L52.6447 317.352V309.456ZM61.6515 311.31L68.3329 309.456V317.352L61.6515 319.206V311.31ZM70.6582 309.456L77.3396 311.31V319.206L70.6582 317.352V309.456ZM79.6649 311.31L86.3463 309.456V317.352L79.6649 319.206V311.31ZM88.6716 309.456L95.353 311.31V319.206L88.6716 317.352V309.456ZM97.6783 311.31L104.36 309.456V317.352L97.6783 319.206V311.31ZM106.685 299.279L113.375 301.133V309.025L106.685 307.171V299.279ZM113.375 278.506L106.685 276.652V268.756L113.375 270.61V278.506ZM104.364 266.475L97.6824 268.329V261.163H104.364V266.475ZM95.3571 268.329L88.6757 266.475V261.163H95.3571V268.329ZM86.3504 266.471L79.669 268.325V261.163H86.3504V266.471ZM77.3437 268.329L70.6623 266.475V261.163H77.3437V268.329ZM68.337 266.471L61.6555 268.325V261.16H68.337V266.471ZM59.3303 268.325L52.6488 266.471V261.163H59.3303V268.329V268.325ZM50.3236 276.644L43.6462 278.498V270.602L50.3236 268.748V276.644ZM43.6462 311.301L50.3236 309.447V317.344L43.6462 319.197V311.301ZM52.6488 319.624L59.3303 321.478V326.786H52.6488V319.624ZM61.6555 321.478L68.337 319.624V326.786H61.6555V321.478ZM70.6623 319.624L77.3437 321.478V326.782H70.6623V319.62V319.624ZM79.669 321.478L86.3504 319.624V326.786H79.669V321.478ZM88.6757 319.624L95.3571 321.478V326.782H88.6757V319.62V319.624ZM97.6824 321.478L104.364 319.624V326.786H97.6824V321.478ZM106.689 309.447L113.379 311.301V319.197L106.689 317.343V309.447ZM113.379 268.324L106.689 266.47V261.162H113.379V268.328V268.324ZM50.3158 261.186V266.493L43.6385 268.347V261.186H50.3158ZM43.6385 321.505L50.3158 319.651V326.812H43.6385V321.505ZM106.677 326.812V319.651L113.367 321.505V326.809H106.677V326.812Z" fill="#808080"/>
</g>
</g>
<g id="Fan">
<rect x="282.5" y="47.5" width="282" height="282" rx="141" fill="url(#paint5_radial_0_1)"/>
<rect x="282.5" y="47.5" width="282" height="282" rx="141" stroke="#808080" stroke-width="15"/>
<g id="FanBlades" filter="url(#filter0_d_0_1)">
<path d="M439.762 290.389C439.988 294.345 442.004 297.869 445.296 300.053C447.354 301.434 449.72 302.114 452.106 302.114C453.526 302.114 454.946 301.867 456.324 301.372L485.19 290.965C488.42 289.79 490.972 287.421 492.35 284.268C493.729 281.115 493.749 277.632 492.412 274.458L461.406 200.991L513.542 238.147C515.682 239.671 518.171 240.455 520.702 240.455C521.978 240.455 523.274 240.249 524.529 239.836C528.294 238.62 531.174 235.777 532.45 232.026L542.326 202.948C543.437 199.692 543.169 196.21 541.564 193.18C539.96 190.13 537.264 187.946 533.952 187.018L457.269 165.463L518.809 147.843C522.615 146.751 525.599 144.01 526.998 140.301C528.397 136.591 527.985 132.552 525.846 129.234L509.325 103.351C507.473 100.445 504.592 98.5083 501.218 97.8487C497.823 97.1893 494.449 97.9518 491.651 99.9507L426.782 146.669L451.286 87.255C452.788 83.5869 452.5 79.5479 450.463 76.1473C448.426 72.747 445.01 70.5832 441.081 70.1711L410.569 67.0594C407.092 66.7297 403.8 67.7807 401.187 70.0269C398.595 72.2731 397.072 75.4054 396.908 78.8471L393.184 158.519L362.199 102.445C360.285 98.9827 356.952 96.6955 353.022 96.1595C349.093 95.6443 345.266 96.9426 342.509 99.7865L321.05 121.734C318.643 124.186 317.388 127.442 317.532 130.884C317.655 134.325 319.157 137.458 321.729 139.745L381.557 192.357L318.474 181.62C314.565 180.981 310.696 182.135 307.837 184.876C304.977 187.617 303.619 191.43 304.092 195.366L307.837 225.865C308.248 229.286 310.018 232.295 312.775 234.335C314.935 235.922 317.466 236.767 320.099 236.767C320.84 236.767 321.581 236.705 322.321 236.561L400.732 222.548L352.999 265.226C350.057 267.864 348.555 271.635 348.905 275.571C349.255 279.507 351.395 282.969 354.748 285.051L380.878 301.145C382.853 302.361 385.075 303 387.338 303C388.408 303 389.499 302.856 390.568 302.567C393.881 301.681 396.617 299.517 398.263 296.488L436.243 226.381L439.762 290.389ZM390.798 187.536C390.798 170.04 404.994 155.821 422.462 155.821C439.93 155.821 454.126 170.04 454.126 187.536C454.126 205.032 439.93 219.251 422.462 219.251C405.015 219.251 390.798 205.012 390.798 187.536Z" fill="url(#paint6_radial_0_1)"/>
<path d="M399.884 68.5107C402.816 65.9899 406.503 64.7649 410.382 65.0371L410.758 65.0684L410.765 65.0693H410.771L441.284 68.1816H441.29C445.841 68.659 449.817 71.1762 452.179 75.1191C454.543 79.0662 454.875 83.7677 453.137 88.0127L453.135 88.0176L431.305 140.946L490.482 98.3281L490.488 98.3232C493.724 96.0112 497.656 95.1196 501.6 95.8857H501.602C505.504 96.6486 508.859 98.9011 511.01 102.275H511.011L527.526 128.15L527.754 128.515C530.042 132.302 530.438 136.847 528.869 141.007C527.246 145.31 523.772 148.5 519.36 149.766H519.359L464.597 165.444L534.493 185.093H534.492C538.334 186.169 541.471 188.713 543.331 192.244H543.332C545.197 195.765 545.505 199.818 544.219 203.591L534.344 232.669V232.67C532.867 237.013 529.517 240.323 525.152 241.735L525.153 241.736C523.699 242.214 522.192 242.455 520.702 242.455C517.754 242.455 514.858 241.541 512.381 239.775L465.992 206.715L494.255 273.681V273.682C495.804 277.359 495.781 281.413 494.183 285.069C492.582 288.73 489.611 291.486 485.874 292.845L485.868 292.847L457.003 303.254L457 303.255C455.409 303.826 453.76 304.114 452.106 304.114C449.338 304.114 446.581 303.324 444.182 301.714V301.713C440.368 299.178 438.027 295.081 437.765 290.503V290.498L434.634 233.55L400.021 297.44L400.021 297.443C398.115 300.95 394.933 303.467 391.088 304.497L391.089 304.498C389.852 304.832 388.586 305 387.338 305C384.859 305 382.434 304.344 380.261 303.104L379.829 302.849L353.699 286.754L353.693 286.75C349.807 284.338 347.319 280.313 346.913 275.748C346.507 271.179 348.257 266.792 351.664 263.737L351.666 263.735L394.141 225.757L322.673 238.529L322.672 238.528C321.801 238.696 320.942 238.767 320.1 238.767C317.029 238.767 314.085 237.779 311.591 235.947L311.585 235.942C308.392 233.579 306.33 230.079 305.852 226.107V226.108L302.107 195.609L302.106 195.604C301.558 191.046 303.138 186.61 306.453 183.433C309.675 180.344 314.004 178.994 318.373 179.583L318.796 179.646L318.81 179.648L374.94 189.202L320.408 141.247L320.399 141.24V141.239C317.431 138.599 315.679 134.96 315.533 130.967C315.366 126.972 316.829 123.179 319.623 120.333L341.079 98.3887C344.184 95.1888 348.464 93.6773 352.856 94.127L353.282 94.1768L353.293 94.1777C357.849 94.7992 361.73 97.4628 363.949 101.478L391.516 151.364L394.91 78.7539V78.752C395.101 74.7651 396.871 71.1207 399.878 68.5156L399.884 68.5107ZM422.462 157.821C406.102 157.821 392.798 171.142 392.798 187.536C392.798 203.91 406.123 217.252 422.462 217.252C438.822 217.252 452.126 203.931 452.126 187.536C452.126 171.142 438.822 157.821 422.462 157.821Z" stroke="url(#paint7_radial_0_1)" stroke-width="4"/>
</g>
<g id="FanFrame">
<g id="FanMesh">
<g clip-path="url(#paint8_angular_0_1_clip_path)" data-figma-skip-parse="true"><g transform="matrix(-5.31093e-09 0.1215 -0.0005 0 423.5 189.25)"><foreignObject x="-inf" y="-inf" width="inf" height="inf"><div xmlns="http://www.w3.org/1999/xhtml" style="background:conic-gradient(from 90deg,rgba(255, 255, 255, 1) 0deg,rgba(128, 128, 128, 1) 295.962deg,rgba(255, 255, 255, 1) 360deg);height:100%;width:100%;opacity:1"></div></foreignObject></g></g><path id="Line 1" d="M425.5 67.75L424 67.75L424 310.75L425.5 310.75L427 310.75L427 67.75L425.5 67.75Z" data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_ANGULAR&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.50196081399917603,&#34;g&#34;:0.50196081399917603,&#34;b&#34;:0.50196081399917603,&#34;a&#34;:1.0},&#34;position&#34;:0.82211536169052124},{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.50196081399917603,&#34;g&#34;:0.50196081399917603,&#34;b&#34;:0.50196081399917603,&#34;a&#34;:1.0},&#34;position&#34;:0.82211536169052124},{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;transform&#34;:{&#34;m00&#34;:-1.0621864930726588e-05,&#34;m01&#34;:-1.0,&#34;m02&#34;:424.0,&#34;m10&#34;:243.0,&#34;m11&#34;:-4.3711377628596892e-08,&#34;m12&#34;:67.750},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}"/>
<g clip-path="url(#paint9_angular_0_1_clip_path)" data-figma-skip-parse="true"><g transform="matrix(0.105222 0.06075 -0.00025 0.000433013 423.747 189.679)"><foreignObject x="-inf" y="-inf" width="inf" height="inf"><div xmlns="http://www.w3.org/1999/xhtml" style="background:conic-gradient(from 90deg,rgba(255, 255, 255, 1) 0deg,rgba(128, 128, 128, 1) 295.962deg,rgba(255, 255, 255, 1) 360deg);height:100%;width:100%;opacity:1"></div></foreignObject></g></g><path id="Line 2" d="M319.525 127.197L318.775 128.496L529.22 249.996L529.97 248.697L530.72 247.398L320.275 125.898L319.525 127.197Z" data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_ANGULAR&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.50196081399917603,&#34;g&#34;:0.50196081399917603,&#34;b&#34;:0.50196081399917603,&#34;a&#34;:1.0},&#34;position&#34;:0.82211536169052124},{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.50196081399917603,&#34;g&#34;:0.50196081399917603,&#34;b&#34;:0.50196081399917603,&#34;a&#34;:1.0},&#34;position&#34;:0.82211536169052124},{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;transform&#34;:{&#34;m00&#34;:210.44416809082031,&#34;m01&#34;:-0.50,&#34;m02&#34;:318.7753906250,&#34;m10&#34;:121.50,&#34;m11&#34;:0.86602538824081421,&#34;m12&#34;:128.49566650390625},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}"/>
<g clip-path="url(#paint10_angular_0_1_clip_path)" data-figma-skip-parse="true"><g transform="matrix(0.105222 -0.06075 0.00025 0.000433013 424.242 189.679)"><foreignObject x="-inf" y="-inf" width="inf" height="inf"><div xmlns="http://www.w3.org/1999/xhtml" style="background:conic-gradient(from 90deg,rgba(255, 255, 255, 1) 0deg,rgba(128, 128, 128, 1) 295.962deg,rgba(255, 255, 255, 1) 360deg);height:100%;width:100%;opacity:1"></div></foreignObject></g></g><path id="Line 3" d="M318.02 248.697L318.77 249.996L529.215 128.496L528.465 127.197L527.715 125.898L317.27 247.398L318.02 248.697Z" data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_ANGULAR&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.50196081399917603,&#34;g&#34;:0.50196081399917603,&#34;b&#34;:0.50196081399917603,&#34;a&#34;:1.0},&#34;position&#34;:0.82211536169052124},{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.50196081399917603,&#34;g&#34;:0.50196081399917603,&#34;b&#34;:0.50196081399917603,&#34;a&#34;:1.0},&#34;position&#34;:0.82211536169052124},{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;transform&#34;:{&#34;m00&#34;:210.44413757324219,&#34;m01&#34;:0.50000017881393433,&#34;m02&#34;:318.77038574218750,&#34;m10&#34;:-121.50004577636719,&#34;m11&#34;:0.86602526903152466,&#34;m12&#34;:249.99566650390625},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}"/>
<g id="Ellipse 1" filter="url(#filter1_d_0_1)">
<circle cx="423.5" cy="188.25" r="104.5" stroke="#808080" stroke-width="3" shape-rendering="crispEdges"/>
</g>
<g id="Ellipse 5" filter="url(#filter2_d_0_1)">
<circle cx="423.5" cy="188.25" r="120.5" stroke="#808080" stroke-width="3" shape-rendering="crispEdges"/>
</g>
<circle id="Ellipse 2" cx="423.5" cy="188.25" r="77.5" stroke="#808080" stroke-width="3"/>
<circle id="Ellipse 3" cx="423.5" cy="188.25" r="50.5" stroke="#808080" stroke-width="3"/>
<circle id="Ellipse 4" cx="423.5" cy="188.25" r="32.5" fill="white" stroke="#808080" stroke-width="3"/>
</g>
<g id="FrameBolts">
<circle id="Ellipse 6" cx="424" cy="48" r="4" fill="white"/>
<circle id="Ellipse 7" cx="565" cy="188" r="4" fill="white"/>
<circle id="Ellipse 8" cx="424" cy="330" r="4" fill="white"/>
<circle id="Ellipse 9" cx="282" cy="188" r="4" fill="white"/>
<circle id="Ellipse 10" cx="318" cy="95" r="4" fill="white"/>
<circle id="Ellipse 11" cx="529" cy="95" r="4" fill="white"/>
<circle id="Ellipse 12" cx="529" cy="281" r="4" fill="white"/>
<circle id="Ellipse 13" cx="318" cy="281" r="4" fill="white"/>
</g>
</g>
</g>
<g id="Display" filter="url(#filter3_d_0_1)">
<rect x="36" y="40" width="191" height="102" rx="8" fill="white"/>
<rect x="37.5" y="41.5" width="188" height="99" rx="6.5" stroke="#737373" stroke-width="3"/>
</g>
</g>
<defs>
<filter id="filter0_d_0_1" x="296" y="63" width="255" height="252" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
</filter>
<clipPath id="paint8_angular_0_1_clip_path"><path id="Line 1" d="M425.5 67.75L424 67.75L424 310.75L425.5 310.75L427 310.75L427 67.75L425.5 67.75Z"/></clipPath><clipPath id="paint9_angular_0_1_clip_path"><path id="Line 2" d="M319.525 127.197L318.775 128.496L529.22 249.996L529.97 248.697L530.72 247.398L320.275 125.898L319.525 127.197Z"/></clipPath><clipPath id="paint10_angular_0_1_clip_path"><path id="Line 3" d="M318.02 248.697L318.77 249.996L529.215 128.496L528.465 127.197L527.715 125.898L317.27 247.398L318.02 248.697Z"/></clipPath><filter id="filter1_d_0_1" x="313.5" y="82.25" width="220" height="220" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
</filter>
<filter id="filter2_d_0_1" x="291.5" y="60.25" width="264" height="264" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
</filter>
<filter id="filter3_d_0_1" x="11" y="19" width="241" height="152" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="12.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
</filter>
<linearGradient id="paint0_linear_0_1" x1="82" y1="375.5" x2="140" y2="375.5" gradientUnits="userSpaceOnUse">
<stop stop-color="#737373"/>
<stop offset="0.514423" stop-color="#D9D9D9"/>
<stop offset="1" stop-color="#737373"/>
</linearGradient>
<linearGradient id="paint1_linear_0_1" x1="476" y1="375.5" x2="534" y2="375.5" gradientUnits="userSpaceOnUse">
<stop stop-color="#737373"/>
<stop offset="0.514423" stop-color="#D9D9D9"/>
<stop offset="1" stop-color="#737373"/>
</linearGradient>
<linearGradient id="paint2_linear_0_1" x1="639.861" y1="129.811" x2="639.861" y2="191.793" gradientUnits="userSpaceOnUse">
<stop offset="0.00480769" stop-color="#737373"/>
<stop offset="0.514423" stop-color="#D9D9D9"/>
<stop offset="1" stop-color="#737373"/>
</linearGradient>
<linearGradient id="paint3_linear_0_1" x1="639.861" y1="46.9279" x2="639.861" y2="108.91" gradientUnits="userSpaceOnUse">
<stop offset="0.00480769" stop-color="#737373"/>
<stop offset="0.514423" stop-color="#D9D9D9"/>
<stop offset="1" stop-color="#737373"/>
</linearGradient>
<linearGradient id="paint4_linear_0_1" x1="621" y1="185" x2="-5.86035e-06" y2="185" gradientUnits="userSpaceOnUse">
<stop stop-color="#808080"/>
<stop offset="0.288462" stop-color="#E2E2E2"/>
<stop offset="0.519231" stop-color="white"/>
<stop offset="0.725962" stop-color="#E2E2E2"/>
<stop offset="1" stop-color="#808080"/>
</linearGradient>
<radialGradient id="paint5_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(423.5 188.5) rotate(90) scale(148.5)">
<stop offset="0.817308" stop-color="white"/>
<stop offset="1" stop-color="#999999"/>
</radialGradient>
<radialGradient id="paint6_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(423.5 185) rotate(90) scale(118 119.5)">
<stop stop-color="#9DFF98"/>
<stop offset="1" stop-color="#078C00"/>
</radialGradient>
<radialGradient id="paint7_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(423.5 185) rotate(90) scale(118 119.5)">
<stop stop-color="#9DFF98"/>
<stop offset="1" stop-color="#078C00"/>
</radialGradient>
</defs>
</svg>

`;
export class TemplateImage extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "TemplateImage",
      size: { width: 100, height: 100 },

      color: "blue",
      attrs: {
        image: {
          width: "calc(w)",
          height: "calc(h)",
        },
        label: {
          text: "Image",
          textVerticalAnchor: "top",
          textAnchor: "middle",
          x: "calc(0.5*w)",
          y: "calc(h+10)",
          fontSize: 10,
          fontFamily: "sans-serif",
          fill: "#333333",
        },
      },
      portMarkup: [
        {
          tagName: "path",
          selector: "portBody",
          attributes: {
            fill: "#FFFFFF",
            stroke: "#333333",
            "stroke-width": 2,
          },
        },
      ],

      ports: {
        groups: {
          in: {
            // position: "left",
            position: {
              name: "line",
              args: {
                start: { x: "calc(w)", y: 20 },
                end: { x: "calc(w)", y: 40 },
              },
            },
            markup: util.svg`
                            <rect @selector="pipeBody" />
                            <rect @selector="pipeEnd" />
                        `,
            size: { width: 30, height: 30 },
            // label: { position: { name: "outside", args: { offset: 30 } } },
            z: 1,
            attrs: {
              portRoot: {
                magnet: "active", // Allow outgoing connections
              },
              portLabelBackground: {
                ref: "portLabel",
                fill: "#FFFFFF",
                fillOpacity: 0.7,
                x: "calc(x - 2)",
                y: "calc(y - 2)",
                width: "calc(w + 4)",
                height: "calc(h + 4)",
                pointerEvents: "none",
              },
              pipeBody: {
                width: "calc(w)",
                height: "calc(h)",
                y: "calc(h / -2)",
                x: "calc(-1 * w)",
                fill: {
                  type: "linearGradient",
                  stops: [
                    { offset: "0%", color: "gray" },
                    { offset: "30%", color: "white" },
                    { offset: "70%", color: "white" },
                    { offset: "100%", color: "gray" },
                  ],
                  attrs: {
                    x1: "0%",
                    y1: "0%",
                    x2: "0%",
                    y2: "100%",
                  },
                },
              },
              pipeEnd: {
                width: 10,
                height: "calc(h+6)",
                y: "calc(h / -2 - 3)",
                x: "calc(w -40)",
                stroke: "gray",
                strokeWidth: 3,
                fill: "white",
              },
              portLabel: { fontFamily: "sans-serif", pointerEvents: "none" },
              portBody: {
                d: "M 0 -calc(0.5 * h) h calc(w) l 3 calc(0.5 * h) l -3 calc(0.5 * h) H 0 A calc(0.5 * h) calc(0.5 * h) 1 1 1 0 -calc(0.5 * h) Z",
                magnet: "active",
              },
            },
          },
          out: {
            // position: "right",

            // label: { position: { name: "outside", args: { offset: 30 } } },
            position: {
              name: "line",
              args: {
                start: { x: "calc(w)", y: 60 },
                end: { x: "calc(w)", y: 80 },
              },
            },
            size: { width: 30, height: 30 },
            markup: util.svg`
                             <g @selector="portBodyGroup" transform="rotate(180)">
      <rect @selector="pipeBody" />
      <rect @selector="pipeEnd" />
    </g>
                        `,
            z: 1,
            attrs: {
              portRoot: {
                magnet: "active", // Allow outgoing connections
              },
              portLabelBackground: {
                ref: "portLabel",
                fill: "#FFFFFF",
                fillOpacity: 0.8,
                x: "calc(x - 2)",
                y: "calc(y - 2)",
                width: "calc(w + 4)",
                height: "calc(h + 4)",
                pointerEvents: "none",
              },
              pipeBody: {
                width: "calc(w)",
                height: "calc(h)",
                y: "calc(h / -2)",
                fill: {
                  type: "linearGradient",
                  stops: [
                    { offset: "0%", color: "gray" },
                    { offset: "30%", color: "white" },
                    { offset: "70%", color: "white" },
                    { offset: "100%", color: "gray" },
                  ],
                  attrs: {
                    x1: "0%",
                    y1: "0%",
                    x2: "0%",
                    y2: "100%",
                  },
                },
              },
              pipeEnd: {
                width: 10,
                height: "calc(h+6)",
                y: "calc(h / -2 - 3)",
                x: "calc(w -30)",
                stroke: "gray",
                strokeWidth: 3,
                fill: "white",
              },
              portLabel: { fontFamily: "sans-serif", pointerEvents: "none" },
              portBody: {
                d: "M 0 -calc(0.5 * h) h calc(w) l 3 calc(0.5 * h) l -3 calc(0.5 * h) H 0 A calc(0.5 * h) calc(0.5 * h) 1 1 1 0 -calc(0.5 * h) Z",
                magnet: "active",
              },
            },
          },
        },
        items: [
          {
            id: "in1",
            group: "in",
          },
          {
            id: "out1",
            group: "out",
          },
        ],
      },
    };
  }

  preinitialize() {
    this.dataURLPrefix = "data:image/svg+xml;utf8,";
    this.markup = [
      {
        tagName: "image",
        selector: "image",
      },
      {
        tagName: "text",
        selector: "label",
      },
    ];
  }

  initialize(...args) {
    super.initialize(...args);
    this.on("change:color", this.setImageColor);
    this.setImageColor();
  }

  setImageColor() {
    const svg = this.get("svg") || "";
    const color = this.get("color") || "black";
    this.attr(
      "image/href",
      this.dataURLPrefix + encodeURIComponent(svg.replace(/\$color/g, color))
    );
  }
}

class HeatPump extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "HeatPump",
      size: { width: 680, height: 396 },
      power: 0,
      attrs: {
        root: { magnetSelector: "bodyFrame" },
        background: { width: "calc(w)", height: "calc(h)", fill: "#F5F5F5" },
        bodyFrame: {
          x: 2,
          y: 2,
          width: 617,
          height: 366,
          rx: 8,
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "#808080" },
              { offset: "28.8462%", color: "#E2E2E2" },
              { offset: "51.9231%", color: "white" },
              { offset: "72.5962%", color: "#E2E2E2" },
              { offset: "100%", color: "#808080" },
            ],
            attrs: { x1: 621, y1: 185, x2: 0, y2: 185 },
          },
          stroke: "#808080",
          strokeWidth: 4,
        },
        feet1: {
          x: 82,
          y: 370,
          width: 58,
          height: 11,
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "#737373" },
              { offset: "51.4423%", color: "#D9D9D9" },
              { offset: "100%", color: "#737373" },
            ],
            attrs: { x1: 82, y1: 375.5, x2: 140, y2: 375.5 },
          },
        },
        feet2: { x: 47, y: 381, width: 128, height: 15, fill: "#808080" },
        feet3: {
          x: 476,
          y: 370,
          width: 58,
          height: 11,
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "#737373" },
              { offset: "51.4423%", color: "#D9D9D9" },
              { offset: "100%", color: "#737373" },
            ],
            attrs: { x1: 476, y1: 375.5, x2: 534, y2: 375.5 },
          },
        },
        feet4: { x: 441, y: 381, width: 128, height: 15, fill: "#808080" },
        connector1: {
          x: 621,
          y: 46.9279,
          width: 37.7213,
          height: 61.982,
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "0.480769%", color: "#737373" },
              { offset: "51.4423%", color: "#D9D9D9" },
              { offset: "100%", color: "#737373" },
            ],
            attrs: { x1: 639.861, y1: 46.9279, x2: 639.861, y2: 108.91 },
          },
        },
        connector2: {
          x: 658.721,
          y: 39,
          width: 6.77049,
          height: 77.1171,
          fill: "#808080",
        },
        connector3: {
          x: 665.492,
          y: 39,
          width: 14.5082,
          height: 77.1171,
          fill: "#C2C2C2",
        },
        connector4: {
          x: 621,
          y: 129.811,
          width: 37.7213,
          height: 61.982,
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "0.480769%", color: "#737373" },
              { offset: "51.4423%", color: "#D9D9D9" },
              { offset: "100%", color: "#737373" },
            ],
            attrs: { x1: 639.861, y1: 129.811, x2: 639.861, y2: 191.793 },
          },
        },
        connector5: {
          x: 658.721,
          y: 121.883,
          width: 6.77049,
          height: 77.1171,
          fill: "#808080",
        },
        connector6: {
          x: 665.492,
          y: 121.883,
          width: 14.5082,
          height: 77.1171,
          fill: "#C2C2C2",
        },
        ventBG: {
          x: 42.7462,
          y: 260,
          width: 71.5398,
          height: 68,
          fill: "white",
        },
        airVent: {
          d: "M116.517 254H40.483C38.0106 254 36 255.892 36 258.219V329.781C36 332.108 38.0106 334 40.483 334H116.517C118.989 334 121 332.108 121 329.781V258.219C121 255.892 118.989 254 116.517 254ZM118.675 329.781C118.675 330.9 117.706 331.811 116.517 331.811H40.483C39.2938 331.811 38.3253 330.9 38.3253 329.781V258.219C38.3253 257.1 39.2938 256.188 40.483 256.188H116.517C117.706 256.188 118.675 257.1 118.675 258.219V329.781ZM114.523 259H42.4735C41.8319 259 41.3129 259.488 41.3129 260.092V327.903C41.3129 328.507 41.8319 328.996 42.4735 328.996H114.523C115.164 328.996 115.683 328.507 115.683 327.903L115.687 260.092C115.687 259.488 115.168 259 114.527 259H114.523ZM43.6378 280.807L50.3152 278.953V286.845L43.6378 288.699V280.807ZM52.6405 289.126L59.3219 290.98V298.872L52.6405 297.018V289.126ZM61.6472 290.98L68.3286 289.126V297.018L61.6472 298.872V290.98ZM70.6539 289.126L77.3353 290.98V298.872L70.6539 297.018V289.126ZM79.6606 290.98L86.342 289.126V297.018L79.6606 298.872V290.98ZM88.6673 289.126L95.3487 290.98V298.872L88.6673 297.018V289.126ZM97.674 290.98L104.355 289.126V297.018L97.674 298.872V290.98ZM104.355 286.845L97.674 288.699V280.807L104.355 278.953V286.845ZM95.3487 288.699L88.6673 286.845V278.953L95.3487 280.807V288.699ZM86.342 286.842L79.6606 288.695V280.803L86.342 278.949V286.842ZM77.3353 288.699L70.6539 286.845V278.953L77.3353 280.807V288.699ZM68.3286 286.842L61.6472 288.695V280.803L68.3286 278.949V286.842ZM59.3219 288.695L52.6405 286.842V278.949L59.3219 280.803V288.695ZM52.6405 299.296L59.3219 301.15V309.042L52.6405 307.188V299.296ZM61.6472 301.15L68.3286 299.296V307.188L61.6472 309.042V301.15ZM70.6539 299.296L77.3353 301.15V309.042L70.6539 307.188V299.296ZM79.6606 301.15L86.342 299.296V307.188L79.6606 309.042V301.15ZM88.6673 299.296L95.3487 301.15V309.042L88.6673 307.188V299.296ZM97.674 301.15L104.355 299.296V307.188L97.674 309.042V301.15ZM106.681 289.119L113.37 290.972V298.865L106.681 297.011V289.119ZM113.37 288.692L106.681 286.838V278.946L113.37 280.799V288.692ZM104.36 276.661L97.6781 278.515V270.618L104.36 268.765V276.661ZM95.3528 278.515L88.6714 276.661V268.765L95.3528 270.618V278.515ZM86.3461 276.657L79.6647 278.511V270.615L86.3461 268.761V276.657ZM77.3394 278.515L70.658 276.661V268.765L77.3394 270.618V278.515ZM68.3327 276.657L61.6513 278.511V270.615L68.3327 268.761V276.657ZM59.326 278.511L52.6445 276.657V268.761L59.326 270.615V278.511ZM43.6421 290.964L50.3195 289.11V297.002L43.6421 298.856V290.964ZM43.6421 301.137L50.3195 299.283V307.175L43.6421 309.029V301.137ZM52.6447 309.456L59.3262 311.31V319.206L52.6447 317.352V309.456ZM61.6515 311.31L68.3329 309.456V317.352L61.6515 319.206V311.31ZM70.6582 309.456L77.3396 311.31V319.206L70.6582 317.352V309.456ZM79.6649 311.31L86.3463 309.456V317.352L79.6649 319.206V311.31ZM88.6716 309.456L95.353 311.31V319.206L88.6716 317.352V309.456ZM97.6783 311.31L104.36 309.456V317.352L97.6783 319.206V311.31ZM106.685 299.279L113.375 301.133V309.025L106.685 307.171V299.279ZM113.375 278.506L106.685 276.652V268.756L113.375 270.61V278.506ZM104.364 266.475L97.6824 268.329V261.163H104.364V266.475ZM95.3571 268.329L88.6757 266.475V261.163H95.3571V268.329ZM86.3504 266.471L79.669 268.325V261.163H86.3504V266.471ZM77.3437 268.329L70.6623 266.475V261.163H77.3437V268.329ZM68.337 266.471L61.6555 268.325V261.16H68.337V266.471ZM59.3303 268.325L52.6488 266.471V261.163H59.3303V268.329V268.325ZM50.3236 276.644L43.6462 278.498V270.602L50.3236 268.748V276.644ZM43.6462 311.301L50.3236 309.447V317.344L43.6462 319.197V311.301ZM52.6488 319.624L59.3303 321.478V326.786H52.6488V319.624ZM61.6555 321.478L68.337 319.624V326.786H61.6555V321.478ZM70.6623 319.624L77.3437 321.478V326.782H70.6623V319.62V319.624ZM79.669 321.478L86.3504 319.624V326.786H79.669V321.478ZM88.6757 319.624L95.3571 321.478V326.782H88.6757V319.62V319.624ZM97.6824 321.478L104.364 319.624V326.786H97.6824V321.478ZM106.689 309.447L113.379 311.301V319.197L106.689 317.343V309.447ZM113.379 268.324L106.689 266.47V261.162H113.379V268.328V268.324ZM50.3158 261.186V266.493L43.6385 268.347V261.186H50.3158ZM43.6385 321.505L50.3158 319.651V326.812H43.6385V321.505ZM106.677 326.812V319.651L113.367 321.505V326.809H106.677V326.812Z",
          fill: "#808080",
        },
        fanCircle: {
          x: 282.5,
          y: 47.5,
          width: 282,
          height: 282,
          rx: 141,
          fill: {
            type: "radialGradient",
            stops: [
              { offset: "81.7308%", color: "white" },
              { offset: "100%", color: "#999999" },
            ],
            attrs: {
              cx: 0,
              cy: 0,
              r: 1,
              gradientTransform:
                "translate(423.5 188.5) rotate(90) scale(148.5)",
            },
          },
          stroke: "#808080",
          strokeWidth: 15,
        },
        fanBlades: {
          d: "M439.762 290.389C439.988 294.345 442.004 297.869 445.296 300.053C447.354 301.434 449.72 302.114 452.106 302.114C453.526 302.114 454.946 301.867 456.324 301.372L485.19 290.965C488.42 289.79 490.972 287.421 492.35 284.268C493.729 281.115 493.749 277.632 492.412 274.458L461.406 200.991L513.542 238.147C515.682 239.671 518.171 240.455 520.702 240.455C521.978 240.455 523.274 240.249 524.529 239.836C528.294 238.62 531.174 235.777 532.45 232.026L542.326 202.948C543.437 199.692 543.169 196.21 541.564 193.18C539.96 190.13 537.264 187.946 533.952 187.018L457.269 165.463L518.809 147.843C522.615 146.751 525.599 144.01 526.998 140.301C528.397 136.591 527.985 132.552 525.846 129.234L509.325 103.351C507.473 100.445 504.592 98.5083 501.218 97.8487C497.823 97.1893 494.449 97.9518 491.651 99.9507L426.782 146.669L451.286 87.255C452.788 83.5869 452.5 79.5479 450.463 76.1473C448.426 72.747 445.01 70.5832 441.081 70.1711L410.569 67.0594C407.092 66.7297 403.8 67.7807 401.187 70.0269C398.595 72.2731 397.072 75.4054 396.908 78.8471L393.184 158.519L362.199 102.445C360.285 98.9827 356.952 96.6955 353.022 96.1595C349.093 95.6443 345.266 96.9426 342.509 99.7865L321.05 121.734C318.643 124.186 317.388 127.442 317.532 130.884C317.655 134.325 319.157 137.458 321.729 139.745L381.557 192.357L318.474 181.62C314.565 180.981 310.696 182.135 307.837 184.876C304.977 187.617 303.619 191.43 304.092 195.366L307.837 225.865C308.248 229.286 310.018 232.295 312.775 234.335C314.935 235.922 317.466 236.767 320.099 236.767C320.84 236.767 321.581 236.705 322.321 236.561L400.732 222.548L352.999 265.226C350.057 267.864 348.555 271.635 348.905 275.571C349.255 279.507 351.395 282.969 354.748 285.051L380.878 301.145C382.853 302.361 385.075 303 387.338 303C388.408 303 389.499 302.856 390.568 302.567C393.881 301.681 396.617 299.517 398.263 296.488L436.243 226.381L439.762 290.389ZM390.798 187.536C390.798 170.04 404.994 155.821 422.462 155.821C439.93 155.821 454.126 170.04 454.126 187.536C454.126 205.032 439.93 219.251 422.462 219.251C405.015 219.251 390.798 205.012 390.798 187.536Z",
          fill: {
            type: "radialGradient",
            stops: [
              { offset: "0%", color: "#9DFF98" },
              { offset: "100%", color: "#078C00" },
            ],
            attrs: {
              cx: 0,
              cy: 0,
              r: 1,
              gradientTransform:
                "translate(423.5 185) rotate(90) scale(118 119.5)",
            },
          },
          stroke: {
            type: "radialGradient",
            stops: [
              { offset: "0%", color: "#9DFF98" },
              { offset: "100%", color: "#078C00" },
            ],
            attrs: {
              cx: 0,
              cy: 0,
              r: 1,
              gradientTransform:
                "translate(423.5 185) rotate(90) scale(118 119.5)",
            },
          },
          strokeWidth: 4,
          filter: "url(#filter0_d_0_1)",
        },
        fanEllipse1: {
          cx: 423.5,
          cy: 188.25,
          r: 104.5,
          stroke: "#808080",
          strokeWidth: 3,
          shapeRendering: "crispEdges",
          filter: "url(#filter1_d_0_1)",
        },
        fanEllipse2: {
          cx: 423.5,
          cy: 188.25,
          r: 120.5,
          stroke: "#808080",
          strokeWidth: 3,
          shapeRendering: "crispEdges",
          filter: "url(#filter2_d_0_1)",
        },
        fanEllipse3: {
          cx: 423.5,
          cy: 188.25,
          r: 77.5,
          stroke: "#808080",
          strokeWidth: 3,
        },
        fanEllipse4: {
          cx: 423.5,
          cy: 188.25,
          r: 50.5,
          stroke: "#808080",
          strokeWidth: 3,
        },
        fanEllipse5: {
          cx: 423.5,
          cy: 188.25,
          r: 32.5,
          fill: "white",
          stroke: "#808080",
          strokeWidth: 3,
        },
        bolt1: { cx: 424, cy: 48, r: 4, fill: "white" },
        bolt2: { cx: 565, cy: 188, r: 4, fill: "white" },
        bolt3: { cx: 424, cy: 330, r: 4, fill: "white" },
        bolt4: { cx: 282, cy: 188, r: 4, fill: "white" },
        bolt5: { cx: 318, cy: 95, r: 4, fill: "white" },
        bolt6: { cx: 529, cy: 95, r: 4, fill: "white" },
        bolt7: { cx: 529, cy: 281, r: 4, fill: "white" },
        bolt8: { cx: 318, cy: 281, r: 4, fill: "white" },
        display: {
          x: 36,
          y: 40,
          width: 191,
          height: 102,
          rx: 8,
          fill: "white",
          filter: "url(#filter3_d_0_1)",
        },
        displayFrame: {
          x: 37.5,
          y: 41.5,
          width: 188,
          height: 99,
          rx: 6.5,
          stroke: "#737373",
          strokeWidth: 3,
        },
        label: {
          text: "Heat Pump",
          textAnchor: "middle",
          textVerticalAnchor: "top",
          x: "calc(0.5*w)",
          y: "calc(h+10)",
          fontSize: "14",
          fontFamily: "sans-serif",
          fill: "#350100",
        },
        fanGroup: {
          transform: "translate(calc(w/2),calc(h/2))",
          event: "element:fan:click",
          cursor: "pointer",
        },
      },
      filters: {
        filter0_d_0_1: {
          x: 296,
          y: 63,
          width: 255,
          height: 252,
          filterUnits: "userSpaceOnUse",
          colorInterpolationFilters: "sRGB",
          definition: [
            {
              type: "flood",
              attrs: { floodOpacity: 0, result: "BackgroundImageFix" },
            },
            {
              type: "colorMatrix",
              attrs: {
                in: "SourceAlpha",
                type: "matrix",
                values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
                result: "hardAlpha",
              },
            },
            { type: "offset", attrs: { dy: 4 } },
            { type: "gaussianBlur", attrs: { stdDeviation: 2 } },
            { type: "composite", attrs: { in2: "hardAlpha", operator: "out" } },
            {
              type: "colorMatrix",
              attrs: {
                type: "matrix",
                values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0",
              },
            },
            {
              type: "blend",
              attrs: {
                mode: "normal",
                in2: "BackgroundImageFix",
                result: "effect1_dropShadow_0_1",
              },
            },
            {
              type: "blend",
              attrs: {
                mode: "normal",
                in: "SourceGraphic",
                in2: "effect1_dropShadow_0_1",
                result: "shape",
              },
            },
          ],
        },
        filter1_d_0_1: {
          x: 313.5,
          y: 82.25,
          width: 220,
          height: 220,
          filterUnits: "userSpaceOnUse",
          colorInterpolationFilters: "sRGB",
          definition: [
            {
              type: "flood",
              attrs: { floodOpacity: 0, result: "BackgroundImageFix" },
            },
            {
              type: "colorMatrix",
              attrs: {
                in: "SourceAlpha",
                type: "matrix",
                values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
                result: "hardAlpha",
              },
            },
            { type: "offset", attrs: { dy: 4 } },
            { type: "gaussianBlur", attrs: { stdDeviation: 2 } },
            { type: "composite", attrs: { in2: "hardAlpha", operator: "out" } },
            {
              type: "colorMatrix",
              attrs: {
                type: "matrix",
                values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0",
              },
            },
            {
              type: "blend",
              attrs: {
                mode: "normal",
                in2: "BackgroundImageFix",
                result: "effect1_dropShadow_0_1",
              },
            },
            {
              type: "blend",
              attrs: {
                mode: "normal",
                in: "SourceGraphic",
                in2: "effect1_dropShadow_0_1",
                result: "shape",
              },
            },
          ],
        },
        filter2_d_0_1: {
          x: 291.5,
          y: 60.25,
          width: 264,
          height: 264,
          filterUnits: "userSpaceOnUse",
          colorInterpolationFilters: "sRGB",
          definition: [
            {
              type: "flood",
              attrs: { floodOpacity: 0, result: "BackgroundImageFix" },
            },
            {
              type: "colorMatrix",
              attrs: {
                in: "SourceAlpha",
                type: "matrix",
                values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
                result: "hardAlpha",
              },
            },
            { type: "offset", attrs: { dy: 4 } },
            { type: "gaussianBlur", attrs: { stdDeviation: 5 } },
            { type: "composite", attrs: { in2: "hardAlpha", operator: "out" } },
            {
              type: "colorMatrix",
              attrs: {
                type: "matrix",
                values: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0",
              },
            },
            {
              type: "blend",
              attrs: {
                mode: "normal",
                in2: "BackgroundImageFix",
                result: "effect1_dropShadow_0_1",
              },
            },
            {
              type: "blend",
              attrs: {
                mode: "normal",
                in: "SourceGraphic",
                in2: "effect1_dropShadow_0_1",
                result: "shape",
              },
            },
          ],
        },
        filter3_d_0_1: {
          x: 11,
          y: 19,
          width: 241,
          height: 152,
          filterUnits: "userSpaceOnUse",
          colorInterpolationFilters: "sRGB",
          definition: [
            {
              type: "flood",
              attrs: { floodOpacity: 0, result: "BackgroundImageFix" },
            },
            {
              type: "colorMatrix",
              attrs: {
                in: "SourceAlpha",
                type: "matrix",
                values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
                result: "hardAlpha",
              },
            },
            { type: "offset", attrs: { dy: 4 } },
            { type: "gaussianBlur", attrs: { stdDeviation: 12.5 } },
            { type: "composite", attrs: { in2: "hardAlpha", operator: "out" } },
            {
              type: "colorMatrix",
              attrs: {
                type: "matrix",
                values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0",
              },
            },
            {
              type: "blend",
              attrs: {
                mode: "normal",
                in2: "BackgroundImageFix",
                result: "effect1_dropShadow_0_1",
              },
            },
            {
              type: "blend",
              attrs: {
                mode: "normal",
                in: "SourceGraphic",
                in2: "effect1_dropShadow_0_1",
                result: "shape",
              },
            },
          ],
        },
      },
    };
  }

  get power() {
    return Math.round(this.get("power") * 100);
  }

  preinitialize() {
    this.markup = util.svg/* xml */ `
      <rect @selector="background" />
      <g @selector="heatPump">
        <g @selector="body">
          <g @selector="feet">
            <rect @selector="feet1" />
            <rect @selector="feet2" />
          </g>
          <g @selector="feetGroup2">
            <rect @selector="feet3" />
            <rect @selector="feet4" />
          </g>
          <g @selector="connectorOne">
            <rect @selector="connector1" />
            <rect @selector="connector2" />
            <rect @selector="connector3" />
          </g>
          <g @selector="connectorTwo">
            <rect @selector="connector4" />
            <rect @selector="connector5" />
            <rect @selector="connector6" />
          </g>
          <rect @selector="bodyFrame" />
          <g @selector="airVentGroup">
            <rect @selector="ventBG" />
            <path @selector="airVent" />
          </g>
          <g @selector="fanGroup">
            <rect @selector="fanCircle" />
            <g @selector="fanBladesGroup">
              <path @selector="fanBlades" />
            </g>
            <g @selector="fanFrame">
              <circle @selector="fanEllipse1" />
              <circle @selector="fanEllipse2" />
              <circle @selector="fanEllipse3" />
              <circle @selector="fanEllipse4" />
              <circle @selector="fanEllipse5" />
            </g>
            <g @selector="frameBolts">
              <circle @selector="bolt1" />
              <circle @selector="bolt2" />
              <circle @selector="bolt3" />
              <circle @selector="bolt4" />
              <circle @selector="bolt5" />
              <circle @selector="bolt6" />
              <circle @selector="bolt7" />
              <circle @selector="bolt8" />
            </g>
          </g>
          <g @selector="displayGroup">
            <rect @selector="display" />
            <rect @selector="displayFrame" />
          </g>
        </g>
        <text @selector="label" />
      </g>
    `;
  }
}

const NewDiagTest = () => {
  const paperContainerRef = useRef(null);
  const toolbarContainerRef = useRef(null);
  const stencilContainerRef = useRef(null);
  const graphRef = useRef(null);
  const canvas = useRef(null);

  const logsContainerRef = useRef(null);
  const lastViewRef = useRef(null);
  const timerRef = useRef(null);
  let linkIdCounter = 0;
  const [logs, setLogs] = useState([]);

  const log = (event, text) => {
    setLogs((prevLogs) => [...prevLogs, { event, text }]);
    console.log("logs: ", logs);
  };

  const clearTools = () => {
    if (!lastViewRef.current) return;
    lastViewRef.current.removeTools();
    lastViewRef.current = null;
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--liquid-color", LIQUID_COLOR);

    // Namespace and graph setup
    const namespace = {
      ...shapes,
      Zone,
      Pipe,
      PipeView,
      LiquidTank,
      ConicTank,
      Panel,
      PanelView,
      Pump,
      PumpView,
      ControlValve,
      ControlValveView,
      HandValve,
      Join,
      Shape,
      TemplateImage,
    };
    const graph = new dia.Graph(
      {},
      {
        cellNamespace: namespace,
      }
    );

    const paper = new dia.Paper({
      model: graph,
      width: 1200,
      height: 1000,
      gridSize: 1,
      async: true,
      frozen: true,
      sorting: dia.Paper.sorting.APPROX,
      background: { color: "#F3F7F6" },
      interactive: {
        linkMove: false,
        stopDelegation: false,
      },
      cellViewNamespace: namespace,
      defaultAnchor: {
        name: "perpendicular",
      },
      cellViewNamespace: shapes,
      defaultLink: () => {
        const linkIdNumber = ++linkIdCounter;
        return createPipe(linkIdNumber);
      },
      defaultConnectionPoint: { name: "anchor" },
      // defaultAnchor: (view, magnet, ...rest) => {
      //   const group = view.findAttribute("port-group", magnet);
      //   const anchorFn = group === "in" ? anchors.left : anchors.right;
      //   return anchorFn(view, magnet, ...rest);
      // },
      // defaultConnector: {
      //   name: "curve",
      //   args: {
      //     sourceDirection: connectors.curve.TangentDirections.RIGHT,
      //     targetDirection: connectors.curve.TangentDirections.LEFT,
      //   },
      // },
      validateMagnet: (sourceView, sourceMagnet) => {
        const sourceGroup = sourceView.findAttribute(
          "port-group",
          sourceMagnet
        );
        const sourcePort = sourceView.findAttribute("port", sourceMagnet);
        const source = sourceView.model;

        if (sourceGroup !== "out") {
          log(
            "paper<validateMagnet>",
            "It's not possible to create a link from an inbound port."
          );
          return false;
        }

        if (
          graph
            .getConnectedLinks(source, { outbound: true })
            .find((link) => link.source().port === sourcePort)
        ) {
          log(
            "paper<validateMagnet>",
            "The port has already an inbound link (we allow only one link per port)"
          );
          return false;
        }

        return true;
      },
      validateConnection: (
        sourceView,
        sourceMagnet,
        targetView,
        targetMagnet
      ) => {
        if (sourceView === targetView) return false;

        const targetGroup = targetView.findAttribute(
          "port-group",
          targetMagnet
        );
        const targetPort = targetView.findAttribute("port", targetMagnet);
        const target = targetView.model;

        if (target.isLink()) return false;
        if (targetGroup !== "in") return false;

        if (
          graph
            .getConnectedLinks(target, { inbound: true })
            .find((link) => link.target().port === targetPort)
        ) {
          return false;
        }

        return true;
      },
      clickThreshold: 10,
      magnetThreshold: "onleave",
      linkPinning: false,
      snapLinks: { radius: 20 },
      snapLabels: true,
      markAvailable: true,
      highlighting: {
        connecting: {
          name: "mask",
          options: {
            layer: dia.Paper.Layers.BACK,
            attrs: { stroke: "#0057FF", "stroke-width": 3 },
          },
        },
      },
    });

    const shapes01 = createShapes();
    graph.addCells(shapes01);

    const templateImage = new TemplateImage({
      svg: HeatPumpSVG,
      attrs: {},
    });
    const [ti1] = addImages(templateImage, 220);
    ti1.set("color", "red");

    function addImages(image, x = 0, y = 20) {
      const images = [
        image
          .clone()
          .resize(300, 300)
          .position(x, y + 230),
      ];
      graph.addCells(images);
      return images;
    }

    paper.on("link:mouseenter", (linkView) => {
      clearTimeout(timerRef.current);
      clearTools();
      lastViewRef.current = linkView;
      linkView.addTools(
        new dia.ToolsView({
          name: "onhover",
          tools: [
            new PortTargetArrowhead(),
            new linkTools.Remove({
              distance: -60,
              markup: [
                {
                  tagName: "circle",
                  selector: "button",
                  attributes: {
                    r: 10,
                    fill: "#FFD5E8",
                    stroke: "#FD0B88",
                    "stroke-width": 2,
                    cursor: "pointer",
                  },
                },
                {
                  tagName: "path",
                  selector: "icon",
                  attributes: {
                    d: "M -4 -4 4 4 M -4 4 4 -4",
                    fill: "none",
                    stroke: "#333",
                    "stroke-width": 3,
                    "pointer-events": "none",
                  },
                },
              ],
            }),
          ],
        })
      );
    });

    paper.on("link:mouseleave", (linkView) => {
      timerRef.current = setTimeout(() => clearTools(), 500);
    });

    paper.on("link:connect", (linkView) => {
      const link = linkView.model;
      const source = link.source();
      const target = link.target();
      log(
        "paper<link:connect>",
        `${link.id} now goes from ${source.port} of ${source.id} to port ${target.port} of ${target.id}.`
      );
    });

    paper.on(
      "link:disconnect",
      (linkView, evt, prevElementView, prevMagnet) => {
        const link = linkView.model;
        const prevPort = prevElementView.findAttribute("port", prevMagnet);
        log(
          "paper<link:disconnect>",
          `${link.id} disconnected from port ${prevPort} of ${prevElementView.model.id}.`
        );
      }
    );

    graph.on("remove", (cell) => {
      if (!cell.isLink()) return;
      const source = cell.source();
      const target = cell.target();
      if (!target.id) {
        linkIdCounter--;
        return;
      }
      log(
        "graph<remove>",
        `${cell.id} between ${source.port} of ${source.id} and ${target.port} of ${target.id} was removed.`
      );
    });

    const scroller = new ui.PaperScroller({
      paper,
      autoResizePaper: true,
      cursor: "grab",
    });

    canvas.current?.appendChild(scroller.el);
    if (canvas.current) {
      canvas.current.innerHTML = "";
      canvas.current.appendChild(paper.el);
      console.log("Paper mounted", canvas.current);
    }

    // scroller.render().center();

    // Create stencil widget
    const stencil = new ui.Stencil({
      paper: paper,
      usePaperGrid: true,
      width: 240,
      height: 600,

      groups: {
        equipment: { index: 1, label: "Equipment" },
        valves: { index: 2, label: "Valves" },
        tanks: { index: 3, label: "Tanks" },
        connections: { index: 4, label: "Connections" },
        zones: { index: 5, label: "Zones" },
      },
      scaleClones: true,
      dropAnimation: true,
      search: {
        "*": ["type", "attrs/label/text"],
        enabled: true,
        placeholder: "Search elements...",
        width: 220,
      },
      groupsToggleButtons: true,
      layout: {
        columns: 1,
        marginX: 10,
        marginY: 10,
        columnGap: 10,
        rowGap: 10,
      },
      paperOptions: function () {
        return {
          model: new dia.Graph(),
          interactive: false,
          background: { color: "#f8f9fa" },
        };
      },
    });

    console.log(
      "Stencil created with groups:",
      Object.keys(stencil.options.groups)
    );

    // Mount stencil to container first
    if (stencilContainerRef.current) {
      stencilContainerRef.current.innerHTML = "";
      stencilContainerRef.current.appendChild(stencil.el);
    }

    // Render the stencil after mounting
    stencil.render();

    // Create stencil elements for each group
    const equipmentElements = [
      new Pump({
        // position: { x: 10, y: 10 },
        size: { width: 80, height: 80 },
        ports: {
          items: [
            { id: "in1", group: "in" },
            { id: "out1", group: "out" },
          ],
        },
        attrs: {
          label: { text: "Pump" },
        },
      }),
      new TemplateImage({
        position: { x: 10, y: 10 },
        svg: HeatPumpSVG,
        size: { width: 100, height: 100 },
        // ports: {
        //   items: [
        //     { id: "in1", group: "in" },
        //     { id: "out1", group: "out" },
        //   ],
        // },
        attrs: {
          label: { text: "Pump" },
        },
      }),
    ];

    const valveElements = [
      new ControlValve({
        position: { x: 10, y: 10 },
        size: { width: 50, height: 50 },
        attrs: {
          label: { text: "Control Valve" },
        },
      }),
      new HandValve({
        position: { x: 10, y: 10 },
        size: { width: 50, height: 50 },
        attrs: {
          label: { text: "Hand Valve" },
        },
      }),
    ];

    const tankElements = [
      new LiquidTank({
        position: { x: 10, y: 10 },
        size: { width: 120, height: 200 },
        attrs: {
          label: { text: "Liquid Tank" },
        },
      }),
      new ConicTank({
        position: { x: 10, y: 10 },
        size: { width: 120, height: 80 },
        attrs: {
          label: { text: "Conic Tank" },
        },
      }),
      new Panel({
        position: { x: 10, y: 10 },
        size: { width: 80, height: 180 },
        attrs: {
          label: { text: "Panel" },
        },
      }),
    ];

    const connectionElements = [
      new Pipe({
        source: { x: 0, y: 50 },
        target: { x: 100, y: 50 },
        attrs: {
          label: { text: "Pipe" },
        },
      }),
      new Join({
        position: { x: 10, y: 10 },
        size: { width: 30, height: 30 },
      }),
    ];

    const zoneElements = [
      new Zone({
        position: { x: 10, y: 10 },
        size: { width: 100, height: 40 },
        attrs: {
          label: { text: "Zone" },
        },
      }),
    ];

    console.log("Equipment elements:", equipmentElements.length);
    console.log("Valve elements:", valveElements.length);
    console.log("Tank elements:", tankElements.length);
    console.log("Connection elements:", connectionElements.length);
    console.log("Zone elements:", zoneElements.length);

    // Load elements into stencil
    try {
      // Test with just one group first
      stencil.load({
        equipment: equipmentElements,
      });
      console.log("Stencil loaded successfully with equipment group");

      // Then add the rest
      setTimeout(() => {
        try {
          stencil.load({
            valves: valveElements,
            tanks: tankElements,
            connections: connectionElements,
            zones: zoneElements,
          });
          console.log("All stencil groups loaded successfully");
        } catch (error) {
          console.error("Error loading additional stencil groups:", error);
        }
      }, 100);
    } catch (error) {
      console.error("Error loading stencil:", error);
    }

    // Add stencil event handlers
    stencil.on("element:drop", (elementView, evt, x, y) => {
      // const element = elementView.model;
      // // Generate unique ID for the dropped element
      // const uniqueId = util.uuid();
      // element.set("id", uniqueId);
      // // Add default properties based on element type
      // if (element.get("type") === "Pump") {
      //   element.set("power", 0);
      //   element.attr("label/text", `Pump ${uniqueId.slice(0, 8)}`);
      // } else if (element.get("type") === "ControlValve") {
      //   element.set("open", 1);
      //   element.attr("label/text", `CTRL Valve ${uniqueId.slice(0, 8)}`);
      // } else if (element.get("type") === "HandValve") {
      //   element.set("open", 1);
      //   element.attr("label/text", `Valve ${uniqueId.slice(0, 8)}`);
      // } else if (element.get("type") === "LiquidTank") {
      //   element.set("level", START_LIQUID);
      //   element.attr("label/text", `Tank ${uniqueId.slice(0, 8)}`);
      // } else if (element.get("type") === "ConicTank") {
      //   element.attr("label/text", `Tank ${uniqueId.slice(0, 8)}`);
      // } else if (element.get("type") === "Panel") {
      //   element.set("level", START_LIQUID);
      //   element.attr("label/text", `Panel ${uniqueId.slice(0, 8)}`);
      // } else if (element.get("type") === "Zone") {
      //   element.attr("label/text", `Zone ${uniqueId.slice(0, 8)}`);
      // }
      // console.log(`Element dropped: ${element.get("type")} at (${x}, ${y})`);
    });

    stencil.on("element:pointerclick", (elementView) => {
      // Show element info on click
      const element = elementView.model;
      console.log(`Stencil element clicked: ${element.get("type")}`);
    });

    const toolbar = new ui.Toolbar({
      tools: [
        {
          type: "label",
          name: "title",
          text: "SCADA: Piping & Instrumentation Diagram",
        },
        {
          type: "separator",
        },
        {
          type: "checkbox",
          name: "controls",
          label: "Controls",
          value: true,
        },
        {
          type: "checkbox",
          name: "instrumentation",
          label: "Instrumentation",
          value: true,
        },
        {
          type: "separator",
        },
        {
          type: "label",
          text: "Color",
        },
        {
          type: "color-picker",
          name: "color",
          value: getComputedStyle(document.documentElement).getPropertyValue(
            "--accent-color"
          ),
        },
      ],
    });

    toolbar.render();
    toolbar.on({
      "controls:change": (value) => {
        // addControls(paper); // implement if needed
      },
      "instrumentation:change": (value) => {
        // addCharts(paper); // implement if needed
      },
      "color:input": (value) => {
        document.documentElement.style.setProperty("--accent-color", value);
      },
    });

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

    const tank1 = new LiquidTank({
      position: { x: 50, y: 250 },
    });
    const panel1 = new Panel({
      position: { x: 70, y: 300 },
    });

    // const HeatPump01 = new HeatPump({
    //   // position: { x: 100, y: 300 },
    // });

    // HeatPump01.addTo(graph);

    // When the tank level changes, update the panel level and color.
    panel1.listenTo(tank1, "change:level", (_, level) => {
      const color =
        level > 80
          ? MAX_LIQUID_COLOR
          : level < 20
          ? MIN_LIQUID_COLOR
          : LIQUID_COLOR;
      panel1.set({ level, color });
    });

    tank1.addTo(graph);
    panel1.addTo(graph);
    tank1.embed(panel1);

    const tank2 = new ConicTank({
      position: { x: 820, y: 200 },
    });

    tank2.addTo(graph);

    // Pumps

    const pump1 = new Pump({
      position: { x: 460, y: 250 },
      ports: {
        items: [
          { id: "in1", group: "in", attrs: { portLabel: { text: "in1" } } },
          { id: "out1", group: "out", attrs: { portLabel: { text: "Out 1" } } },
          // { id: "out2", group: "out", attrs: { portLabel: { text: "Out 2" } } },
          // { id: "out3", group: "out", attrs: { portLabel: { text: "Out 3" } } },
        ],
      },
      attrs: {
        label: {
          text: "Pump 1",
        },
      },
    });

    pump1.addTo(graph);
    pump1.power = 1;

    const pump2 = new Pump({
      position: { x: 460, y: 450 },
      attrs: {
        label: {
          text: "Pump 2",
        },
      },
    });

    pump2.addTo(graph);
    pump2.power = 0;

    // CTRL Valves

    const controlValve1 = new ControlValve({
      position: { x: 300, y: 295 },
      open: 1,
      attrs: {
        label: {
          text: "CTRL Valve 1",
        },
      },
    });

    controlValve1.addTo(graph);

    const controlValve2 = new ControlValve({
      position: { x: 300, y: 495 },
      open: 0.25,
      attrs: {
        label: {
          text: "CTRL Valve 2",
        },
      },
    });

    controlValve2.addTo(graph);

    // Zones

    const zone1 = new Zone({
      position: { x: 50, y: 600 },
      attrs: {
        label: {
          text: "Zone 1",
        },
      },
    });

    const zone2 = new Zone({
      position: { x: 865, y: 600 },
      attrs: {
        label: {
          text: "Zone 2",
        },
      },
    });

    graph.addCells([zone1, zone2]);

    // Hand Valves

    const handValve1 = new HandValve({
      position: { x: 875, y: 450 },
      open: 1,
      angle: 270,
      attrs: {
        label: {
          text: "Valve 1",
        },
      },
    });

    handValve1.addTo(graph);

    const handValve2 = new HandValve({
      position: { x: 650, y: 250 },
      open: 1,
      angle: 0,
      attrs: {
        label: {
          text: "Valve 2",
        },
      },
    });

    handValve2.addTo(graph);

    const handValve3 = new HandValve({
      position: { x: 650, y: 450 },
      open: 1,
      angle: 0,
      attrs: {
        label: {
          text: "Valve 3",
        },
      },
    });

    handValve3.addTo(graph);

    // Joins

    const join1 = new Join({
      position: { x: 772, y: 460 },
    });

    join1.addTo(graph);

    const join2 = new Join({
      position: { x: 810, y: 605 },
    });

    join2.addTo(graph);

    // Pipes

    const tank1Pipe1 = new Pipe({
      source: {
        id: tank1.id,
        anchor: { name: "right", args: { dy: -25 } },
        connectionPoint: { name: "anchor" },
      },
      target: {
        id: controlValve1.id,
        port: "left",
        anchor: { name: "left" },
      },
    });

    // tank1Pipe1.addTo(graph);

    const tank1Pipe2 = new Pipe({
      source: {
        id: tank1.id,
        anchor: { name: "bottomRight", args: { dy: -40 } },
        connectionPoint: { name: "anchor" },
      },
      target: {
        id: controlValve2.id,
        port: "left",
        anchor: { name: "left" },
        connectionPoint: { name: "anchor" },
      },
    });

    tank1Pipe2.addTo(graph);

    const tank2Pipe1 = new Pipe({
      source: {
        id: tank2.id,
        selector: "bottom",
        anchor: { name: "bottom" },
        connectionPoint: { name: "anchor" },
      },
      target: {
        id: handValve1.id,
        port: "right",
        anchor: { name: "right", args: { rotate: true } },
        connectionPoint: { name: "anchor" },
      },
    });

    tank2Pipe1.addTo(graph);

    const ctrlValve1Pipe1 = new Pipe({
      source: {
        id: controlValve1.id,
        port: "right",
        anchor: { name: "right" },
      },
      target: { id: pump1.id, port: "left", anchor: { name: "left" } },
    });

    ctrlValve1Pipe1.addTo(graph);

    const valve2Pipe1 = new Pipe({
      source: {
        id: handValve2.id,
        port: "right",
        anchor: { name: "right", args: { rotate: true } },
        connectionPoint: { name: "anchor" },
      },
      target: {
        id: join1.id,
        anchor: { name: "top" },
        connectionPoint: { name: "anchor" },
      },
    });

    valve2Pipe1.addTo(graph);

    const valve1Pipe1 = new Pipe({
      source: {
        id: handValve1.id,
        port: "left",
        anchor: { name: "left", args: { rotate: true } },
        connectionPoint: { name: "anchor" },
      },
      target: {
        id: join2.id,
        anchor: { name: "top" },
        connectionPoint: { name: "anchor" },
      },
    });

    valve1Pipe1.addTo(graph);

    const pump1Pipe1 = new Pipe({
      source: {
        id: pump1.id,
        port: "right",
        anchor: { name: "right", args: { rotate: true } },
        connectionPoint: { name: "anchor" },
      },
      target: {
        id: handValve2.id,
        port: "left",
        anchor: { name: "left", args: { rotate: true } },
        connectionPoint: { name: "anchor" },
      },
    });

    pump1Pipe1.addTo(graph);

    const valve3Pipe1 = new Pipe({
      source: {
        id: handValve3.id,
        port: "right",
        anchor: { name: "right", args: { rotate: true } },
        connectionPoint: { name: "anchor" },
      },
      target: {
        id: join1.id,
        anchor: { name: "left" },
        connectionPoint: { name: "anchor" },
      },
    });

    valve3Pipe1.addTo(graph);

    const pump2Pipe1 = new Pipe({
      source: {
        id: pump2.id,
        port: "right",
        anchor: { name: "right", args: { rotate: true } },
        connectionPoint: { name: "anchor" },
      },
      target: {
        id: handValve3.id,
        port: "left",
        anchor: { name: "left", args: { rotate: true } },
        connectionPoint: { name: "anchor" },
      },
    });

    pump2Pipe1.addTo(graph);

    const ctrlValve2Pipe1 = new Pipe({
      source: {
        id: controlValve2.id,
        port: "right",
        anchor: { name: "right" },
      },
      target: {
        id: pump2.id,
        port: "left",
        anchor: { name: "left", args: { rotate: true } },
        connectionPoint: { name: "anchor" },
      },
    });

    ctrlValve2Pipe1.addTo(graph);

    const zone1Pipe1 = new Pipe({
      source: {
        id: zone1.id,
        port: "left",
        anchor: { name: "left", args: { rotate: true, dx: 10 } },
        connectionPoint: { name: "anchor" },
      },
      target: {
        id: tank1.id,
        anchor: { name: "bottomLeft", args: { dy: -30 } },
        connectionPoint: { name: "anchor" },
      },
    });

    zone1Pipe1.addTo(graph);

    const join1Pipe1 = new Pipe({
      source: {
        id: join1.id,
        anchor: { name: "bottom" },
        connectionPoint: { name: "anchor" },
      },
      target: {
        id: join2.id,
        anchor: { name: "left" },
        connectionPoint: { name: "anchor" },
      },
    });

    join1Pipe1.addTo(graph);

    const join2Pipe1 = new Pipe({
      source: {
        id: join2.id,
        anchor: { name: "right" },
        connectionPoint: { name: "anchor" },
      },
      target: {
        id: zone2.id,
        anchor: { name: "left", args: { dx: 10 } },
        connectionPoint: { name: "anchor" },
      },
    });

    join2Pipe1.addTo(graph);

    // Charts

    const maxPoints = 10;
    const tankChart = new shapes.chart.Plot({
      position: { x: 50, y: 50 },
      size: { width: 300, height: 150 },
      series: [
        {
          name: "level",
          interpolate: "linear",
          showLegend: false,
          fillPadding: { top: 10 },
          data: Array.from({ length: maxPoints }).map((_, i) => ({
            x: i,
            y: START_LIQUID,
          })),
        },
      ],
      axis: {
        "y-axis": {
          min: 0,
          max: 100,
          ticks: 10,
        },
        "x-axis": {
          tickFormat: function (t) {
            const d = new Date(t * 1000);
            return (
              d.getMinutes().toString().padStart(2, "0") +
              ":" +
              d.getSeconds().toString().padStart(2, "0")
            );
          },
        },
      },
      padding: 0,
      markings: [
        {
          name: "max",
          start: { y: 80 },
        },
        {
          name: "min",
          end: { y: 20 },
        },
      ],
      // Historically, the chart shapes are defined without camel-cased attributes
      attrs: {
        ".": {
          "font-family": "sans-serif",
        },
        ".level path": {
          stroke: "#0075f2",
          "stroke-width": 1,
          "stroke-opacity": "0.8",
          fill: "#0075f2",
          "fill-opacity": "0.3",
        },
        ".marking.max rect": {
          fill: MAX_LIQUID_COLOR,
          height: 3,
        },
        ".marking.min rect": {
          fill: MIN_LIQUID_COLOR,
          height: 3,
        },
        ".point circle": {
          fill: "#0075f2",
          stroke: "none",
          opacity: 1,
        },
        ".y-axis > path, .x-axis > path": {
          stroke: "#131e29",
          "stroke-width": 2,
        },
        ".background rect": {
          fill: "#999",
          "fill-opacity": "0.1",
        },
      },
    });

    tankChart.addTo(graph);

    const tankChartLink = new shapes.standard.Link({
      source: { id: tankChart.id },
      target: { id: tank1.id },
      attrs: {
        line: {
          strokeDasharray: "5 5",
          targetMarker: null,
          stroke: "#aaa",
        },
      },
    });

    tankChartLink.addTo(graph);

    // const heatPump = new HeatPump();
    // heatPump.position(100, 100);
    // graph.addCell(heatPump);

    const gauge1 = new shapes.chart.Knob({
      position: { x: 380, y: 100 },
      size: { width: 120, height: 120 },
      min: 0,
      max: 10,
      step: 0.1,
      value: 1,
      fill: PRESSURE_COLOR,
      // Historically, the chart shapes are defined without camel-cased attributes
      attrs: {
        root: {
          "font-family": "sans-serif",
        },
      },
      serieDefaults: {
        startAngle: 90,
        label: "Ⓟ bar",
      },
      sliceDefaults: {
        legendLabel: "{value:.1f}",
        onClickEffect: { type: "none" },
      },
    });

    gauge1.addTo(graph);

    const gauge1Link = new shapes.standard.Link({
      source: { id: gauge1.id, anchor: { name: "bottom" } },
      target: { id: ctrlValve1Pipe1.id },
      z: -1,
      attrs: {
        line: {
          strokeDasharray: "5 5",
          targetMarker: {
            type: "circle",
            r: 12,
            fill: "#eee",
            stroke: "#666",
            "stroke-width": 2,
          },
          stroke: "#aaa",
        },
      },
    });

    gauge1Link.addTo(graph);

    const gauge2 = gauge1.clone();
    const gauge2Link = gauge1Link.clone();

    gauge2.position(380, 600);

    gauge2Link.source({ id: gauge2.id, anchor: { name: "bottom" } });
    gauge2Link.target({ id: ctrlValve2Pipe1.id });

    gauge2.addTo(graph);
    gauge2Link.addTo(graph);

    if (toolbarContainerRef.current) {
      toolbarContainerRef.current.innerHTML = "";
      toolbarContainerRef.current.appendChild(toolbar.el);
    }

    paper.on("element:pointerclick", (elementView) => {
      paper.removeTools();
      const element = elementView.model;
      if (element.get("uniqueKey") === "valve") {
        const currentStatus = element.attr("state/status");
        element.attr(
          "state/status",
          currentStatus === "open" ? "closed" : "open"
        );
        element.attr("label/text", `Valve (${element.attr("state/status")})`);
        element.attr(
          "body/fill",
          currentStatus === "open" ? "#32CD32" : "#FF4500"
        );
      }
      const toolsView = new dia.ToolsView({
        tools: [
          new elementTools.Boundary({ useModelGeometry: true }),
          new elementTools.Connect({
            useModelGeometry: true,
            x: "calc(w + 10)",
            y: "calc(h / 2)",
          }),
          new elementTools.Remove({
            useModelGeometry: true,
            x: -10,
            y: -10,
          }),
        ],
      });
      elementView.addTools(toolsView);
    });

    // Cleanup on unmount
    return () => {
      scroller.remove();
      paper.remove();
      clearTimeout(timerRef.current);
      //   if (intervalId) clearInterval(intervalId);
      // Optionally, destroy paper/graph if needed
    };
  }, []);

  return (
    // <div className="canvas" ref={canvas} />
    // <div style={{ width: "100%", height: "100%" }}>
    //   <div ref={toolbarContainerRef} />
    //   <div style={{ display: "flex", height: "calc(100vh - 40px)" }}>
    //     <div
    //       ref={stencilContainerRef}
    //       style={{
    //         width: "240px",
    //         height: "100%",
    //         border: "1px solid #ccc",
    //         backgroundColor: "#f8f9fa",
    //         overflow: "auto",
    //       }}
    //     />
    //     <div
    //       ref={canvas}
    //       style={{
    //         flex: 1,
    //         height: "100%",
    //         border: "2px solid orange",
    //       }}
    //     />
    //   </div>
    // </div>
    <div
      className="jointjs-container"
      style={{ display: "flex", height: "100vh" }}
    >
      <div
        ref={stencilContainerRef}
        id="stencil"
        style={{ width: 170, borderRight: "1px solid #eee" }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          ref={toolbarContainerRef}
          id="toolbar"
          style={{ height: 50, borderBottom: "1px solid #eee" }}
        />
        <div style={{ display: "flex", flex: 1 }}>
          <div
            ref={canvas}
            id="paper"
            style={{ flex: 1, background: "#F5F5F5" }}
          />
        </div>
        <div
          id="logs-container"
          ref={logsContainerRef}
          className="w-1/4 h-full overflow-auto p-4 bg-white border-l border-gray-200"
        >
          {logs.map((log, index) => (
            <div key={index}>
              <div className="log-event text-sm font-bold">{log.event}</div>
              <div className="log-text text-sm mb-2">{log.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewDiagTest;
