import { create, insert } from "@lyrasearch/lyra";
import { persistToFile } from "@lyrasearch/plugin-data-persistence";
import type { Video } from "../lib/types";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const websiteId: string = process.env.WEBSITE_ID!;

const response = await fetch(
  `http://localhost:3000/api/getAllVideos?websiteId=${websiteId}`
);

const videos: Video[] = await response.json();

const db = await create({
  schema: {
    title: "string",
    id: "string",
    thumbnail: "string",
    categories: "string",
    tags: "string",
  },
});

for (const video of videos) {
  await insert(db, {
    title: video.title,
    id: video.id,
    thumbnail: video.thumbnail,
    categories: video.categories,
    tags: video.tags,
  });
}

const filePath = await persistToFile(db, "json", "./dev-data/db.js");

// const dbData = fs.readFileSync(filePath, "utf8");

// fs.writeFileSync(filePath, "export default " + dbData, "utf8");

console.log(`Lyra db generated at ${filePath}\n`);
