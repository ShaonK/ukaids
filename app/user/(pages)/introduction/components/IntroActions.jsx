"use client";

export default function IntroActions() {
  const sharePage = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: "UKAIDS Introduction",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Page link copied!");
    }
  };

  const downloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("intro-pdf");
    if (!element) return;

    const opt = {
      margin: 0.3,
      filename: "UKAIDS-Introduction.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#121212", // ⬅ force HEX
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="px-4 mt-8 space-y-3">
      <button
        onClick={sharePage}
        className="w-full py-2 rounded-lg bg-[#3B82F6] font-semibold"
      >
        📤 Share This Page
      </button>

      <button
        onClick={downloadPDF}
        className="w-full py-2 rounded-lg bg-[#EC7B03] font-semibold"
      >
        📄 Download as PDF
      </button>
    </div>
  );
}
