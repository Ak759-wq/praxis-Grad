const fs = require('fs');

const logPath = 'C:/Users/WIN/.gemini/antigravity/brain/ed9e7751-96f0-4016-96fe-b6b95c3e7bcb/.system_generated/logs/transcript.jsonl';

if (!fs.existsSync(logPath)) {
  console.error("Log file not found");
  process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.trim().split('\n');

console.log("Reading subagent logs...");

// Look for lines containing tool results or replies
for (let i = lines.length - 1; i >= 0; i--) {
  const line = lines[i];
  if (line.includes('"source":"SYSTEM"') || line.includes('"type":"SUBAGENT_RESPONSE"') || line.includes('"content":')) {
    try {
      const obj = JSON.parse(line);
      if (obj.content && obj.content.toLowerCase().includes('quad')) {
        console.log(`--- Match at step ${obj.step_index} ---`);
        console.log(obj.content);
        break;
      }
    } catch (e) {}
  }
}
