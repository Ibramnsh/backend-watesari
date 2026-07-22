const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    const newContact = await Contact.create({
      name,
      email,
      message
    });
    
    res.status(201).json({ message: 'Pesan berhasil dikirim', data: newContact });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengirim pesan' });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pesan' });
  }
};
