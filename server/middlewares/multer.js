import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination: function(req, file , cb){
        const uploadDir = path.resolve("public");
        try {
            fs.mkdirSync(uploadDir, { recursive: true });
        } catch {}
        cb(null, uploadDir);
    },
    filename: function(req , file , cb){
        const filename = Date.now() + "-" + file.originalname;
        cb(null , filename)
    }
})


export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const isPdf =
            file.mimetype === "application/pdf" ||
            (typeof file.originalname === "string" && file.originalname.toLowerCase().endsWith(".pdf"));

        if (!isPdf) {
            return cb(new Error("Only PDF files are allowed"));
        }
        cb(null, true);
    },
});