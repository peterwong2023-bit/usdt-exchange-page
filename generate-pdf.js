const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // A4 size in pixels at 2x for high quality (210mm x 297mm)
  const A4_WIDTH = 794;  // 210mm at 96dpi
  const A4_HEIGHT = 1123; // 297mm at 96dpi
  const SCALE = 5; // 5x to exceed source image resolution

  await page.setViewport({
    width: A4_WIDTH,
    height: A4_HEIGHT,
    deviceScaleFactor: SCALE
  });

  // Navigate and wait for all images to fully load
  await page.goto('http://localhost:8765/theme-showcase.html', {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  // Extra wait to ensure all images are rendered
  await new Promise(r => setTimeout(r, 5000));

  // Get all page elements
  const pageCount = await page.$$eval('.page', pages => pages.length);
  console.log(`Found ${pageCount} pages`);

  const screenshots = [];

  for (let i = 0; i < pageCount; i++) {
    // Get the bounding box of each .page element
    const clip = await page.$$eval('.page', (pages, index) => {
      const el = pages[index];
      const rect = el.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      };
    }, i);

    console.log(`Capturing page ${i + 1}: ${clip.width}x${clip.height} at (${clip.x}, ${clip.y})`);

    // Take screenshot of this page element
    const screenshotBuffer = await page.screenshot({
      clip: {
        x: clip.x,
        y: clip.y,
        width: clip.width,
        height: clip.height
      },
      type: 'png'
    });

    screenshots.push(screenshotBuffer);
    console.log(`  Page ${i + 1} captured (${(screenshotBuffer.length / 1024).toFixed(0)} KB)`);
  }

  // Create PDF from screenshots
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < screenshots.length; i++) {
    const imgBytes = screenshots[i];
    const img = await pdfDoc.embedPng(imgBytes);

    // A4 size in PDF points (1 point = 1/72 inch)
    const A4_PT_WIDTH = 595.28;
    const A4_PT_HEIGHT = 841.89;

    const pdfPage = pdfDoc.addPage([A4_PT_WIDTH, A4_PT_HEIGHT]);

    // Scale image to fit A4 page
    const imgWidth = img.width;
    const imgHeight = img.height;
    const scaleX = A4_PT_WIDTH / imgWidth;
    const scaleY = A4_PT_HEIGHT / imgHeight;
    const scale = Math.min(scaleX, scaleY);

    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    // Center the image on the page
    const x = (A4_PT_WIDTH - drawWidth) / 2;
    const y = (A4_PT_HEIGHT - drawHeight) / 2;

    pdfPage.drawImage(img, {
      x: x,
      y: y,
      width: drawWidth,
      height: drawHeight,
    });

    console.log(`  Added page ${i + 1} to PDF`);
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('直播APP主题皮肤选择手册.pdf', pdfBytes);
  console.log(`\nPDF generated successfully! (${(pdfBytes.length / 1024 / 1024).toFixed(1)} MB)`);

  await browser.close();
})();
