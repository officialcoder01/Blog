const prisma = require('../lib/prisma');

// Create a new user
const createUser = async (userData) => {
    return await prisma.user.create({
        data: {
            username: userData.username,
            email: userData.email,
            password: userData.password,
        },
    });
};

// Get user by email
const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email },
    });
};

// Get user by ID
const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
};