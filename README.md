# MERN Chat Application

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- Real-time messaging
- User authentication
- Friend management system
- Online status indicators
- Profile customization

## Tech Stack

- **Frontend**: React.js
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/shhbhm/mern-chat-app.git
cd mern-chat-app
```

2. Install dependencies for backend
```
cd backend
npm install
```

3. Install dependencies for frontend
```
cd ../frontend
npm install
```

4. Create .env file in the backend directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. Start the backend server
```
cd ../backend
npm start
```

6. Start the frontend server
```
cd ../frontend
npm start
```

## Project Structure
- `/backend` - Express server, API routes, controllers, and models
- `/frontend` - React application with components and services

## License
This project is licensed under the MIT License.
