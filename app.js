const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const { apiLimiter } = require('./middleware/rateLimiter');

dotenv.config();

const app = express();

// Set trust proxy (wajib di Vercel / Reverse Proxy agar rate-limiter & IP client valid)
app.set('trust proxy', 1);

// Security Headers dengan Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // agar file static uploads/images bisa dibuka
}));

// Konfigurasi CORS Terbatas & Aman (Poin 6)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Izinkan request tanpa origin atau dalam mode dev / localhost / origin terdaftar
    if (
      !origin ||
      process.env.NODE_ENV !== 'production' ||
      allowedOrigins.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Akses dibatasi oleh kebijakan CORS'));
    }
  },
  credentials: true, // mengizinkan cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Cookie Parser
app.use(cookieParser());

// Body Parser dengan batasan ukuran payload
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitasi Input terhadap NoSQL Injection (Express 5 Compatible - Poin 5)
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});

// Global Rate Limiter untuk seluruh /api
app.use('/api', apiLimiter);

// Folder Statis untuk Uploads (Local fallback)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/kategori', require('./routes/kategoriRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Centralized Error Handler (tanpa membocorkan stack trace sensitif di produksi)
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.message);
  res.status(err.status || 500).json({ 
    message: err.message || 'Terjadi kesalahan internal pada server' 
  });
});

module.exports = app;
