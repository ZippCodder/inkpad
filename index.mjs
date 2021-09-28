import express from "express";
let app = express();
let env = process.env.NODE_ENV || "development";
import path from "path";
import util from "util";
let debuglog = util.debuglog("index");
import fs from "fs";
import ReactDOMServer from "react-dom/server.js";
import https from "https";
import http from "http";

let server = http.createServer(app);//https.createServer(app);

app.all("/",(req,res,next) => {
// For debug logging request details...
  console.log(req.path);
  debuglog(req.path);
  next();
});

app.get(/^\/$/,(req,res,next) => {
  res.type("text/html").sendFile(path.resolve("./dist/modern/index.html")); 
	console.log(req.query);
});

app.get(/^\/images/,(req,res,next) => {
	if (req.query.source === "1997836525634") {
 res.type("png").sendFile(path.resolve(`./public/images/${path.basename(req.path)}`));
	}
});

app.get("/service-worker.js",(req,res,next) => {
 res.type("text/javascript").sendFile(path.resolve("./service-worker.js"));
});

app.get("/manifest.webmanifest",(req,res,next) => {
	console.log("hey")
 res.type("json").sendFile(path.resolve("./manifest.webmanifest"));
});

app.get("/favicon.ico",(req,res,next) => {
 res.sendFile(path.resolve("./public/images/favicon_1.png"));
});

app.get(/.js$/,(req,res,next) => {
 res.type(path.extname(req.path)).sendFile(path.resolve(`./dist/modern/${path.basename(req.path)}`)); 
});

app.all("*",(req,res,next) => {
// Send 404 ...
   res.sendStatus(404);
});

server.listen(5000,() => {
console.log("\x1b[32m%s\x1b[0m",`Server is active in ${env} mode...`);
});
