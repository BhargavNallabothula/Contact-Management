import { db } from '../../../lib/db';
import { Parser } from 'json2csv';
import { verifyToken } from '../../../middleware/verifyToken';

export default async function handler(req, res) {
  await verifyToken(req, res);

  if (req.method === 'GET') {
    const userId = req.user.id;

    try {
      const contacts = await db.query('SELECT * FROM contacts WHERE userId = ? AND deletedAt IS NULL', [userId]);

      
      const fields = ['name', 'email', 'phoneNumber', 'address', 'timezone', 'createdAt', 'updatedAt'];
      const json2csv = new Parser({ fields });
      const csv = json2csv.parse(contacts);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
      res.status(200).end(csv);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching contacts', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
