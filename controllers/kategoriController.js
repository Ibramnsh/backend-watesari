const Kategori = require('../models/Kategori');

exports.getAllKategori = async (req, res) => {
  try {
    const kategori = await Kategori.find().sort({ createdAt: -1 });
    res.json(kategori);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createKategori = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Nama kategori wajib diisi" });
  
  try {
    const newKategori = new Kategori({ name });
    const savedKategori = await newKategori.save();
    res.status(201).json(savedKategori);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateKategori = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Nama kategori wajib diisi" });
    
    const updatedKategori = await Kategori.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedKategori) return res.status(404).json({ message: "Kategori tidak ditemukan" });
    res.json(updatedKategori);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findById(req.params.id);
    if (!kategori) return res.status(404).json({ message: "Kategori tidak ditemukan" });
    
    await Kategori.findByIdAndDelete(req.params.id);
    res.json({ message: "Kategori berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
