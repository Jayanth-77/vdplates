const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public');

// Common Plate Tray SVG template
function createPlateSvg({ patternDefs, plateFill, rimHighlight = '#ffffff' }) {
  return `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Black background backdrop -->
      <radialGradient id="stage-bg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#080808" />
        <stop offset="100%" stop-color="#000000" />
      </radialGradient>

      <!-- Soft drop shadow under the plate -->
      <radialGradient id="plate-shadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.9" />
        <stop offset="70%" stop-color="#000000" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>

      <!-- Sloped rim 3D bevel / depression shading -->
      <radialGradient id="rim-bevel" cx="50%" cy="50%" r="50%">
        <stop offset="55%" stop-color="#000000" stop-opacity="0" />
        <stop offset="78%" stop-color="#000000" stop-opacity="0.25" />
        <stop offset="88%" stop-color="#000000" stop-opacity="0.5" />
        <stop offset="97%" stop-color="#000000" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.15" />
      </radialGradient>

      <!-- Tray inner basin crease shadow -->
      <linearGradient id="basin-shadow-top" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </linearGradient>

      <!-- Laminated film gloss -->
      <linearGradient id="surface-glaze" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stop-color="${rimHighlight}" stop-opacity="0.22" />
        <stop offset="25%" stop-color="#ffffff" stop-opacity="0.08" />
        <stop offset="50%" stop-color="#000000" stop-opacity="0.05" />
        <stop offset="80%" stop-color="#ffffff" stop-opacity="0.04" />
        <stop offset="100%" stop-color="${rimHighlight}" stop-opacity="0.15" />
      </linearGradient>

      ${patternDefs}
    </defs>

    <!-- 1. Pure Jet Black Backdrop as required -->
    <rect width="1024" height="1024" fill="url(#stage-bg)" />

    <!-- 2. Ambient Drop Shadow -->
    <rect x="100" y="100" width="824" height="824" rx="140" fill="url(#plate-shadow)" />

    <!-- 3. Outer Plate Rounded Square Tray (11x11 buffet plate geometry) -->
    <rect x="112" y="112" width="800" height="800" rx="120" fill="${plateFill}" />

    <!-- 4. Sloped Rim 3D Bevel -->
    <rect x="112" y="112" width="800" height="800" rx="120" fill="url(#rim-bevel)" />

    <!-- 5. Embossed Outer Rim Edge Ridge -->
    <rect x="112" y="112" width="800" height="800" rx="120" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.3" />
    <rect x="116" y="116" width="792" height="792" rx="116" fill="none" stroke="#000000" stroke-width="3" stroke-opacity="0.4" />

    <!-- 6. Inner Basin Plate Depression -->
    <rect x="230" y="230" width="564" height="564" rx="80" fill="${plateFill}" />
    <rect x="230" y="230" width="564" height="564" rx="80" fill="url(#basin-shadow-top)" opacity="0.65" />
    <!-- Crease highlights -->
    <rect x="230" y="230" width="564" height="564" rx="80" fill="none" stroke="#000000" stroke-width="5" stroke-opacity="0.45" />
    <rect x="234" y="234" width="556" height="556" rx="77" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.35" />

    <!-- 7. Food-grade Laminated Gloss/Sheen -->
    <rect x="112" y="112" width="800" height="800" rx="120" fill="url(#surface-glaze)" />
  </svg>
  `;
}

