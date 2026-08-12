/**
 * Middleware untuk membatasi akses berdasarkan role admin.
 * @param  {...string} allowedRoles - Daftar role yang diizinkan (e.g. 'superadmin', 'admin')
 */
module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin || !req.admin.role) {
      return res.status(401).json({ message: 'Akses ditolak. Silakan login terlebih dahulu.' });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Akses ditolak. Anda tidak memiliki izin untuk melakukan tindakan ini.' });
    }

    next();
  };
};
