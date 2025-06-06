# DivineTalk Chat Application

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js).

![DivineTalk Logo](screenshots/banner.png)

## Features

- Real-time messaging with socket.io integration
- User authentication with JWT
- Friend management system
- Online status indicators
- Profile customization
- Dark/Light theme
- Message delivery and read receipts
- File and image sharing
- Typing indicators
- Mobile responsive design

![Screenshot 2025-06-05 171545](https://github.com/user-attachments/assets/25451cfa-8d4c-4633-8199-05aba0f2dcd3)

Creating an Account:
  ![Screenshot 2025-06-05 171806](https://github.com/user-attachments/assets/1cd785e2-5be4-4439-9d21-50410cd49fb9)

Login page:
![Screenshot 2025-06-06 131456](https://github.com/user-attachments/assets/b841007c-d557-456a-a136-bdd8db7695a9)

Starting a chat:
![Screenshot 2025-06-06 131845](https://github.com/user-attachments/assets/1d4f462f-46b0-4570-9f15-afa9285a5e9c)

Messaging personally:
![Screenshot 2025-06-06 131918](https://github.com/user-attachments/assets/ebe00bbe-ff9c-4909-bd6e-38e49082027d)

![Screenshot 2025-06-06 132001](https://github.com/user-attachments/assets/52f72e00-daed-462a-bbd6-00bdb2774874)

![Screenshot 2025-06-06 132021](https://github.com/user-attachments/assets/fa5455e1-5bc9-4bb0-8516-0c8ece279f7b)

Creating a group:

![Screenshot 2025-06-06 132215](https://github.com/user-attachments/assets/0ab46c2f-0c4f-424b-86e2-bdd1fba905f8)

![Screenshot 2025-06-06 132304](https://github.com/user-attachments/assets/308ed258-776a-4465-a5b3-4a5ae766db6d)

![Screenshot 2025-06-06 132709](https://github.com/user-attachments/assets/a2817f6c-8e07-4125-b19e-5841f45a790d)

Chat with Ai BOT:
![Screenshot 2025-06-06 133056](https://github.com/user-attachments/assets/10d1960f-83f9-44fb-946d-c537967f4bea)

## Tech Stack

- **Frontend**: React.js with Chakra UI
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: AWS S3/Cloudinary

## Screenshots

### Authentication Screen
![Authentication Screen](screenshots/banner.png)

### Chat Interface
![Chat Interface](screenshots/new_message.png)

## Setup Instructions

### Prerequisites
- Node.js (v14.0.0 or later)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/shhbhm/DivineTalk.git
cd DivineTalk
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
# Server Configuration
PORT=5000

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Authentication (use a strong, random string)
JWT_SECRET=your_secure_jwt_secret

# For AI features (optional)
GENERATIVE_API_KEY=your_google_ai_api_key

# Other optional configurations for full functionality
# AWS S3 for file storage
# EMAIL/PASSWORD for notifications
# CLOUDINARY credentials if using it for image uploads
```

IMPORTANT: Never commit your .env file or add API keys directly to your code.

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
  - `/src/components` - React components
  - `/src/context` - React context for state management
  - `/src/assets` - Static assets like images and sounds

## Future Enhancements
- Group chat functionality
- End-to-end encryption
- Voice and video calling
- Message reactions
- Message search

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author
Developed by Shubham Solanki
