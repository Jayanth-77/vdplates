const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

function generatePlate1Svg() {
  // Detailed leaf with stem and curved striations
  function createMonsteraLeaf(cx, cy, scale, rotate, baseColor, highlightColor, veinColor) {
    let ribs = '';
    // Generate 18 pairs of curved veins radiating from central stem
    for (let i = 1; i <= 16; i++) {
      const t = i / 17;
      const y = -140 + t * 270;
      const spread = Math.sin(t * Math.PI) * 115;
      // Left rib
      ribs += `<path d="M 0 ${y} Q ${-spread * 0.5} ${y - 12} ${-spread} ${y + 8}" stroke="${veinColor}" stroke-width="1.8" fill="none" stroke-linecap="round" />\n`;
      // Left finer secondary striations
      ribs += `<path d="M ${-spread * 0.3} ${y - 4} Q ${-spread * 0.65} ${y - 14} ${-spread * 0.9} ${y + 2}" stroke="${veinColor}" stroke-width="0.9" opacity="0.65" fill="none" />\n`;
      // Right rib
      ribs += `<path d="M 0 ${y} Q ${spread * 0.5} ${y - 12} ${spread} ${y + 8}" stroke="${veinColor}" stroke-width="1.8" fill="none" stroke-linecap="round" />\n`;
      // Right finer secondary striations
      ribs += `<path d="M ${spread * 0.3} ${y - 4} Q ${spread * 0.65} ${y - 14} ${spread * 0.9} ${y + 2}" stroke="${veinColor}" stroke-width="0.9" opacity="0.65" fill="none" />\n`;
    }

    return `
    <g transform="translate(${cx}, ${cy}) rotate(${rotate}) scale(${scale})">
      <!-- Leaf blade base fill with subtle radial highlight -->
      <path d="M 0 -150 C -40 -150, -135 -90, -135 20 C -135 90, -70 140, 0 165 C 70 140, 135 90, 135 20 C 135 -90, 40 -150, 0 -150 Z" 
            fill="${baseColor}" stroke="${veinColor}" stroke-width="2.5" />
      <!-- Inner highlight glow -->
      <path d="M 0 -140 C -30 -140, -110 -80, -110 15 C -110 75, -50 120, 0 145 C 50 120, 110 75, 110 15 C 110 -80, 30 -140, 0 -140 Z" 
            fill="${highlightColor}" opacity="0.45" />
      <!-- Ribs -->
      ${ribs}
      <!-- Central stem vein -->
      <path d="M 0 -150 Q -2 0 0 165" stroke="${veinColor}" stroke-width="4.5" fill="none" stroke-linecap="round" />
      <path d="M 0 -145 Q -1 0 0 160" stroke="#a3e635" stroke-width="1.5" opacity="0.75" fill="none" />
    </g>`;
  }

  // Radiating paper crimp creases around 4 corners of the rim
  function generateCrimping() {
    let creases = '';
    const corners = [
      { cx: 255, cy: 255, startAngle: 180, endAngle: 270 },
      { cx: 769, cy: 255, startAngle: 270, endAngle: 360 },
      { cx: 769, cy: 769, startAngle: 0, endAngle: 90 },
      { cx: 255, cy: 769, startAngle: 90, endAngle: 180 }
    ];

    corners.forEach(c => {
      const count = 14;
      for (let i = 0; i <= count; i++) {
        const angleDeg = c.startAngle + (i / count) * (c.endAngle - c.startAngle);
        const rad = (angleDeg * Math.PI) / 180;
        const r1 = 125;
        const r2 = 175;
        const x1 = c.cx + Math.cos(rad) * r1;
        const y1 = c.cy + Math.sin(rad) * r1;
        const x2 = c.cx + Math.cos(rad) * r2;
        const y2 = c.cy + Math.sin(rad) * r2;
        creases += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#0a1a06" stroke-width="2.2" opacity="0.38" stroke-linecap="round"/>\n`;
        creases += `<line x1="${(x1 + 1).toFixed(1)}" y1="${(y1 + 1).toFixed(1)}" x2="${(x2 + 1).toFixed(1)}" y2="${(y2 + 1).toFixed(1)}" stroke="#ffffff" stroke-width="1.2" opacity="0.25" stroke-linecap="round"/>\n`;
      }
    });
    return creases;
  }

  return `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Deep black canvas backdrop -->
      <rect id="bg-fill" width="1024" height="1024" fill="#000000" />

      <!-- Outer plate drop shadow onto backdrop -->
      <filter id="plate-shadow-filter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="16" />
        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.9 0" />
        <feOffset dx="0" dy="4" />
        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
      </filter>

      <!-- Sloped rim 3D bevel / depression shading -->
      <radialGradient id="rim-bevel-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="68%" stop-color="#000000" stop-opacity="0" />
        <stop offset="78%" stop-color="#000000" stop-opacity="0.32" />
        <stop offset="85%" stop-color="#000000" stop-opacity="0.55" />
        <stop offset="96%" stop-color="#000000" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.18" />
      </radialGradient>

      <!-- Inner basin floor shadow -->
      <linearGradient id="inner-basin-shade" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.4" />
        <stop offset="12%" stop-color="#000000" stop-opacity="0.15" />
        <stop offset="88%" stop-color="#000000" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.45" />
      </linearGradient>

      <!-- Overall gloss lacquer reflection -->
      <linearGradient id="gloss-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
        <stop offset="35%" stop-color="#ffffff" stop-opacity="0.03" />
        <stop offset="65%" stop-color="#000000" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.12" />
      </linearGradient>

      <!-- Left vertical neon strip light reflection glare -->
      <linearGradient id="left-glare-linear" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="25%" stop-color="#ffffff" stop-opacity="0.4" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.95" />
        <stop offset="75%" stop-color="#ffffff" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>

      <!-- Clip path to cut strictly within outer plate profile -->
      <clipPath id="plate-outer-clip">
        <rect x="80" y="80" width="864" height="864" rx="175" ry="175" />
      </clipPath>
    </defs>

    <!-- 1. Pure Jet Black Backdrop -->
    <rect width="1024" height="1024" fill="#000000" />

    <!-- 2. Ambient Drop Shadow under outer rim -->
    <rect x="74" y="74" width="876" height="876" rx="180" ry="180" fill="#000000" filter="url(#plate-shadow-filter)" opacity="0.8" />

    <!-- 3. Outer Plate Rounded Square Tray with Lush Monstera Leaves -->
    <g clip-path="url(#plate-outer-clip)">
      <!-- Dark green base backing under leaves -->
      <rect x="80" y="80" width="864" height="864" fill="#13330b" />

      <!-- Layer 1: Background foliage leaves filling the perimeter -->
      ${createMonsteraLeaf(220, 200, 1.8, -25, '#5a9612', '#7fb824', '#153609')}
      ${createMonsteraLeaf(800, 210, 1.9, 32, '#6aa314', '#8ec42b', '#183b0a')}
      ${createMonsteraLeaf(190, 800, 1.85, 45, '#5c9612', '#7eb524', '#16380a')}
      ${createMonsteraLeaf(810, 810, 1.95, -38, '#639e13', '#87be27', '#173a0a')}
      ${createMonsteraLeaf(512, 160, 1.75, 12, '#6ca316', '#8ec429', '#193d0b')}
      ${createMonsteraLeaf(512, 860, 1.8, -8, '#589110', '#7bb021', '#143408')}
      ${createMonsteraLeaf(150, 512, 1.7, 78, '#619c13', '#85bc26', '#163909')}
      ${createMonsteraLeaf(870, 512, 1.75, -82, '#6aa314', '#8ec429', '#193d0a')}

      <!-- Layer 2: Prominent Mid-ground Leaves -->
      ${createMonsteraLeaf(340, 360, 2.15, -18, '#7bb81b', '#9fdc32', '#1b440d')}
      ${createMonsteraLeaf(700, 370, 2.1, 24, '#80bd1c', '#a4e235', '#1c460e')}
      ${createMonsteraLeaf(330, 670, 2.05, 30, '#79b519', '#9dd830', '#1a420c')}
      ${createMonsteraLeaf(690, 680, 2.2, -28, '#82bf1e', '#a7e538', '#1e480f')}

      <!-- Layer 3: Large Central Hero Leaf (matching real reference photo) -->
      ${createMonsteraLeaf(512, 512, 2.45, 14, '#8ed428', '#b5f448', '#215011')}
      <!-- Overlapping accent leaf blade across lower center -->
      ${createMonsteraLeaf(520, 720, 1.8, -12, '#88ce24', '#aee840', '#1f4c10')}

      <!-- 4. Crimping ridges around the 4 corners of the rim -->
      ${generateCrimping()}

      <!-- 5. Embossed Outer Rim Border line -->
      <rect x="80" y="80" width="864" height="864" rx="175" ry="175" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.32" />
      <rect x="83" y="83" width="858" height="858" rx="172" ry="172" fill="none" stroke="#000000" stroke-width="3" stroke-opacity="0.45" />

      <!-- 6. Sloped Rim 3D Bevel shading -->
      <rect x="80" y="80" width="864" height="864" rx="175" ry="175" fill="url(#rim-bevel-gradient)" />

      <!-- 7. Inner Basin Depression Crease (where floor meets rim slope) -->
      <rect x="188" y="188" width="648" height="648" rx="135" ry="135" fill="none" stroke="#000000" stroke-width="12" stroke-opacity="0.5" />
      <rect x="190" y="190" width="644" height="644" rx="133" ry="133" fill="none" stroke="#0d2607" stroke-width="5" stroke-opacity="0.6" />
      <rect x="192" y="192" width="640" height="640" rx="130" ry="130" fill="url(#inner-basin-shade)" />

      <!-- 8. REALISTIC VERTICAL SPECULAR GLARE REFLECTIONS (Studio Tube Lights) -->
      <!-- Left Glare Tube -->
      <!-- Core glow -->
      <path d="M 194 250 L 194 774" stroke="#ffffff" stroke-width="14" stroke-linecap="round" opacity="0.35" />
      <!-- Sharp core reflection -->
      <path d="M 194 250 L 194 774" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.95" />
      <!-- Curved corner glare continuation -->
      <path d="M 260 194 Q 194 194 194 250" stroke="#ffffff" stroke-width="4.5" fill="none" opacity="0.75" />
      <path d="M 194 774 Q 194 830 260 830" stroke="#ffffff" stroke-width="4.5" fill="none" opacity="0.75" />

      <!-- Right Glare Tube -->
      <!-- Core glow -->
      <path d="M 830 250 L 830 774" stroke="#ffffff" stroke-width="14" stroke-linecap="round" opacity="0.35" />
      <!-- Sharp core reflection -->
      <path d="M 830 250 L 830 774" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.95" />
      <!-- Curved corner glare continuation -->
      <path d="M 764 194 Q 830 194 830 250" stroke="#ffffff" stroke-width="4.5" fill="none" opacity="0.75" />
      <path d="M 830 774 Q 830 830 764 830" stroke="#ffffff" stroke-width="4.5" fill="none" opacity="0.75" />

      <!-- Top and Bottom subtle horizontal bevel highlights -->
      <path d="M 280 194 L 744 194" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.45" />
      <path d="M 280 830 L 744 830" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.35" />

      <!-- 9. Food-Grade High-Gloss Lamination Sheen across whole surface -->
      <rect x="80" y="80" width="864" height="864" rx="175" ry="175" fill="url(#gloss-sheen)" />
    </g>
  </svg>
  `;
}

