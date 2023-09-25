import express from "express";
import { PORT } from "./config.js";
import {createTable} from "./db/db.js";
import indexRouter from "./routes/index.js";

const app = express();

const _PORT = PORT || 3000;

app.use('/', indexRouter);
createTable()
.then(()=>{
    app.listen(_PORT, () => {
        console.log(`Server is running on port ${_PORT}`);
      });
    })  
    .catch((err) => {
        console.error('Error creating tables and starting server:', err);
      });
      