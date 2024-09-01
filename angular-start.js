// angular-start.js
const { exec } = require('child_process');

exec('ng serve --port 8088 --disable-host-check', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});
