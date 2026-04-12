/**
 * Fetches background video clips from Pexels for use as reel backgrounds.
 * Usage: npx tsx src/fetch-videos.ts "artificial intelligence" 5
 *
 * Set PEXELS_API_KEY env var or create .env file.
 */
import fs from "fs";
import path from "path";
import https from "https";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";

interface PexelsVideo {
  id: number;
  url: string;
  video_files: {
    id: number;
    quality: string;
    width: number;
    height: number;
    link: string;
  }[];
}

async function searchVideos(
  query: string,
  count: number = 5
): Promise<PexelsVideo[]> {
  if (!PEXELS_API_KEY) {
    console.error("Error: Set PEXELS_API_KEY environment variable.");
    console.error("Get a free key at https://www.pexels.com/api/");
    process.exit(1);
  }

  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=portrait&size=medium`;

  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { Authorization: PEXELS_API_KEY } },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          const json = JSON.parse(data);
          resolve(json.videos || []);
        });
      }
    );
    req.on("error", reject);
  });
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      // Follow redirects
      if (res.statusCode === 302 || res.statusCode === 301) {
        https.get(res.headers.location!, (res2) => {
          res2.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
        });
        return;
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", reject);
  });
}

async function main() {
  const query = process.argv[2] || "artificial intelligence technology";
  const count = parseInt(process.argv[3] || "5");
  const outDir = path.resolve("public/videos");

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`Searching Pexels for "${query}" (${count} videos)...`);
  const videos = await searchVideos(query, count);

  if (videos.length === 0) {
    console.log("No videos found. Try a different query.");
    return;
  }

  console.log(`Found ${videos.length} videos. Downloading...`);

  const downloaded: string[] = [];

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];

    // Prefer HD portrait video, fallback to SD
    const file =
      video.video_files
        .filter((f) => f.height > f.width) // Portrait
        .sort((a, b) => b.height - a.height)
        .find((f) => f.height >= 720 && f.height <= 1920) ||
      video.video_files
        .sort((a, b) => b.height - a.height)
        .find((f) => f.height >= 720);

    if (!file) {
      console.log(`  Skipping video ${video.id} — no suitable quality`);
      continue;
    }

    const filename = `bg-${i + 1}.mp4`;
    const dest = path.join(outDir, filename);

    process.stdout.write(`  Downloading ${filename} (${file.width}x${file.height})...`);
    await downloadFile(file.link, dest);
    console.log(" done");
    downloaded.push(filename);
  }

  console.log(`\nDownloaded ${downloaded.length} videos to ${outDir}/`);
  console.log("Files:", downloaded.join(", "));
  console.log(
    '\nUse in your reel props as: { videoUrl: staticFile("videos/bg-1.mp4") }'
  );
}

main().catch(console.error);
