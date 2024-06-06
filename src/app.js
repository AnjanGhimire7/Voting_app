import express from "express";
const app = express();

import cors from "cors";
import cookieParser from "cookie-parser";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//importing route
import userRouter from "./routers/user.route.js";
import candidateRouter from "./routers/candidate.route.js";

//declaring routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/candidates", candidateRouter);

export { app };
