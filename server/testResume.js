import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function test() {
  try {
    const fileBuffer = await fs.promises.readFile('../Resume.pdf').catch(() => null);
    if (!fileBuffer) {
        console.log("No Resume.pdf found to test.");
        return;
    }
    const uint8Array = new Uint8Array(fileBuffer);
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    console.log("PDF parsed, pages:", pdf.numPages);
  } catch(e) {
    console.error("PDF Parse error:", e);
  }
}
test();
