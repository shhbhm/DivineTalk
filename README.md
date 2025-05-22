# DivineTalk Chat Application

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to communicate through text messages and share files.

## Features

- **User Authentication**: Secure login and registration system
- **Real-time Messaging**: Instant message delivery using Socket.io
- **File Sharing**: Send and receive images, documents, and other files
- **User Presence**: See when users are online or last active
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Toggle between dark and light theme
- **Search Functionality**: Find users and messages easily
- **Profile Management**: Update user profile information

## Tech Stack

### Frontend
- React.js with Hooks
- Chakra UI for styling
- Socket.io Client for real-time communication
- React Router for navigation

### Backend
- Node.js and Express.js
- MongoDB for database
- Socket.io for WebSocket connections
- JWT for authentication
- AWS S3 for file storage

## Installation

### Prerequisites
- Node.js (v14 or above)
- MongoDB
- Git

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/shhbhm/DivineTalk.git
cd DivineTalk
```

2. Install dependencies for backend
```bash
cd backend
npm install
```

3. Install dependencies for frontend
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
```

5. Start the backend server
```bash
cd ../backend
npm start
```

6. Start the frontend development server
```bash
cd ../frontend
npm start
```

7. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/getotp` - Get OTP for verification

### User Management
- `GET /api/user/profile` - Get current user profile
- `POST /api/user/update` - Update user profile
- `GET /api/user/search` - Search for users
- `GET /api/user/online-status/:id` - Get user online status
- `GET /api/user/non-friends` - Get users not in conversations
- `GET /api/user/all-users` - Get all users
- `GET /api/user/presigned-url` - Get S3 presigned URL for uploads

### Conversations
- Various endpoints for managing chats and messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

- **Shubham Solanki** - [GitHub Profile](https://github.com/shhbhm)

## Acknowledgments

- Thanks to all contributors and supporters of this project!
