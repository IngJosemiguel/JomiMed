import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PrescriptionData {
    clinicName: string;
    doctorName: string;
    patientName: string;
    date: string;
    items: string[];
    instructions?: string;
}

export const generatePrescriptionPDF = (data: PrescriptionData) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text(data.clinicName, 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Dr. ${data.doctorName}`, 105, 28, { align: 'center' });
    doc.text(`Date: ${data.date}`, 105, 33, { align: 'center' });

    // Patient Info
    doc.setFontSize(12);
    doc.text(`Patient: ${data.patientName}`, 20, 50);

    // Content
    doc.line(20, 55, 190, 55);
    doc.setFontSize(16);
    doc.text("PRESCRIPTION", 105, 65, { align: 'center' });

    const tableBody = data.items.map(item => [item]);

    autoTable(doc, {
        startY: 70,
        head: [['Medication / Treatment']],
        body: tableBody,
        theme: 'grid',
        styles: { fontSize: 12, cellPadding: 3 },
    });

    // Instructions
    if (data.instructions) {
        const finalY = (doc as any).lastAutoTable.finalY || 70;
        doc.setFontSize(12);
        doc.text("Instructions:", 20, finalY + 15);
        doc.setFontSize(10);
        doc.text(data.instructions, 20, finalY + 22, { maxWidth: 170 });
    }

    // Footer / Signature
    doc.line(120, 250, 190, 250);
    doc.setFontSize(10);
    doc.text("Signature", 155, 255, { align: 'center' });

    doc.save(`Prescription_${data.patientName.replace(/\s+/g, '_')}.pdf`);
};
