const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Usage: node scripts/backup.js

const backupDir = path.join(__dirname, '../backups');

if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = `backup-${timestamp}.sql`;
const filepath = path.join(backupDir, filename);

// NOTE: This assumes 'pg_dump' is available in the environment path or uses Prisma's internal capabilities if possible
// For Neon/Postgres, pg_dump is standard. 
// However, since we might not have pg_dump installed on the host, we can simulate a JSON dump via Prima.

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backup() {
    console.log(`Starting backup to ${filepath}...`);

    // Simple JSON dump for portability + Node.js environment
    // For Production: Use real pg_dump via exec()

    const data = {
        users: await prisma.user.findMany(),
        clinics: await prisma.clinic.findMany(),
        patients: await prisma.patient.findMany(),
        appointments: await prisma.appointment.findMany(),
        medicalRecords: await prisma.medicalRecord.findMany(),
        roles: await prisma.role.findMany(),
    };

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log('Backup completed successfully.');
}

backup()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
