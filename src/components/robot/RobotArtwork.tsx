/** Original vector artwork. Decorative schematic, never live telemetry. */
export default function RobotArtwork() {
  return (
    <svg viewBox="0 0 640 560" fill="none" aria-hidden="true" className="robot-artwork">
      <defs>
        <pattern id="robot-dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.45" fill="#218fea" /></pattern>
        <pattern id="robot-fine" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".75" fill="#218fea" /></pattern>
        <linearGradient id="robot-fade" x1="170" y1="100" x2="520" y2="520" gradientUnits="userSpaceOnUse"><stop stopColor="white"/><stop offset="1" stopColor="white" stopOpacity=".1"/></linearGradient>
        <mask id="robot-mask"><rect width="640" height="560" fill="url(#robot-fade)"/></mask>
      </defs>
      <g opacity=".32" stroke="#42aaf5">
        <ellipse cx="343" cy="428" rx="263" ry="100" strokeDasharray="3 7"/>
        <ellipse cx="343" cy="428" rx="211" ry="72"/>
        <path d="M30 414 320 246 610 414M30 446 320 278 610 446M126 495 421 324M230 536 524 365"/>
        <path d="M71 101h36m-18-18v36M542 204h36m-18-18v36M120 335h24m-12-12v24"/>
      </g>
      <g mask="url(#robot-mask)">
        <ellipse cx="354" cy="436" rx="155" ry="38" fill="url(#robot-fine)"/>
        <g fill="url(#robot-dots)" stroke="#218fea" strokeWidth="1.5">
          <ellipse cx="253" cy="409" rx="35" ry="47" transform="rotate(-13 253 409)"/>
          <ellipse cx="448" cy="396" rx="33" ry="45" transform="rotate(-13 448 396)"/>
          <ellipse cx="373" cy="447" rx="35" ry="45" transform="rotate(-13 373 447)"/>
          <path d="m191 260 128-70 178 61-5 123-125 64-167-61Z" fill="white"/>
          <path d="m191 260 176 61v117l-167-61Z" fill="url(#robot-fine)"/>
          <path d="m367 321 130-70-5 123-125 64Z"/>
          <path d="m191 260 128-70 178 61-130 70Z" fill="url(#robot-fine)"/>
          <path d="m210 257 109-59 157 55-111 58Z" fill="white"/>
          <path d="m230 282 97 34v18l-97-34Z"/>
          <path d="m388 325 85-44v23l-85 44Z" fill="#1475d1"/>
        </g>
        <g stroke="#1475d1" strokeWidth="2">
          <path d="M327 218v-48"/><ellipse cx="327" cy="163" rx="25" ry="10" fill="white"/>
          <path d="M302 163v13c0 14 50 14 50 0v-13" fill="url(#robot-dots)"/>
          <circle cx="409" cy="326" r="6" fill="white"/><circle cx="453" cy="303" r="6" fill="white"/>
          <ellipse cx="253" cy="409" rx="13" ry="21" fill="white"/><ellipse cx="373" cy="447" rx="13" ry="21" fill="white"/>
        </g>
        <g stroke="#42aaf5" strokeDasharray="3 6" opacity=".6">
          <ellipse cx="327" cy="163" rx="66" ry="25"/><ellipse cx="327" cy="163" rx="109" ry="43"/><ellipse cx="327" cy="163" rx="152" ry="61"/>
          <path d="m438 315 133-70M438 315l151 40"/>
        </g>
      </g>
      <g stroke="#1475d1" opacity=".65"><path d="M354 163h104l22-28h74M246 348H132l-23 23H54"/><circle cx="354" cy="163" r="3" fill="#1475d1"/><circle cx="246" cy="348" r="3" fill="#1475d1"/></g>
      <g fill="#1475d1" fontSize="10" fontFamily="monospace" letterSpacing="1.5"><text x="482" y="127">LIDAR / 360°</text><text x="54" y="389">AUTONOMOUS</text><text x="54" y="405">DELIVERY UNIT</text><text x="430" y="514">OTTO / CONCEPT</text></g>
    </svg>
  );
}
