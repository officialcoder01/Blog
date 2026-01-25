const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'admin';

    // Validate environment variables
    if (!adminEmail || !adminPassword) {
        console.error('ADMIN_EMAIL or ADMIN_PASSWORD not set in environment. Aborting seed.');
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // If admin already exists, return it instead of creating a duplicate
    let existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existing) {
        console.log('Admin user already exists:', { id: existing.id, email: existing.email, role: existing.role });
        return existing;
    }

    // Create new admin user
    const created = await prisma.user.create({
        data: {
            username: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
        }
    });

    console.log('Created admin user:', { id: created.id, email: created.email, role: created.role });
    return created;
}

main()
    .then(() => {
        console.log('Admin user created successfully.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error creating admin user:', error);
        process.exit(1);
    });