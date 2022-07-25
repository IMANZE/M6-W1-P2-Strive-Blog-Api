import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./apis/authors/index.js";
import {badRequestHandler,unAuthorizedHandler,notFoundHandler,genericErrorHandler} from "./errorHandlers.js"
import blogRouter from "./apis/blogs/index.js";

const server = express();
const port = process.env.PORT || 3002;

// MIDDLEWARES
server.use(express.json());
// server.use(cors());


//ROUTES
server.use("/authors", authorsRouter)
server.use("/blogs", blogRouter)

//ERROR HANDLER
server.use( badRequestHandler)
server.use( unAuthorizedHandler)
server.use(notFoundHandler)
server.use( genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION_URL);

mongoose.connection.on("connected", () => {
  console.log("succesfully connected to mongoose");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`server is running on port ${port}`);
  });
});
server.on("error", (err)=>{
    console.log("MAIN ERROR", err);
})