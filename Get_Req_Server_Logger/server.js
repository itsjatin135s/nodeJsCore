const http = require("http");
const { EventEmitter } = require("events");

const readFile = (req) => {
  console.log(req.url);
  const fs = require("fs");
  const path = require("path");
  const location = path.join(
    __dirname,
    req.url === "/" ? "/index.html" : req.url
  );
  try {
    const fileData = fs.readFileSync(location, "utf-8");
    return { fileData, location: req.url };
  } catch (error) {
    const location = path.join(__dirname, "/404.html");
    const fileData = fs.readFileSync(location, "utf-8");
    return { fileData, location: "/404.html", notFound: true };
  }
};

const server = http.createServer();

// Listen to the request event
server.on("request", (request, res) => {
  const data = readFile(request);
  if (data.notFound) {
    // Set status to 302 and Location header to redirect the browser
    res.writeHead(302, { Location: "/404.html" });
  } else {
    // Serve the file normally with status 200
    res.writeHead(200, { "Content-Type": "text/html" });
  }
  res.end(data.fileData, "utf-8");
});

server.listen(8000);