// 1. product-01-green-leaf.png
const p1Svg = createPlateSvg({
  plateFill: 'url(#p1-monstera-pattern)',
  rimHighlight: '#bbf7d0',
  patternDefs: `
    <pattern id="p1-monstera-pattern" width="200" height="200" patternUnits="userSpaceOnUse">
      <rect width="200" height="200" fill="#1b4d24"/>
      <!-- Deep foliage layer -->
      <path d="M 30 20 C 10 40, 10 90, 40 120 C 70 150, 110 130, 100 80 C 90 40, 50 10, 30 20 Z" fill="#2d6a36" opacity="0.8"/>
      <path d="M 130 110 C 100 130, 100 180, 140 195 C 180 205, 200 160, 185 130 C 170 100, 150 90, 130 110 Z" fill="#2d6a36" opacity="0.8"/>

      <!-- Large vibrant green monstera leaf 1 -->
      <g transform="translate(40, 20)">
        <path d="M 60 5 C 25 -5, -5 35, 10 80 C 25 115, 60 145, 60 155 C 60 145, 95 115, 110 80 C 125 35, 95 -5, 60 5 Z" fill="#4ade80" stroke="#166534" stroke-width="3"/>
        <path d="M 60 10 L 60 145" stroke="#14532d" stroke-width="3.5"/>
        <!-- Slits & veins -->
        <path d="M 60 40 Q 30 25 18 35 M 60 40 Q 90 25 102 35" stroke="#14532d" stroke-width="2.5" fill="none"/>
        <path d="M 60 65 Q 25 55 14 70 M 60 65 Q 95 55 106 70" stroke="#14532d" stroke-width="2.5" fill="none"/>
        <path d="M 60 90 Q 35 85 24 105 M 60 90 Q 85 85 96 105" stroke="#14532d" stroke-width="2.5" fill="none"/>
        <path d="M 60 115 Q 45 110 38 128 M 60 115 Q 75 110 82 128" stroke="#14532d" stroke-width="2" fill="none"/>
      </g>

      <!-- Offset bright tropical leaf 2 -->
      <g transform="translate(140, 110)">
        <path d="M 30 0 C 5 10, -5 45, 15 70 C 35 90, 60 75, 55 45 C 50 20, 45 0, 30 0 Z" fill="#86efac" stroke="#15803d" stroke-width="2.5"/>
        <path d="M 30 5 L 30 75" stroke="#166534" stroke-width="2"/>
        <path d="M 30 25 Q 15 15 5 25 M 30 25 Q 45 15 52 25" stroke="#166534" stroke-width="1.8" fill="none"/>
        <path d="M 30 45 Q 18 38 10 48 M 30 45 Q 42 38 48 48" stroke="#166534" stroke-width="1.8" fill="none"/>
      </g>
      <!-- Small accent leaf -->
      <g transform="translate(-10, 140)">
        <path d="M 30 0 C 10 5, 0 35, 15 55 C 30 70, 50 60, 45 35 Z" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
        <path d="M 30 5 L 30 55" stroke="#14532d" stroke-width="2"/>
      </g>
    </pattern>
  `
});

// 2. product-02-banana-leaf-green.png
const p2Svg = createPlateSvg({
  plateFill: 'url(#p2-banana-leaf-bg)',
  rimHighlight: '#d9f99d',
  patternDefs: `
    <linearGradient id="p2-banana-leaf-bg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#14532d" />
      <stop offset="20%" stop-color="#166534" />
      <stop offset="47%" stop-color="#15803d" />
      <stop offset="50%" stop-color="#84cc16" />
      <stop offset="53%" stop-color="#15803d" />
      <stop offset="80%" stop-color="#166534" />
      <stop offset="100%" stop-color="#14532d" />
    </linearGradient>

    <!-- Banana Leaf fine parallel ribs pattern -->
    <pattern id="p2-banana-ribs" width="1024" height="28" patternUnits="userSpaceOnUse">
      <!-- Left side angled veins -->
      <line x1="100" y1="28" x2="512" y2="10" stroke="#4ade80" stroke-width="1.8" stroke-opacity="0.45" />
      <line x1="100" y1="20" x2="512" y2="2" stroke="#14532d" stroke-width="2" stroke-opacity="0.6" />
      <!-- Right side angled veins -->
      <line x1="512" y1="10" x2="924" y2="28" stroke="#4ade80" stroke-width="1.8" stroke-opacity="0.45" />
      <line x1="512" y1="2" x2="924" y2="20" stroke="#14532d" stroke-width="2" stroke-opacity="0.6" />
    </pattern>

    <pattern id="p2-combined" width="1024" height="1024" patternUnits="userSpaceOnUse">
      <rect width="1024" height="1024" fill="url(#p2-banana-leaf-bg)" />
      <rect width="1024" height="1024" fill="url(#p2-banana-ribs)" />
      <!-- Thick central stalk / rachis midrib -->
      <rect x="502" y="0" width="20" height="1024" fill="#a3e635" opacity="0.9" />
      <rect x="508" y="0" width="8" height="1024" fill="#d9f99d" opacity="0.8" />
      <line x1="500" y1="0" x2="500" y2="1024" stroke="#14532d" stroke-width="3" />
      <line x1="524" y1="0" x2="524" y2="1024" stroke="#14532d" stroke-width="3" />
    </pattern>
  `.replace('url(#p2-banana-leaf-bg)', 'url(#p2-combined)')
});

