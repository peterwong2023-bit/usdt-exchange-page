const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Wide viewport to fit 297mm content
  const SCALE = 5;  // 5x to exceed source image resolution (898px)
  await page.setViewport({
    width: 1123,  // 297mm
    height: 2000, // tall enough for content
    deviceScaleFactor: SCALE
  });

  await page.goto('http://localhost:8765/theme-overview-single.html', {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 5000));

  const pageCount = await page.$$eval('.page', pages => pages.length);
  console.log(`Found ${pageCount} pages`);

  // Get actual size of first page to determine dimensions
  const firstClip = await page.$$eval('.page', pages => {
    const el = pages[0];
    const rect = el.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });
  console.log(`Page content size: ${firstClip.width} x ${firstClip.height} px`);

  const screenshots = [];

  for (let i = 0; i < pageCount; i++) {
    const clip = await page.$$eval('.page', (pages, index) => {
      const el = pages[index];
      const rect = el.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }, i);

    const buf = await page.screenshot({
      clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height },
      type: 'png'
    });

    screenshots.push(buf);
    console.log(`  Page ${i + 1}: ${(buf.length / 1024).toFixed(0)} KB (${clip.width}x${clip.height})`);
  }

  // Create PDF with custom page size matching content aspect ratio
  const pdfDoc = await PDFDocument.create();

  // Convert pixel dimensions to PDF points (72 dpi)
  // Content is rendered at 96 dpi, so: points = pixels * 72 / 96
  const pdfWidth = firstClip.width * 72 / 96;
  const pdfHeight = firstClip.height * 72 / 96;
  console.log(`PDF page size: ${pdfWidth.toFixed(1)} x ${pdfHeight.toFixed(1)} points`);

  for (let i = 0; i < screenshots.length; i++) {
    const img = await pdfDoc.embedPng(screenshots[i]);
    const pdfPage = pdfDoc.addPage([pdfWidth, pdfHeight]);

    // Fill the entire page with the image
    pdfPage.drawImage(img, {
      x: 0,
      y: 0,
      width: pdfWidth,
      height: pdfHeight
    });

    console.log(`  Added page ${i + 1} to PDF`);
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('直播APP五大主题总览.pdf', pdfBytes);
  console.log(`\nPDF: 直播APP五大主题总览.pdf (${(pdfBytes.length / 1024 / 1024).toFixed(1)} MB)`);

  await browser.close();
})();
