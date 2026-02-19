import nodemailer from 'nodemailer';

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.example.com",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: false,
            auth: {
                user: process.env.SMTP_USER || "user",
                pass: process.env.SMTP_PASS || "pass",
            },
        });
    }

    async sendAppointmentReminder(to: string, patientName: string, date: string, clinicName: string) {
        // In production, use templates. Here simple text.
        await this.transporter.sendMail({
            from: `"${clinicName}" <no-reply@jomimed.com>`,
            to,
            subject: `Appointment Reminder - ${clinicName}`,
            text: `Hello ${patientName}, this is a reminder for your appointment on ${date}.`,
            html: `<p>Hello <strong>${patientName}</strong>,</p><p>This is a reminder for your appointment on <strong>${date}</strong>.</p>`,
        });
    }

    async sendInvoice(to: string, patientName: string, link: string, clinicName: string) {
        await this.transporter.sendMail({
            from: `"${clinicName}" <billing@jomimed.com>`,
            to,
            subject: `Invoice Available - ${clinicName}`,
            text: `Hello ${patientName}, your invoice is ready. View it here: ${link}`,
        });
    }

    async sendConsultationSummary(to: string, patientName: string, doctorName: string, diagnosis: string, plan: string, clinicName: string) {
        await this.transporter.sendMail({
            from: `"${clinicName}" <care@jomimed.com>`,
            to,
            subject: `Consultation Summary - ${clinicName}`,
            text: `Hello ${patientName},\n\nHere is the summary of your visit with Dr. ${doctorName}.\n\nDIAGNOSIS:\n${diagnosis}\n\nTREATMENT PLAN:\n${plan}\n\nGet well soon,\n${clinicName}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Consultation Summary</h2>
                    <p>Hello <strong>${patientName}</strong>,</p>
                    <p>Here is the summary of your visit with <strong>Dr. ${doctorName}</strong>.</p>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #0d9488; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #0d9488;">Assessment / Diagnosis</h3>
                        <p>${diagnosis.replace(/\n/g, '<br>')}</p>
                    </div>

                    <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #3b82f6;">Treatment Plan</h3>
                        <p>${plan.replace(/\n/g, '<br>')}</p>
                    </div>

                    <p style="font-size: 12px; color: #666; margin-top: 30px;">
                        This is an automated message from <strong>${clinicName}</strong>. Please do not reply directly.
                    </p>
                </div>
            `
        });
    }
}
