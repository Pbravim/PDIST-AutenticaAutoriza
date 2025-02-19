// main.ts
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

app.start(Number(process.env.PORT));
