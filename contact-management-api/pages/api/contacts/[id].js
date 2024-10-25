import { db } from '../../../lib/db';
import { verifyToken } from '../../../middleware/verifyToken';


export default async function handler(req, res) {
  await verifyToken(req, res);

  const { id } = req.query; 

  if (req.method === 'PUT') {
    const userId = req.user.id; 
    const { name, email, phoneNumber, address, timezone } = req.body;

    if (!name || !email || !phoneNumber || !address || !timezone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const [result] = await db.query(
        `UPDATE contacts
         SET name = ?, email = ?, phoneNumber = ?, address = ?, timezone = ?, updatedAt = NOW()
         WHERE id = ? AND userId = ? AND deletedAt IS NULL`,
        [name, email, phoneNumber, address, timezone, id, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Contact not found or not authorized' });
      }

      res.status(200).json({ message: 'Contact updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating contact', error });
    }
  } else if (req.method === 'DELETE') {
    const userId = req.user.id;
    try {
      const [result] = await db.query(
        `UPDATE contacts
         SET deletedAt = NOW(), updatedAt = NOW()
         WHERE id = ? AND userId = ? AND deletedAt IS NULL`,
        [id, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Contact not found or not authorized' });
      }

      res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting contact', error });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
