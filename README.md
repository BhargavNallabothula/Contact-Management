Contact Management API
This is a contact management system API built using Next.js and MySQL. The API allows users to register, log in, and manage their contacts with features like adding, updating, deleting, and batch processing of contacts. It also includes file handling for uploading contacts via CSV or Excel, and provides advanced features like rate limiting on sensitive endpoints.

Features
User Authentication (JWT based)
Email Verification upon registration
Password Reset functionality via one-time-code
Contact Management:
Add, update, delete contacts
Soft delete (marked deleted but not removed)
Batch processing (CSV/Excel uploads)
Data Filtering & Sorting on contacts (e.g., by name, email, or timezone)
Rate Limiting on sensitive endpoints (like login & registration)
Time Zone Handling and UTC storage for contacts
File Uploads for bulk contact creation (CSV & Excel)
Download Contacts as CSV/Excel
Prerequisites
Node.js (version 14.x or higher)
MySQL (installed and running locally or via a remote service)
Git (for version control and repository setup)
Vercel/Heroku account for deployment
Getting Started
1. Clone the repository
Copy code
git clone https://github.com/yourusername/contact-management-api.git

2. Install dependencies
Navigate to the project directory:
Copy code
cd contact-management-api
npm install

3. Set up the MySQL Database
Create a new MySQL database.
Add the database credentials to a .env file in the root of your project.
Example .env:

bash
Copy code
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=contacts_db
JWT_SECRET=your_jwt_secret_key

4. Run Migrations
After setting up the database, run migrations to create the necessary tables.
Copy code
npm run db:migrate

5. Run the development server
Start the Next.js development server:
Copy code
npm run dev
This will run the server at http://localhost:3000/api.

Database Schema
The database schema is composed of two primary tables: users and contacts.

ER Diagram:

Users Table:
id: Primary Key (Auto-increment)
email: User’s email (Unique)
password: User’s password (hashed)
createdAt: Timestamp of user creation
verified: Boolean flag indicating email verification status
Contacts Table:
id: Primary Key (Auto-increment)
userId: Foreign Key (references users)
name: Name of the contact
email: Email of the contact (Unique per user)
phone: Phone number of the contact
address: Address of the contact
timezone: Contact's timezone
createdAt: Timestamp when the contact was created (stored in UTC)
updatedAt: Timestamp when the contact was last updated (stored in UTC)
deletedAt: Soft delete timestamp (null if not deleted)
API Documentation
The API follows RESTful principles, providing the following endpoints:

Authentication
POST /api/auth/register:

Register a new user.
Example body:
json
Copy code
{
  "email": "user@example.com",
  "password": "password123"
}
POST /api/auth/login:

Login a user and return a JWT token.
Example body:
json
Copy code
{
  "email": "user@example.com",
  "password": "password123"
}
POST /api/auth/reset-password:

Send a password reset email to the user.
Contacts
GET /api/contacts:

Retrieve a list of contacts, supports filtering (e.g., by name, email) and sorting.
Query parameters:
name: Filter by name.
email: Filter by email.
timezone: Filter by timezone.
POST /api/contacts:

Create a new contact.
Example body:
json
Copy code
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "phone": "1234567890",
  "address": "123 Main St, Springfield",
  "timezone": "America/New_York"
}
PUT /api/contacts/
:

Update a contact by ID.
Example body:
json
Copy code
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
DELETE /api/contacts/
:

Soft delete a contact by marking the deletedAt timestamp.
POST /api/contacts/upload:

Upload a CSV/Excel file to create/update multiple contacts in bulk.
File upload using multipart/form-data.
File Upload API
The bulk file upload API allows users to upload contacts via CSV or Excel files. Contacts in the file will be validated and processed accordingly.

Example request:

less
Copy code
POST /api/contacts/upload
Content-Type: multipart/form-data
Body: [your_file]
Rate Limiting
Sensitive endpoints like login and registration have rate limiting applied to prevent abuse. Each IP is allowed up to 5 requests per 15 minutes.

Middleware is defined in middleware/rateLimit.js.

Deployment Instructions
Deploying to Vercel:
Install Vercel CLI:

bash
Copy code
npm i -g vercel
Log in to Vercel:

bash
Copy code
vercel login
Deploy the Project:

bash
Copy code
vercel
Set Environment Variables: Set the environment variables (DATABASE_HOST, JWT_SECRET, etc.) through the Vercel dashboard.

Deploying to Heroku:
Install Heroku CLI:

bash
Copy code
npm install -g heroku

Log in to Heroku:
Copy code
heroku login
Create a New App:

bash
Copy code
heroku create
Add Environment Variables: Set environment variables using the following command:

bash
Copy code
heroku config:set VAR_NAME=value

Deploy the Project: Push your code to Heroku:
Copy code
git push heroku master
Migrations

To create or update database tables, run the following migration commands:
Copy code
npm run db:migrate
This will set up the necessary tables in your MySQL database for users and contacts.

Tools and Libraries
Next.js: Framework for building API and SSR apps
MySQL: Relational database for storing user and contact data
JWT: Authentication using JSON Web Tokens
bcryptjs: Password hashing for secure user authentication
express-rate-limit: Middleware for rate limiting on sensitive endpoints
csv-parser: For handling CSV uploads and parsing contact data
Contributions
Feel free to fork the project and submit pull requests with any enhancements or bug fixes.

License
This project is licensed under the MIT License.

Contact
For any issues or inquiries, please reach out via GitHub.
