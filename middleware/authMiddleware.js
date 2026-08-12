const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('CRITICAL: JWT_SECRET belum dikonfigurasi!');
    return res.status(500).json({ message: 'Terjadi kesalahan konfigurasi server' });
  }

  let token = null;

  // 1. Cek dari Cookie (HttpOnly)
  if (req.cookies && req.cookies.adminToken) {
    token = req.cookies.adminToken;
  } 
  // 2. Fallback: Cek dari Header Authorization Bearer
  else if (req.header('Authorization')) {
    const authHeader = req.header('Authorization');
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token autentikasi tidak ditemukan.' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret, {
      issuer: 'watesari-api',
      audience: 'watesari-admin'
    });
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau telah kedaluwarsa' });
  }
};
