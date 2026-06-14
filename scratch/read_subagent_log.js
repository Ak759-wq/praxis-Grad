const fs = require('fs');
const path = require('path');

const logPath = 'C:/Users/WIN/.gemini/antigravity/brain/ed9e7751-96f0-4016-96fe-b6b95c3e7bcb/.system_generated/logs/transcript.jsonl';

if (!fs.existsSync(logPath)) {
  console.error("Log file not found at:", logPath);
  process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

console.log("Searching subagent logs for Quad AI fees...");

lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('quad') && line.toLowerCase().includes('fee')) {
    console.log(`Line ${idx + 1}:`, line.substring(0, 1000)); // print first 1000 chars of matching line
  }
});
