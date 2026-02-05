# 📋 Project Management Platform

A full-stack project management platform built with React, Node.js, and Prisma. This application helps teams organize projects, manage tasks, and collaborate effectively.

## 🏗️ Architecture

This project follows a client-server architecture:

- **Frontend (`/client`)**: React.js application with Vite, Redux Toolkit, and Tailwind CSS
- **Backend (`/server`)**: Node.js API with Express.js and Prisma ORM

## ✨ Features

- 🏢 **Workspace Management**: Create and manage multiple workspaces
- 📂 **Project Organization**: Organize work into projects with detailed tracking
- ✅ **Task Management**: Create, assign, and track tasks with different statuses
- 👥 **Team Collaboration**: Invite team members and manage permissions
- 📊 **Analytics Dashboard**: Visual insights into project progress and team performance
- 📅 **Calendar Integration**: Schedule and track project timelines
- 🔔 **Real-time Updates**: Stay updated with project changes
- 🎨 **Modern UI**: Clean, responsive design with dark/light theme support

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL/SQLite** - Database
- **JWT** - Authentication

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (optional, SQLite works for development)
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KUMARANKIT3012/Project-Management.git
   cd Project-Management
   ```

2. **Set up the backend**:
   ```bash
   cd server
   npm install
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env file with your database connection and other settings
   
   # Run database setup
   npx prisma migrate dev
   npx prisma generate
   
   # Start the server
   npm start
   ```

3. **Set up the frontend**:
   ```bash
   cd ../client
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
Project-Management/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages/routes
│   │   ├── features/      # Redux slices and state management
│   │   ├── app/           # Redux store configuration
│   │   └── assets/        # Static assets and utilities
│   ├── public/            # Public assets
│   └── ...config files
├── server/                # Node.js backend API
│   ├── configs/          # Configuration files
│   ├── prisma/           # Database schema and migrations
│   ├── server.js         # Main server file
│   └── ...config files
├── .gitignore           # Git ignore rules
└── README.md           # Project documentation
```

## 🔧 Development

### Backend Development
```bash
cd server
npm run dev          # Start with hot reload
npx prisma studio    # Open database GUI
npx prisma db push   # Push schema changes
```

### Frontend Development
```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🧪 Testing

```bash
# Frontend tests
cd client
npm run test

# Backend tests
cd server
npm run test
```

## 🚀 Deployment

### Backend Deployment
1. Set up your production database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting platform (Vercel, Netlify, etc.)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](client/CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](client/LICENSE.md) file for details.

## 📞 Support

If you have any questions or need help getting started:

1. Check the [Issues](https://github.com/KUMARANKIT3012/Project-Management/issues) page
2. Create a new issue if your problem isn't already addressed
3. Contact the maintainers

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this project
- Built with modern web technologies and best practices
- Inspired by popular project management tools

---

<div align="center">
  <p>Made with ❤️ by the Project Management Team</p>
  <p>⭐ Star this repository if it helped you!</p>
</div>