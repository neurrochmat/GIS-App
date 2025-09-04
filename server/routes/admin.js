const router = require('express').Router();
const Wisata = require('../model/wisata');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');

// Middleware untuk memverifikasi admin
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

// Setup multer untuk upload file
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

// Get dashboard stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const totalWisata = await Wisata.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Get recent activities (last 10)
    const recentWisata = await Wisata.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name createdAt createdBy');

    const recentActivities = recentWisata.map(wisata => ({
      timestamp: wisata.createdAt,
      description: `Wisata baru ditambahkan: ${wisata.name}`
    }));

    res.json({
      totalWisata,
      totalUsers,
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.patch('/users/:userId/role', verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ban user
router.patch('/users/:userId/ban', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBanned: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unban user
router.patch('/users/:userId/unban', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBanned: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk upload wisata data
router.post('/bulk-upload', verifyAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    const results = [];
    const filePath = req.file.path;

    if (req.file.mimetype === 'text/csv') {
      // Handle CSV file
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          await processUploadedData(results, req.user.id);
          fs.unlinkSync(filePath);
          res.json({ message: `${results.length} data wisata berhasil diupload` });
        });
    } else {
      // Handle Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      await processUploadedData(data, req.user.id);
      fs.unlinkSync(filePath);
      res.json({ message: `${data.length} data wisata berhasil diupload` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function processUploadedData(data, userId) {
  const processedData = data.map(item => ({
    ...item,
    createdBy: userId,
    jamOperasional: item.jamOperasional ? JSON.parse(item.jamOperasional) : undefined,
    hargaTiket: item.hargaTiket ? JSON.parse(item.hargaTiket) : undefined,
    fasilitas: item.fasilitas ? item.fasilitas.split(',').map(f => f.trim()) : undefined
  }));

  await Wisata.insertMany(processedData);
}

module.exports = router;
