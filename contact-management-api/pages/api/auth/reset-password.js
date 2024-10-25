import { db } from '../../../lib/db';
import rateLimiter from '../../../middleware/rateLimit'; 

export default async function handler(req, res) {
  if (req.method === 'POST') {

    await rateLimiter(req, res, () => {
      handleResetPassword(req, res);
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleResetPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
}
