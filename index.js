const formidable = require("formidable");
const fs = require("fs/promises");
const path = require("path");
const http = require("http");

const port = 3001;
const filePath = path.join(__dirname, "./text.json");
http
  .createServer(async (req, res) => {
    if (req.url === "/") {
      res.end("hello World");
    }

    if (req.url === "/home" && req.method.toLowerCase() === "post") {
      const data = await fs.readFile(filePath, "utf-8");
      const formateData = JSON.parse(data);
      const form = formidable({ multiples: true });

      form.parse(req, async (error, fields, files) => {
        const newUser = {
          name: fields.name,
          age: fields.age,
        };
        formateData.push(newUser);
        await fs.writeFile(filePath, JSON.stringify(formateData), "utf-8");
        res.end(
          `hello, ${fields.name} your age is ${fields.age},  ${JSON.stringify(
            formateData
          )}`
        );
      });
    }
    if (req.url === "/home/contacts") {
      res.end("contacts page");
    }

    if (req.url === "/api/upload" && req.method.toLowerCase() === "post") {
      // parse a file upload
      const form = formidable({ multiples: true });

      form.parse(req, (err, fields, files) => {
        if (err) {
          res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
          res.end(String(err));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ fields, files }, null, 2));
      });

      return;
    }
  })
  .listen(port, () => console.log(`port ${port}`));
