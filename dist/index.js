import express from 'express';
import multer from 'multer';
import path from 'path';
import { initDB } from './db.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
const storage = multer.diskStorage({
    destination: join(__dirname, "uploads"),
    filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname)
});
const upload = multer({ storage });
initDB((db) => {
    app.get("/", (req, res) => {
        db.all(`
                select * from posts order by created_at desc
            `, (err, ps) => {
            if (err)
                return res.status(500).send("Database error");
            let html = `
                <h1>
                    Mini Imageboard
                </h1>
        
                <form action="/" method="post" enctype="multipart/form-data">
                    Name: <input name="name"><br>
                    Message: <input name="message"><br>
                    Image: <input  type="file" name="image"><br>
                    <button type="submit">Post</button>
                    
        
                </form>
                <hr/>
            `;
            ps.forEach(row => {
                html += `
                    <div style="border:1px solid #ccc;padding:10px;margin:10px">
                        <strong>${row.name}</strong><br>
                        ${row.message.replace(/\n/g, "<br>")}<br>
                        ${row.image ? `<img src="/uploads/${row.image}" width="200"><br>` : ""}
                        <small>${row.created_at}</small>
                    </div>
                
                `;
            });
            res.status(200).send(html);
        });
    });
    app.post("/", upload.single("image"), (req, res) => {
        const name = req.body.name || "Anonymous";
        const message = req.body.message;
        const image = req.file ? req.file.filename : "";
        db.run(`
            insert into posts (name,message,image) values (?,?,?)
            `, [name, message, image], (err) => {
            if (err)
                return res.status(500);
            res.redirect('/');
        });
    });
});
app.listen(PORT, () => console.log('server running at ' + PORT));
//# sourceMappingURL=index.js.map