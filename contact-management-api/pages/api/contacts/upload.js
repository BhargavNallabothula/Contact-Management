import multer from 'multer';
import { db } from '../../../lib/db';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '../../../middleware/verifyToken';


const upload = multer({ dest: 'uploads/' });

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  await verifyToken(req, res); 

  if (req.method === 'POST') {
    
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'File upload error' });
      }

      const filePath = path.join(process.cwd(), req.file.path);

      
      const contacts = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          
          contacts.push(data);
        })
        .on('end', async () => {
          
          for (let contact of contacts) {
            const { name, email, phoneNumber, address, timezone } = contact;
            if (!name || !email || !phoneNumber || !address || !timezone) {
              continue; 
            }
            try {
              await db.query(
                'INSERT INTO contacts (name, email, phoneNumber, address, timezone, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())',
                [name, email, phoneNumber, address, timezone, req.user.id]
              );
            } catch (error) {
              console.error('Error inserting contact', error);
            }
          }
          fs.unlinkSync(filePath); 
          res.status(200).json({ message: 'Contacts uploaded successfully' });
        });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
