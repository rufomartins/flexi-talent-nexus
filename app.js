
const { spawn } = require('child_process');
const path = require('path');

// Spawn the actual server process
const serverProcess = spawn('node', [path.join(__dirname, 'server.js')], {
  stdio: 'inherit'
});

// Handle server process events
serverProcess.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

process.on('SIGTERM', () => {
  serverProcess.kill();
  process.exit(0);
});

