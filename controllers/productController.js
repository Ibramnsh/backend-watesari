const Produk = require('../models/Produk');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    let query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const products = await Produk.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Produk.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, whatsapp, isActive } = req.body;
    
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    } else {
      return res.status(400).json({ message: 'Minimal satu gambar wajib diupload' });
    }
    
    const newProduct = await Produk.create({
      name,
      price: price || 0,
      description,
      category,
      whatsapp,
      images,
      isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true
    });
    
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat produk' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, whatsapp, isActive, removeImages } = req.body;
    let product = await Produk.findById(req.params.id);
    
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    let images = [...product.images];

    // Handle removing old images
    if (removeImages) {
      const imagesToRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
      imagesToRemove.forEach(img => {
        const index = images.indexOf(img);
        if (index > -1) {
          images.splice(index, 1);
        }
      });
    }

    // Handle new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      images = [...images, ...newImages];
    }

    product = await Produk.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        price: price || 0, 
        description, 
        category, 
        whatsapp, 
        images,
        isActive: isActive !== undefined ? isActive === 'true' || isActive === true : product.isActive
      },
      { new: true }
    );
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui produk' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Produk.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    await Produk.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus produk' });
  }
};
