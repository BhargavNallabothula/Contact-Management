import { db } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimiter from '../../../middleware/rateLimit'; 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    
    await rateLimiter(req, res, () => {
      handleLogin(req, res);
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleLogin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
}
