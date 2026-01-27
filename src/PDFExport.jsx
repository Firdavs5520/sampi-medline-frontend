import jsPDF from "jspdf";

export default function PDFExport({ data }) {
  const download = () => {
    const pdf = new jsPDF();
    pdf.text("Sampi Medline — Kunlik hisobot", 10, 10);

    let y = 20;
    data.forEach((d) => {
      pdf.text(
        `Dori: ${d._id} | Miqdor: ${d.qty} | Summa: ${d.sum} UZS`,
        10,
        y,
      );
      y += 10;
    });

    pdf.save("hisobot.pdf");
  };

  return (
    <button
      onClick={download}
      className="mt-4 bg-primary text-white px-4 py-2 rounded"
    >
      📄 PDF yuklash
    </button>
  );
}
