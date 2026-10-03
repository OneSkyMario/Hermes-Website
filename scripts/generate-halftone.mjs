import { mkdirSync, writeFileSync } from 'node:fs';

// Sample a continuous tonal field onto a print grid. Curved bands suggest
// navigation/sensor sweeps without outlines, labels, or a literal robot.
const bell = (value) => Math.exp(-value * value);
const fields = [
  [-10, 60, 370, 230, -.5, 1.05],
  [1300, 30, 390, 270, .5, 1],
  [0, 460, 290, 330, -.35, .95],
  [660, 870, 460, 230, -.25, 1],
  [1370, 660, 350, 340, .65, 1.1],
];
let dots = '';
for (let y = 4; y < 840; y += 7) {
  for (let x = 4; x < 1440; x += 7) {
    let tone = 0;
    for (const [cx, cy, rx, ry, angle, weight] of fields) {
      const u = ((x - cx) * Math.cos(angle) + (y - cy) * Math.sin(angle)) / rx;
      const v = (-(x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle)) / ry;
      const radius = Math.hypot(u, v);
      const warp = .13 * Math.sin(u * 5 + v * 3) + .09 * Math.cos(v * 7);
      const band = bell((radius + warp - .7) / .32);
      const body = .35 * bell(radius / .8);
      tone += (band + body) * weight;
    }
    // A softly cleared center keeps the print integrated without obscuring copy.
    const clearing = 1 - .98 * Math.exp(-Math.pow((x - 720) / 490, 4) - Math.pow((y - 355) / 245, 4));
    const grain = .86 + .14 * Math.sin(x * 12.9898 + y * 78.233);
    const radius = Math.min(3.05, 3.05 * tone * clearing * grain);
    if (radius > .28) dots += `<circle cx="${x}" cy="${y}" r="${radius.toFixed(2)}"/>`;
  }
}
const directory = new URL('../public/art/', import.meta.url);
mkdirSync(directory, { recursive: true });
writeFileSync(new URL('hero-halftone.svg', directory), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 840"><g fill="#2785e9">${dots}</g></svg>\n`);
// Recompose the same field for portrait screens while preserving round dots.
const mobileDots = dots.replace(/cx="(\d+)"/g, (_, x) => `cx="${Number(x) / 2}"`).replace(/r="([\d.]+)"/g, (_, r) => `r="${(Number(r) * .65).toFixed(2)}"`);
writeFileSync(new URL('hero-halftone-mobile.svg', directory), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 840"><g fill="#2785e9">${mobileDots}</g></svg>\n`);
