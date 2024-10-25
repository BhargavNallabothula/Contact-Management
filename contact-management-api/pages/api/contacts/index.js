import { db } from '../../../lib/db';
import { verifyToken } from '../../../middleware/verifyToken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, address, timezone } = req.body;
    const userId = req.user.id; 

    try {
      await db.query(
        'INSERT INTO contacts (userId, name, email, phone, address, timezone) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, name, email, phone, address, timezone]
      );
      res.status(201).json({ message: 'Contact created successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error creating contact', error });
    }
  }
}



import { db } from '../../../lib/db';
import { verifyToken } from '../../../middleware/verifyToken';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const userId = req.user.id;

    try {
      const contacts = await db.query('SELECT * FROM contacts WHERE userId = ? AND deletedAt IS NULL', [userId]);
      res.status(200).json({ contacts });
    } catch (error) {
      res.status(400).json({ message: 'Error fetching contacts', error });
    }
  }
}
