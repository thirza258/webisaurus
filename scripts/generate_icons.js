const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ICONS_DIR = path.join(__dirname, '..', 'src', 'icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// 1. Generate SVG Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="96" fill="#000000"/>
  <rect x="8" y="8" width="496" height="496" rx="88" fill="none" stroke="#262626" stroke-width="6"/>
  <!-- Code Comparator Symbol & Dinosaur Spine -->
  <g fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left Bracket < -->
    <path d="M 150 200 L 90 256 L 150 312" stroke="#3b82f6" stroke-width="26" />
    
    <!-- Right Bracket > -->
    <path d="M 362 200 L 422 256 L 362 312" stroke="#3b82f6" stroke-width="26" />
    
    <!-- Stylized Dinosaur / Stegosaurus Silhouette & Plates -->
    <path d="M 180 340 L 180 290 Q 180 230 240 220 L 290 220 Q 320 220 330 190 L 330 160 Q 330 140 360 140 L 380 140 Q 400 140 400 160 L 400 180 L 370 180" stroke="#ffffff" />
    <path d="M 370 210 L 400 210 Q 410 230 390 250 L 350 270 Q 340 300 340 340" stroke="#ffffff" />
    <!-- Foot plates / spine points -->
    <polygon points="210,220 225,185 240,220" fill="#ffffff" stroke="none" />
    <polygon points="255,220 270,180 285,220" fill="#ffffff" stroke="none" />
    <polygon points="295,220 310,185 325,220" fill="#ffffff" stroke="none" />
    
    <!-- Eye -->
    <circle cx="375" cy="160" r="5" fill="#3b82f6" stroke="none" />
    
    <!-- Base platform line -->
    <line x1="160" y1="360" x2="360" y2="360" stroke="#525252" stroke-width="16" />
  </g>
</svg>`;

fs.writeFileSync(path.join(ICONS_DIR, 'icon.svg'), svgContent, 'utf8');
console.log('Created icon.svg');

// 2. Generate PNG with pure Node.js
function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function renderIconPng(size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // 8-bit
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdr);

  const rowSize = 1 + size * 4;
  const raw = Buffer.alloc(rowSize * size);

  const scale = size / 512;
  const rCorner = Math.floor(80 * scale);

  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // Filter None
    for (let x = 0; x < size; x++) {
      const px = rowOffset + 1 + x * 4;

      // Rounded rectangle test
      let inCard = true;
      const dx = x < rCorner ? rCorner - x : (x > size - rCorner ? x - (size - rCorner) : 0);
      const dy = y < rCorner ? rCorner - y : (y > size - rCorner ? y - (size - rCorner) : 0);
      if (dx * dx + dy * dy > rCorner * rCorner) {
        inCard = false;
      }

      if (!inCard) {
        raw[px] = 0;
        raw[px + 1] = 0;
        raw[px + 2] = 0;
        raw[px + 3] = 0; // Transparent outside
        continue;
      }

      // Background color: OLED black #0a0a0a
      let r = 10, g = 10, b = 10, a = 255;

      // Subtle border
      const onBorder = (x <= 3 * scale || x >= size - 3 * scale || y <= 3 * scale || y >= size - 3 * scale);
      if (onBorder) {
        r = 38; g = 38; b = 38;
      }

      // Coordinates mapped to 512x512
      const nx = x / scale;
      const ny = y / scale;

      // Left bracket <
      const inLeft1 = (Math.abs((ny - 200) - (256 - nx) * 0.93) < 14 && nx >= 90 && nx <= 150 && ny >= 200 && ny <= 256);
      const inLeft2 = (Math.abs((ny - 312) + (256 - nx) * 0.93) < 14 && nx >= 90 && nx <= 150 && ny >= 256 && ny <= 312);
      // Right bracket >
      const inRight1 = (Math.abs((ny - 200) - (nx - 256) * 0.93) < 14 && nx >= 362 && nx <= 422 && ny >= 200 && ny <= 256);
      const inRight2 = (Math.abs((ny - 312) + (nx - 256) * 0.93) < 14 && nx >= 362 && nx <= 422 && ny >= 256 && ny <= 312);

      if (inLeft1 || inLeft2 || inRight1 || inRight2) {
        r = 59; g = 130; b = 246; // #3b82f6
      }

      // Center silhouette: dinosaur / code mark
      const inDinoBody = (nx >= 200 && nx <= 320 && ny >= 230 && ny <= 340);
      const inDinoNeck = (nx >= 270 && nx <= 380 && ny >= 150 && ny <= 230);
      const inPlate1 = (nx >= 210 && nx <= 240 && ny >= 180 && ny <= 225 && (ny - 180) > Math.abs(nx - 225) * 2.5);
      const inPlate2 = (nx >= 255 && nx <= 285 && ny >= 175 && ny <= 225 && (ny - 175) > Math.abs(nx - 270) * 2.5);
      const inPlate3 = (nx >= 295 && nx <= 325 && ny >= 180 && ny <= 225 && (ny - 180) > Math.abs(nx - 310) * 2.5);

      if (inDinoBody || inDinoNeck || inPlate1 || inPlate2 || inPlate3) {
        r = 240; g = 240; b = 240; // Crisp light grey
      }

      // Eye
      const distEye = Math.hypot(nx - 365, ny - 165);
      if (distEye <= 6) {
        r = 59; g = 130; b = 246;
      }

      raw[px] = r;
      raw[px + 1] = g;
      raw[px + 2] = b;
      raw[px + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(raw);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

fs.writeFileSync(path.join(ICONS_DIR, 'icon-192.png'), renderIconPng(192));
console.log('Created icon-192.png');
fs.writeFileSync(path.join(ICONS_DIR, 'icon-512.png'), renderIconPng(512));
console.log('Created icon-512.png');
