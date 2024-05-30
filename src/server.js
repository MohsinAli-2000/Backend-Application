import dotenv from "dotenv";
//dotenv configuration
dotenv.config({
  path: "../.env",
});

import connectDB from "./db/indexDB.js";
import app from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Error while connecting to mongoDB: `, error);
  });
