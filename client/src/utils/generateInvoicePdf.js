import jsPDF from 'jspdf';

export const downloadInvoicePDF = ({ filename, title, meta = [], lines = [], totals = [], footerNote }) => {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text('ExpiryMart', 14, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(title, 14, y);
  y += 10;

  doc.setFontSize(10);
  meta.forEach((line) => {
    doc.text(line, 14, y);
    y += 6;
  });
  y += 4;

  doc.setLineWidth(0.2);
  doc.line(14, y, 196, y);
  y += 8;

  doc.setFontSize(11);
  lines.forEach(({ label, value }) => {
    doc.text(label, 14, y);
    doc.text(value, 196, y, { align: 'right' });
    y += 7;
  });

  y += 4;
  doc.line(14, y, 196, y);
  y += 8;

  totals.forEach(({ label, value, bold }) => {
    doc.setFontSize(12);
    doc.setFont(undefined, bold ? 'bold' : 'normal');
    doc.text(label, 14, y);
    doc.text(value, 196, y, { align: 'right' });
    y += 8;
  });
  doc.setFont(undefined, 'normal');

  if (footerNote) {
    y += 10;
    doc.setFontSize(9);
    doc.setTextColor(130);
    doc.text(footerNote, 14, y, { maxWidth: 182 });
  }

  doc.save(filename);
};