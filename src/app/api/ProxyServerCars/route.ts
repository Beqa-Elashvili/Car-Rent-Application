import express from "express";
import axios from "axios";
import NodeCache from "node-cache";
import next from "next";
import { parse } from "url";

const cache = new NodeCache({ stdTTL: 300 });
const API_URL = "/api/cars";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("/api/cars", async (req: any, res: any) => {
    const cachedData = cache.get("cars");

    if (cachedData) {
      console.log("Serving from cache");
      return res.json(cachedData);
    }

    try {
      const response = await axios.get(API_URL);
      cache.set("cars", response.data);
      console.log("Serving from API and caching data");
      return res.json(response.data);
    } catch (error) {
      console.error("Error fetching data from API:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });

  server.all("*", (req, res) => {
    const parsedUrl = parse(req.url, true);
    return handle(req, res, parsedUrl);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err?: Error) => {
    if (err) {
      console.error("Error starting server:", err);
      throw err;
    }
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
