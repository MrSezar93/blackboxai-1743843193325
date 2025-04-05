const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Route for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Accounting app running at http://localhost:${port}`);
  console.log('Available pages:');
  console.log(`- Dashboard: http://localhost:${port}/index.html`);
  console.log(`- Add Transaction: http://localhost:${port}/add.html`);
  console.log(`- Transaction List: http://localhost:${port}/list.html`);
  console.log(`- Settings: http://localhost:${port}/settings.html`);
});