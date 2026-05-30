
require('module-alias/register');
require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const config = require('@config/index');
const routes = require('@routes/index');
const Health = require('@src/Health');

const app = express();

app.use(express.json());

// ==========================================
// จุดที่ 1: หน้าล็อกอิน (Authen)
// ==========================================
app.post('/live/player/authen', async (req, res) => {
    try {
        // >>> เอาโค้ดค้นหาไอดี/รหัสผ่าน ใน MongoDB ของน้องมาใส่ตรงนี้ <<<
        // เช่น const user = await User.findOne({ ... });
        
        res.json({ "status": 200, "message": "success" }); // ถ้าสำเร็จส่งอันนี้
    } catch (error) {
        console.error("🔴 MongoDB หน้า Authen มีปัญหา:", error);
        res.json({ "status": 400, "message": "fail" }); // ถ้าพังส่งอันนี้แทน เซิร์ฟเวอร์ไม่ดับ
    }
});

// ==========================================
// จุดที่ 2: หน้าสล็อตตัวละคร (Characterslot)
// ==========================================
app.all('/live/item/listall', async (req, res) => {
    try {
        // >>> เอาโค้ดดึงข้อมูลตัวละคร/สกิน จาก MongoDB มาใส่ตรงนี้ <<<
        
        res.json({ "status": 200, "data": { "slots": [] } });
    } catch (error) {
        console.error("🔴 MongoDB หน้า Characterslot มีปัญหา:", error);
        // เกมพยายามดึงข้อมูลตัวละครแล้วหาไม่เจอ ให้ส่ง Array ว่าง [] กลับไปหลอกเกม
        res.json({ "status": 200, "data": { "slots": [] } }); 
    }
});

// ==========================================
// จุดที่ 3: หน้าร้านค้า (Store List)
// ==========================================
app.all('/live/store/list', async (req, res) => {
    try {
        // >>> เอาโค้ดดึงไอเทมร้านค้า จาก MongoDB มาใส่ตรงนี้ <<<
        
        res.json([]);
    } catch (error) {
        console.error("🔴 MongoDB หน้าร้านค้ามีปัญหา:", error);
        res.json([]); // ถ้าพัง ส่งตระกร้าเปล่ากลับไป เกมจะได้ไม่ขึ้น 502
    }
});

app.all('/live/player/characterslot/edit', async (req, res) => {
    try {
        // >>> เอาโค้ดดึงไอเทมร้านค้า จาก MongoDB มาใส่ตรงนี้ <<<
        
        res.json([]);
    } catch (error) {
        console.error("🔴 MongoDB หน้าร้านค้ามีปัญหา:", error);
        res.json([]); // ถ้าพัง ส่งตระกร้าเปล่ากลับไป เกมจะได้ไม่ขึ้น 502
    }
});

// สตาร์ทเซิร์ฟเวอร์ปกติ
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use('/', routes);
app.use('/', Health);

async function start() {
  try {
    await mongoose.mongoose.connect(config.mongo.uri, {
      dbName: config.mongo.dbName,
    });
    console.log(`MongoDB connected to: ${config.mongo.dbName}`);

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.env}`);
    });
  } catch (err) {
    console.error('Startup error:', err.message);
    process.exit(1);
  }
}

async function shutdown() {
  try {
    await mongoose.connection.close();
    console.log('Shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err.message);
    process.exit(1);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
