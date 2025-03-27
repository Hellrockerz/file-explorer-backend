const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createFolder, getFolders, updateFolder, deleteFolder, dashboard, markFavorites, getFavorites } = require("../controller/fileController");
const { verifyToken } = require("../auth/auth");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        let fileName = file.originalname;
        let counter = 1;
        while (fs.existsSync(path.join(__dirname, "../uploads", fileName))) {
            fileName = `${baseName}(${counter})${ext}`;
            counter++;
        }
        cb(null, fileName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post("/createFolder", verifyToken, upload.single("file"), createFolder);
router.get("/getFolders", verifyToken, getFolders);
router.put("/updateFolder/:id", verifyToken, updateFolder);
router.delete("/deleteFolder/:id", verifyToken, deleteFolder);
router.get("/dashboard", verifyToken, dashboard);
router.get("/getFavorites", verifyToken, getFavorites);
router.put("/markFavorites/:_id", verifyToken, markFavorites);

module.exports = router;