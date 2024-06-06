import connectDB from "./database/db.js";
import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 6000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`app is listenting on port :${PORT}`);
    });
  })
  .catch((error) => {
    console.log("mogodb connection failed!!", error);
  });
