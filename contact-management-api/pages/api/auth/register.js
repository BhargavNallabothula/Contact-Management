import { db } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import rateLimiter from '../../../middleware/rateLimit'; 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    
    await rateLimiter(req, res, () => {
      handleRegister(req, res);
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleRegister(req, res) {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
}
