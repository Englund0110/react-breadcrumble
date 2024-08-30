const fs = require("fs");
const path = require("path");

const distPath = path.resolve(__dirname, "dist");

const cleanDist = () => {
  if (fs.existsSync(distPath)) {
    console.log(`Deleting ${distPath}`);
    fs.rmSync(distPath, { recursive: true, force: true });
  } else {
    console.log(`${distPath} does not exist`);
  }
};

export default cleanDist;
