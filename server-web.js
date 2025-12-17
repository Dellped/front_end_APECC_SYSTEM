import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(join(__dirname, "dist")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve index.html for all routes (SPA routing)
app.get("*", (req, res) => {
  try {
    const indexPath = join(__dirname, "dist", "index.html");
    let indexContent = readFileSync(indexPath, "utf-8");
    
    // Inject runtime configuration from environment variables
    // This allows Cloud Run to set API_URL at runtime
    const apiUrl = process.env.API_URL || process.env.VITE_API_URL || "";
    const configScript = `
    <script>
      window.__ENV__ = {
        API_URL: ${JSON.stringify(apiUrl)}
      };
    </script>
    `;
    
    // Inject the config script before the closing </head> tag
    indexContent = indexContent.replace("</head>", `${configScript}</head>`);
    
    res.send(indexContent);
  } catch (error) {
    res.status(500).send("Error loading application");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
