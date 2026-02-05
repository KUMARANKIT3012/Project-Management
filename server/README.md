# Project Management Server

Backend API for the Project Management platform built with Node.js and Prisma.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL/SQLite with Prisma ORM
- **Authentication**: JWT
- **Environment**: dotenv

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (or SQLite for development)

### Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your database connection string and other required variables.

4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

6. Start the development server:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
server/
├── configs/
│   └── prisma.js       # Prisma configuration
├── prisma/
│   └── schema.prisma   # Database schema
├── .env                # Environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
└── server.js          # Main server file
```

## 🔧 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Run database migrations
- `npx prisma db push` - Push schema changes to database

## 🌐 API Endpoints

The server provides RESTful API endpoints for:

- User authentication and management
- Project creation and management
- Task management
- Team collaboration
- Analytics and reporting

## 📝 Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
DATABASE_URL="your_database_connection_string"
JWT_SECRET="your_jwt_secret"
PORT=5000
NODE_ENV=development
```

## 🤝 Contributing

Please read the [Contributing Guidelines](../client/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../client/LICENSE.md) file for details.