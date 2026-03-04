const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'index.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.addStyleTag({ content: '.toolbar { display: none !important; }' });

  const outputPath = path.resolve(__dirname, '链上合规风控策略咨询报告.pdf');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    margin: { top: '24mm', right: '22mm', bottom: '28mm', left: '22mm' },
    printBackground: true,
    preferCSSPageSize: false,
  });

  console.log(`PDF generated: ${outputPath}`);
  await browser.close();
})();
