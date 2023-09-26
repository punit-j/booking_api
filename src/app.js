import express from "express";
import { PORT } from "./config.js";
import {createTable} from "./db/db.js";
import indexRouter from "./routes/index.js";
import businessRouter from "./routes/business/businessRoutes.js";
import clientsRouter from "./routes/clients/clientsRoutes.js";
import commonRouter from "./routes/common/common.js";

const app = express();

const _PORT = PORT || 3000;

app.use('/', indexRouter);
app.use(clientsRouter);
app.use(commonRouter);
createTable()
    .then(()=>{
        app.listen(_PORT, () => {
            console.log(`Server is running on port ${_PORT}`);
        });
        })  
        .catch((err) => {
            console.error('Error creating tables and starting server:', err);
        }
    );
      