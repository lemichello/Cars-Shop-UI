let fs = require('fs');

fs.copyFile('./docs/index.html', './docs/404.html', err => {
  if (err) throw error;
  console.log('Copied index.html to 404.html');
});