// 3. product-03-golden-orange.png
const p3Svg = createPlateSvg({
  plateFill: 'url(#p3-golden-pattern)',
  rimHighlight: '#fde68a',
  patternDefs: `
    <pattern id="p3-golden-pattern" width="180" height="180" patternUnits="userSpaceOnUse">
      <rect width="180" height="180" fill="#f59e0b"/>
      <!-- Amber/terracotta floral leaf motif -->
      <g transform="translate(90, 90)">
        <circle cx="0" cy="0" r="16" fill="#b45309" stroke="#78350f" stroke-width="2"/>
        <!-- Petal/Leaves spreading in 8 directions -->
        <path d="M 0 -16 C -15 -45, -25 -65, 0 -85 C 25 -65, 15 -45, 0 -16 Z" fill="#d97706" stroke="#92400e" stroke-width="2.5"/>
        <path d="M 0 16 C -15 45, -25 65, 0 85 C 25 65, 15 45, 0 16 Z" fill="#d97706" stroke="#92400e" stroke-width="2.5"/>
        <path d="M -16 0 C -45 -15, -65 -25, -85 0 C -65 25, -45 15, -16 0 Z" fill="#d97706" stroke="#92400e" stroke-width="2.5"/>
        <path d="M 16 0 C 45 -15, 65 -25, 85 0 C 65 25, 45 15, 16 0 Z" fill="#d97706" stroke="#92400e" stroke-width="2.5"/>

        <!-- Diagonal stitched leaf veins -->
        <path d="M -12 -12 C -35 -35, -55 -45, -65 -65 C -45 -55, -35 -35, -12 -12 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
        <path d="M 12 -12 C 35 -35, 55 -45, 65 -65 C 45 -55, 35 -35, 12 -12 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
        <path d="M -12 12 C -35 35, -55 45, -65 65 C -45 55, -35 35, -12 12 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
        <path d="M 12 12 C 35 35, 55 45, 65 65 C 45 55, 35 35, 12 12 Z" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>

        <!-- Intricate dashed inner stitches -->
        <path d="M 0 -22 L 0 -80 M 0 22 L 0 80 M -22 0 L -80 0 M 22 0 L 80 0" stroke="#fef3c7" stroke-width="2" stroke-dasharray="4,4"/>
      </g>
    </pattern>
  `
});

// 4. product-04-red-green-leaf.png
const p4Svg = createPlateSvg({
  plateFill: 'url(#p4-red-green-pattern)',
  rimHighlight: '#fecaca',
  patternDefs: `
    <pattern id="p4-red-green-pattern" width="190" height="190" patternUnits="userSpaceOnUse">
      <rect width="190" height="190" fill="#14532d"/>
      <!-- Crimson Red Botanical Leaf 1 -->
      <g transform="translate(45, 35) rotate(-25)">
        <path d="M 45 0 C 15 10, -5 45, 8 85 C 25 125, 75 120, 85 80 C 95 40, 75 0, 45 0 Z" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
        <path d="M 45 5 L 45 110" stroke="#7f1d1d" stroke-width="3"/>
        <!-- Veins -->
        <path d="M 45 35 Q 20 25 10 38 M 45 35 Q 70 25 80 38" stroke="#fecaca" stroke-width="1.8" fill="none"/>
        <path d="M 45 65 Q 22 55 12 70 M 45 65 Q 68 55 78 70" stroke="#fecaca" stroke-width="1.8" fill="none"/>
        <path d="M 45 90 Q 28 85 20 98 M 45 90 Q 62 85 70 98" stroke="#fecaca" stroke-width="1.8" fill="none"/>
      </g>

      <!-- Emerald Green Companion Leaf -->
      <g transform="translate(130, 115) rotate(35)">
        <path d="M 35 0 C 10 10, -5 40, 5 75 C 18 105, 58 100, 68 70 C 78 35, 60 0, 35 0 Z" fill="#16a34a" stroke="#14532d" stroke-width="2.5"/>
        <path d="M 35 5 L 35 95" stroke="#14532d" stroke-width="2.5"/>
        <path d="M 35 30 Q 15 20 8 32 M 35 30 Q 55 20 62 32" stroke="#bbf7d0" stroke-width="1.8" fill="none"/>
        <path d="M 35 55 Q 18 48 10 60 M 35 55 Q 52 48 60 60" stroke="#bbf7d0" stroke-width="1.8" fill="none"/>
      </g>

      <!-- Small Ruby Accent Leaf -->
      <g transform="translate(145, 15) rotate(15)">
        <path d="M 20 0 C 5 5, -2 25, 5 45 C 15 60, 35 55, 40 40 C 45 20, 35 0, 20 0 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
        <path d="M 20 5 L 20 48" stroke="#7f1d1d" stroke-width="1.8"/>
      </g>
    </pattern>
  `
});

