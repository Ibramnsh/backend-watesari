const Berita = require('../models/Berita');

exports.getAllNews = async (req, res) => {
  try {
    const news = await Berita.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil berita' });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await Berita.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Berita tidak ditemukan' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil berita' });
  }
};

exports.createNews = async (req, res) => {
  try {
    const { title, content, author, kategori } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Gambar wajib diupload' });
    }

    const image = req.file.path;
    
    const newNews = await Berita.create({
      title,
      content,
      image,
      author: author || 'Admin',
      kategori: kategori || ''
    });
    
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat berita' });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { title, content, author, kategori } = req.body;
    let news = await Berita.findById(req.params.id);
    
    if (!news) return res.status(404).json({ message: 'Berita tidak ditemukan' });

    let image = news.image;
    if (req.file) {
      image = req.file.path;
    }

    news = await Berita.findByIdAndUpdate(
      req.params.id,
      { title, content, image, author, kategori: kategori || news.kategori },
      { new: true }
    );
    
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui berita' });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const news = await Berita.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Berita tidak ditemukan' });

    await Berita.findByIdAndDelete(req.params.id);
    res.json({ message: 'Berita berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus berita' });
  }
};
