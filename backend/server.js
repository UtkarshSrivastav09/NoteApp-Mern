import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import routes from './routes/auth.js';
import router from "./routes/note.js"
dotenv.config({ path: './backend/.env' });
import path from 'path';

dotenv.config();




const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json())

app.use("/api/users", routes);
app.use("/api/notes", router);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}



connectDB();


app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