// 5. product-05-orange-green-leaf.png
const p5Svg = createPlateSvg({
  plateFill: 'url(#p5-orange-green-pattern)',
  rimHighlight: '#fed7aa',
  patternDefs: `
    <pattern id="p5-orange-green-pattern" width="180" height="180" patternUnits="userSpaceOnUse">
      <rect width="180" height="180" fill="#fefce8"/>
      <!-- Soft Orange rounded foliage -->
      <g transform="translate(45, 40)">
        <path d="M 40 0 C 10 15, 0 50, 18 80 C 35 105, 75 100, 85 75 C 95 45, 70 0, 40 0 Z" fill="#f97316" stroke="#ea580c" stroke-width="2.5"/>
        <path d="M 40 5 L 40 95" stroke="#c2410c" stroke-width="2.5"/>
        <!-- Dotted leaf texture -->
        <circle cx="28" cy="40" r="3" fill="#ffedd5"/>
        <circle cx="52" cy="40" r="3" fill="#ffedd5"/>
        <circle cx="32" cy="65" r="3" fill="#ffedd5"/>
        <circle cx="48" cy="65" r="3" fill="#ffedd5"/>
      </g>

      <!-- Fresh Grassy Green rounded foliage -->
      <g transform="translate(125, 110)">
        <path d="M 35 0 C 10 12, 0 45, 15 70 C 30 95, 65 90, 75 68 C 85 40, 60 0, 35 0 Z" fill="#22c55e" stroke="#16a34a" stroke-width="2.5"/>
        <path d="M 35 5 L 35 85" stroke="#15803d" stroke-width="2"/>
        <circle cx="25" cy="35" r="2.5" fill="#dcfce7"/>
        <circle cx="45" cy="35" r="2.5" fill="#dcfce7"/>
        <circle cx="28" cy="55" r="2.5" fill="#dcfce7"/>
        <circle cx="42" cy="55" r="2.5" fill="#dcfce7"/>
      </g>

      <!-- Background leaf shadows -->
      <path d="M 140 30 C 120 40, 110 70, 125 90 C 140 105, 165 100, 170 85 Z" fill="#fdba74" opacity="0.6"/>
      <path d="M 10 130 C -5 140, -10 165, 5 180 C 20 190, 40 185, 45 170 Z" fill="#86efac" opacity="0.6"/>
    </pattern>
  `
});

