# RecogeLatas

RecogeLatas is a web application designed to help students register, track and organize aluminum can collections as part of a school campaign. Each student has a personal profile where they record collected cans, view personal and group statistics, and are ranked automatically within their course based on collected cans.

## Project structure

```
recoge-latas/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── register.html
│   │   ├── profile.html
│   │   ├── assets/
│   │   ├── js/
│   │   └── styles/
└── README.md
```

Note: The tree above is a concise overview; the repository also contains supporting files such as configuration, package manifests and static assets.

## Key features

- User registration (from a predefined list in the database) with nickname and password assignment
- Authentication with JWT and cookie support
- Personal profile view showing progress and personal statistics
- Global and group-level totals of collected cans
- Leaderboards (group and overall) to encourage participation through friendly competition
- Integrated charts to compare a user’s performance against their group
- Simple, youth-friendly UI

## Technologies

### Backend
- Node.js
- Express
- PostgreSQL
- jsonwebtoken (JWT)
- bcrypt.js
- dotenv

### Frontend
- HTML, CSS
- Vanilla JavaScript
- Swiper.js (for interactive sliders)

### Other dependencies / middleware
- pg or pg-promise (PostgreSQL client)
- cors
- cookie-parser

## Installation and local setup

1. Clone the repository

```bash
git clone https://github.com/your-username/recoge-latas.git
cd recoge-latas
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Create environment variables

Create a `.env` file inside `backend/` with at least the following entries:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Start the backend server

```bash
node server.js
```

5. Open the frontend

Open `frontend/public/index.html` in your browser (or serve the `public/` folder with a static server).

Note: Ensure PostgreSQL is running and the database is created and accessible before starting the backend.

## Database schema (summary)

The application uses PostgreSQL. Below is a simplified summary of the main tables and relationships. Implement migrations or create tables manually before running the server.

Users
- id: integer (PK)
- name: text (not null)
- nickname: text (unique, nullable)
- password: text (nullable)
- total_cans: integer (default 0)
- group_id: integer (FK → groups.id, nullable)

Groups
- id: integer (PK)
- name: text (not null)
- description: text (nullable)

Collects
- id: integer (PK)
- user_id: integer (FK → users.id, nullable)
- amount: integer (not null)
- date: timestamp (default current_timestamp)
- log_id: integer (FK → logs.id, nullable, ON DELETE CASCADE)

Logs
- id: integer (PK)
- user_id: integer (FK → users.id, nullable, ON DELETE CASCADE)
- action: text (not null)
- timestamp: timestamp (default current_timestamp)

Ensure the appropriate foreign keys and indexes are created according to your preferred migration strategy.

## Deployment

The frontend can be deployed as static assets (Vercel, Netlify, etc.). The backend is suitable for deployment on Render, Railway, Heroku, or similar services. Configure environment variables and the database connection for your chosen platform.


## Author

José Garrillo (Ssj400)

## Project status

- Status: Completed (archive / read-only mode)

## License

This project is licensed under the [MIT License](./LICENSE).
