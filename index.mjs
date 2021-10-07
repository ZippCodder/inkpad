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
app.set("views","./public");
app.set("view engine","pug");

app.all("*",(req,res,next) => {
// For debug logging request details...
  console.log(req.path);
  next();
});

app.get(/^\/$/,(req,res,next) => {
  res.render(`index.${env}.pug`,{title: "Inkpad",script: fs.readFileSync("./dist/modern/home.bundle.modern.js","utf-8") ,polyfill: fs.readFileSync("./dist/modern/polyfill.bundle.modern.js","utf-8")}); 
});

app.get(/^\/images/,(req,res,next) => {
 res.type("png").sendFile(path.resolve(`./public/images/${path.basename(req.path)}`));
});

app.get("/service-worker.js",(req,res,next) => {
 res.type("text/javascript").sendFile(path.resolve("./service-worker.js"));
});

app.get("/manifest.webmanifest",(req,res,next) => {
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
