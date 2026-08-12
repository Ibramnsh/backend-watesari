const Berita = require('../models/Berita');
const Produk = require('../models/Produk');
const Contact = require('../models/Contact');

exports.getStats = async (req, res) => {
  try {
    const beritaCount = await Berita.countDocuments();
    const produkCount = await Produk.countDocuments();
    const contactCount = await Contact.countDocuments();
    
    res.json({
      berita: beritaCount,
      produk: produkCount,
      news: beritaCount,
      products: produkCount,
      contacts: contactCount
    });
  } catch (error) {
    console.error('Gagal mengambil statistik:', error.message);
    res.status(500).json({ message: 'Gagal mengambil statistik' });
  }
};
