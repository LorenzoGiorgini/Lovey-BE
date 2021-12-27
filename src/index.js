import express from "express";
import cors from "cors";
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import passport from "passport";
import cookieParser from "cookie-parser";

//google oauth20
import googleStrategy from "./auth/google/googleStrategy.js";

import {
  badRequestHandler,
  unauthorizedHandler,
  forbiddenHandler,
  notFoundHandler,
  catchAllHandler,
} from "./errorHandlers/index.js";
import UsersRouter from "./routes/users/users.js";

const app = express();
const port = process.env.PORT || 3030;

//Middlewares
passport.use("google", googleStrategy);

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

//Routes
app.use("/users", UsersRouter);

//Error handlers
app.use(badRequestHandler);
app.use(unauthorizedHandler);
app.use(forbiddenHandler);
app.use(notFoundHandler);
app.use(catchAllHandler);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
  app.listen(port, () => {
    console.table(expressListEndpoints(app));
    console.log("app on port " + port);
  });
});