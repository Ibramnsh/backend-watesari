const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');
const Admin = require('../models/Admin');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const username = process.env.SEED_ADMIN_USERNAME;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!uri) {
      console.error('Error: MONGODB_URI tidak ditemukan di .env');
      process.exit(1);
    }

    if (!username || !password) {
      console.error('Error: Wajib menentukan SEED_ADMIN_USERNAME dan SEED_ADMIN_PASSWORD di .env');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('MongoDB Terhubung untuk seeding...');

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`Admin dengan username "${username}" sudah ada.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await Admin.create({
      username,
      password: hashedPassword,
      role: 'superadmin'
    });

    console.log(`Berhasil membuat admin baru: "${username}" (role: superadmin)`);
    process.exit(0);
  } catch (error) {
    console.error('Gagal melakukan seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
