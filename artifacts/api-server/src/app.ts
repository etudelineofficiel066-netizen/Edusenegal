import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";
import { sessionMiddleware } from "./middlewares/session.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

const isProd = process.env.NODE_ENV === "production";

app.use(cors({
  origin: isProd ? false : true,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware());

app.use("/api", router);

if (isProd) {
  const frontendDist = path.resolve(__dirname, "../../elearning/dist/public");
  app.use(express.static(frontendDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