const svg = generatePlate1Svg();
const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1024 } });
const pngBuffer = resvg.render().asPng();

// Write to public/product-images/product-01-green-leaf.png
const p1Path = path.join(__dirname, '..', 'public', 'product-images', 'product-01-green-leaf.png');
fs.writeFileSync(p1Path, pngBuffer);
console.log(`✓ Updated ${p1Path} (${pngBuffer.length} bytes)`);

// Also update public/product-01-green-leaf.png
const p1RootPath = path.join(__dirname, '..', 'public', 'product-01-green-leaf.png');
fs.writeFileSync(p1RootPath, pngBuffer);
console.log(`✓ Updated ${p1RootPath} (${pngBuffer.length} bytes)`);

// Also update dist/product-images/product-01-green-leaf.png if dist exists
const distP1Path = path.join(__dirname, '..', 'dist', 'product-images', 'product-01-green-leaf.png');
if (fs.existsSync(path.dirname(distP1Path))) {
  fs.writeFileSync(distP1Path, pngBuffer);
  console.log(`✓ Updated ${distP1Path}`);
}
const distRootPath = path.join(__dirname, '..', 'dist', 'product-01-green-leaf.png');
if (fs.existsSync(path.dirname(distRootPath))) {
  fs.writeFileSync(distRootPath, pngBuffer);
  console.log(`✓ Updated ${distRootPath}`);
}
