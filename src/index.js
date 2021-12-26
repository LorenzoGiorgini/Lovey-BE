import express from 'express';
import cors from "cors"
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 3030;

//Middlewares
app.use(express.json());
app.use(cors());


//Routes




//Error handlers



mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected')
    app.listen(port, () => {
        constole.table(expressListEndpoints(app))
        console.log("server on port" + port)
    })
})