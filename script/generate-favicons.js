import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

(async () => {
  try {
    const root = path.resolve(process.cwd(), 'client', 'public');
    const svgPath = path.join(root, 'favicon.svg');
    if (!fs.existsSync(svgPath)) {
      console.error('No se encontró favicon.svg en client/public');
      process.exit(1);
    }

    const sizes = [16, 32, 180];
    const pngPaths = [];

    for (const s of sizes) {
      const out = path.join(root, `favicon-${s}.png`);
      await sharp(svgPath)
        .resize(s, s)
        .png({ compressionLevel: 9 })
        .toFile(out);
      console.log('Generado', out);
      pngPaths.push(out);
    }

    // Generate favicon.ico from 16 and 32
    const icoOut = path.join(root, 'favicon.ico');
    const icoBuffer = await pngToIco([pngPaths[0], pngPaths[1]]);
    fs.writeFileSync(icoOut, icoBuffer);
    console.log('Generado', icoOut);

    // Also generate apple-touch-icon using 180
    const apple = path.join(root, 'apple-touch-icon.png');
    await sharp(svgPath).resize(180, 180).png({ compressionLevel: 9 }).toFile(apple);
    console.log('Generado', apple);

    console.log('Favicons generados con éxito.');
  } catch (err) {
    console.error('Error generando favicons:', err);
    process.exit(1);
  }
})();