import { chromium } from "playwright";

export async function GET(req) {
    let browser;

    try {
        const url = new URL(req.url);
        const origin = url.origin;

        browser = await chromium.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        });

        const page = await browser.newPage({
            viewport: { width: 1280, height: 1800 },
        });

        // ✅ PUBLIC PDF PAGE (NO AUTH)
        await page.goto(`${origin}/pdf/introduction`, {
            waitUntil: "networkidle",
            timeout: 60000,
        });

        // ✅ Ensure content exists
        await page.waitForSelector("#pdf-content", { timeout: 60000 });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true, // 🔑 MUST HAVE
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm",
            },
        });


        await browser.close();

        return new Response(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition":
                    'attachment; filename="UKAIDS-Income-System.pdf"',
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("PDF generation failed:", error);
        if (browser) await browser.close();
        return new Response("PDF generation error", { status: 500 });
    }
}
