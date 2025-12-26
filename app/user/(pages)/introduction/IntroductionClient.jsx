"use client";

export default function IntroductionClient() {
  // 🔗 SHARE BUTTON
  async function handleShare() {
    const shareData = {
      title: "UKAIDS Income System",
      text: "Explore the UKAIDS Transparent & Structured Income Ecosystem",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Page link copied to clipboard");
      } catch {
        alert("Unable to copy link");
      }
    }
  }

  // 📄 DIRECT PDF DOWNLOAD (PLAYWRIGHT API)
  async function handleDownloadPDF() {
    try {
      const response = await fetch("/api/pdf/introduction", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("PDF API failed");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        throw new Error("Invalid PDF response");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "UKAIDS-Income-System.pdf";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error);
      alert("Failed to download PDF");
    }
  }

  return (
    <div className="flex gap-4 justify-center pt-6">
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="
          px-6 py-2 rounded-xl
          bg-white/10 border border-white/15
          backdrop-blur
          hover:bg-[#0F6F78]/20
          transition
        "
      >
        Share
      </button>

      {/* Download PDF Button */}
      <button
        onClick={handleDownloadPDF}
        className="
          px-6 py-2 rounded-xl
          bg-[#0F6F78]
          hover:bg-[#0F6F78]/90
          shadow-lg shadow-black/40
          transition
        "
      >
        Download PDF
      </button>
    </div>
  );
}