// 6. product-06-yellow-leaf.png
const p6Svg = createPlateSvg({
  plateFill: 'url(#p6-yellow-pattern)',
  rimHighlight: '#fef08a',
  patternDefs: `
    <pattern id="p6-yellow-pattern" width="180" height="180" patternUnits="userSpaceOnUse">
      <rect width="180" height="180" fill="#facc15"/>
      <!-- Delicate deep green palm / botanical contour line drawings -->
      <g stroke="#15803d" stroke-width="2.5" fill="none">
        <!-- Main graceful leaf 1 -->
        <path d="M 20 160 Q 50 100 90 60 Q 130 20 165 15"/>
        <!-- Branching leaflets -->
        <path d="M 50 110 Q 30 90 25 75 Q 45 85 60 100"/>
        <path d="M 65 95 Q 50 70 50 50 Q 68 65 75 85"/>
        <path d="M 85 75 Q 75 45 80 30 Q 95 48 95 68"/>
        <path d="M 105 58 Q 100 30 110 18 Q 120 35 115 52"/>
        <path d="M 125 42 Q 125 20 140 10 Q 142 25 132 38"/>

        <!-- Opposite side leaflets -->
        <path d="M 60 115 Q 80 120 95 135 Q 75 125 65 105"/>
        <path d="M 80 95 Q 105 100 118 115 Q 98 105 85 85"/>
        <path d="M 100 75 Q 125 75 140 90 Q 120 80 105 68"/>
        <path d="M 120 58 Q 142 55 155 65 Q 138 60 122 50"/>
      </g>

      <!-- Second accent contour leaf -->
      <g stroke="#166534" stroke-width="2" fill="none" transform="translate(10, 20) scale(0.65)">
        <path d="M 160 160 Q 110 100 60 70 Q 20 40 10 10"/>
        <path d="M 110 110 Q 90 90 85 75 Q 105 85 120 100"/>
        <path d="M 90 90 Q 70 70 70 50 Q 88 65 95 85"/>
      </g>
    </pattern>
  `
});

// 7. product-07-sage-green-leaf.png
const p7Svg = createPlateSvg({
  plateFill: 'url(#p7-sage-pattern)',
  rimHighlight: '#d9f99d',
  patternDefs: `
    <pattern id="p7-sage-pattern" width="190" height="190" patternUnits="userSpaceOnUse">
      <rect width="190" height="190" fill="#143820"/>
      <!-- Soft Sage Green Rounded Leaf Lobes -->
      <g transform="translate(45, 45)">
        <path d="M 45 0 C 15 10, -5 45, 5 80 C 18 115, 68 115, 82 80 C 95 45, 75 10, 45 0 Z" fill="#65a30d" stroke="#365314" stroke-width="3"/>
        <path d="M 45 5 L 45 100" stroke="#365314" stroke-width="2.5"/>
        <!-- Running stitch embroidery white dashed outlines -->
        <path d="M 45 8 C 20 16, 5 48, 12 78 C 22 105, 62 105, 75 78 C 85 48, 70 16, 45 8 Z" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="5,4" opacity="0.9"/>
        <path d="M 45 15 L 45 95" stroke="#ffffff" stroke-width="2" stroke-dasharray="4,4" opacity="0.85"/>
      </g>

      <!-- Offset Sage Green Leaf 2 -->
      <g transform="translate(135, 125)">
        <path d="M 35 0 C 10 8, -5 35, 5 65 C 15 90, 55 90, 65 65 C 75 35, 60 8, 35 0 Z" fill="#84cc16" stroke="#365314" stroke-width="2.5"/>
        <path d="M 35 5 L 35 80" stroke="#365314" stroke-width="2"/>
        <path d="M 35 8 C 15 14, 2 38, 10 60 C 18 80, 50 80, 60 60 C 68 38, 55 14, 35 8 Z" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4,4" opacity="0.9"/>
      </g>

      <!-- Small olive bud -->
      <circle cx="20" cy="160" r="10" fill="#4d7c0f" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3,3"/>
      <circle cx="170" cy="30" r="8" fill="#4d7c0f" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3,3"/>
    </pattern>
  `
});

const items = [
  { name: 'product-01-green-leaf.png', svg: p1Svg },
  { name: 'product-02-banana-leaf-green.png', svg: p2Svg },
  { name: 'product-03-golden-orange.png', svg: p3Svg },
  { name: 'product-04-red-green-leaf.png', svg: p4Svg },
  { name: 'product-05-orange-green-leaf.png', svg: p5Svg },
  { name: 'product-06-yellow-leaf.png', svg: p6Svg },
  { name: 'product-07-sage-green-leaf.png', svg: p7Svg }
];

console.log('Generating 7 plate PNG images in public directory...');
for (const item of items) {
  const resvg = new Resvg(item.svg, { fitTo: { mode: 'width', value: 1024 } });
  const pngBuffer = resvg.render().asPng();
  const filePath = path.join(outDir, item.name);
  fs.writeFileSync(filePath, pngBuffer);
  console.log(`✓ Generated ${item.name} (${pngBuffer.length} bytes)`);
}
console.log('All 7 plate images successfully written to /public!');
