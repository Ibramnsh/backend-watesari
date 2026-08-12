const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Pre-generated valid bcrypt hash untuk memitigasi timing attack saat username tidak ditemukan
const DUMMY_HASH = '$2b$10$e7v12.x11.Z9999999999uJ99999999999999999999999999999';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Sanitasi Tipe Data Input (Mencegah NoSQL Object Injection - Poin 5)
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Username dan password harus berupa teks valid' });
    }

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    // Pastikan JWT_SECRET terkonfigurasi (Hapus fallback hardcoded - Poin 1)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('CRITICAL: JWT_SECRET belum dikonfigurasi pada environment variables!');
      return res.status(500).json({ message: 'Terjadi kesalahan konfigurasi pada server' });
    }

    const admin = await Admin.findOne({ username: trimmedUsername });

    // Mitigasi Timing Attack & Username Enumeration (Poin 4)
    if (!admin) {
      await bcrypt.compare(password, DUMMY_HASH);
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Penandatanganan JWT dengan opsi keamanan iss/aud/expiresIn (Poin 10)
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      jwtSecret,
      { 
        expiresIn: '8h',
        issuer: 'watesari-api',
        audience: 'watesari-admin'
      }
    );

    // Set HttpOnly Cookie untuk opsi keamanan (Poin 7)
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 3600 * 1000 // 8 jam
    });

    res.json({ 
      token, 
      username: admin.username, 
      role: admin.role 
    });
  } catch (error) {
    console.error('Error saat login:', error.message);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Logout berhasil' });
};

exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Data admin tidak ditemukan' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil profil admin' });
  }
};
