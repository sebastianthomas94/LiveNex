import express  from 'express';
import path  from "path"
import bodyParser  from "body-parser";
import dotenv from 'dotenv';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
import router  from "./routes/router.js"

const app = express();
app.use(bodyParser.json());

app.use('/',router)
app.listen(process.env.PORT, () =>
  console.log(`server started at ${process.env.PORT}`)
);