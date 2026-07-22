const Berita = require('../models/Berita');
const Produk = require('../models/Produk');

exports.getStats = async (req, res) => {
  try {
    const beritaCount = await Berita.countDocuments();
    const produkCount = await Produk.countDocuments({ isActive: true });
    
    res.json({
      berita: beritaCount,
      produk: produkCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil statistik' });
  }
};
