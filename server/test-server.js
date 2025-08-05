const express = require('express');
const app = express();
const PORT = 5001;

// Basic middleware
app.use(express.json());

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test server working' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Health check passed' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}); 