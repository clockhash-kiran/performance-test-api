const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(morgan('combined'));

// Sample data
let users = [
  { id: 1, name: 'User 1', email: 'user1@example.com' },
  { id: 2, name: 'User 2', email: 'user2@example.com' },
  { id: 3, name: 'User 3', email: 'user3@example.com' }
];

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/users', (req, res) => {
  // Add artificial delay to simulate processing time (0-100ms)
  setTimeout(() => {
    res.json(users);
  }, Math.random() * 100);
});

app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  // Add artificial delay to simulate processing time (0-50ms)
  setTimeout(() => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  }, Math.random() * 50);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  // Simulate processing workload (100-300ms)
  setTimeout(() => {
    const newUser = {
      id: users.length + 1,
      name,
      email
    };
    
    users.push(newUser);
    res.status(201).json(newUser);
  }, 100 + Math.random() * 200);
});

app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  
  // Simulate heavy processing workload (200-500ms)
  setTimeout(() => {
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    users[userIndex] = { 
      ...users[userIndex],
      ...(name && { name }),
      ...(email && { email })
    };
    
    res.json(users[userIndex]);
  }, 200 + Math.random() * 300);
});

app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  // Simulate processing workload (100-200ms)
  setTimeout(() => {
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    users = users.filter(u => u.id !== id);
    res.status(204).end();
  }, 100 + Math.random() * 100);
});

// CPU-intensive endpoint to test performance under load
app.get('/api/compute/:complexity', (req, res) => {
  const complexity = parseInt(req.params.complexity) || 10;
  const limit = Math.min(complexity, 35); // Prevent server crash with excessive values
  
  // Compute Fibonacci number - CPU intensive task
  const fibonacci = (n) => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  };
  
  const result = fibonacci(limit);
  res.json({ result });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
