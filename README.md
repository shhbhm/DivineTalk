# DivineTalk

DivineTalk is a real-time chat application that enables seamless communication through private and group chats, image sharing, and an AI-powered chatbot. Built with a modern tech stack, it offers a responsive user interface, secure authentication, and scalable architecture, making it ideal for personal or collaborative use.

## Features

- **Real-time Messaging**: Send and receive messages instantly with Socket.IO, supporting private and group chats.
- **Image Sharing**: Upload and share images securely via Cloudinary, with optimized delivery and lazy loading.
- **AI Chatbot**: Engage in intelligent conversations with an AI powered by Google Generative AI (Gemini).
- **Secure Authentication**: User login and signup with JWT-based authentication for secure access.
- **Typing Indicators**: Real-time feedback when users are typing.
- **Read Receipts & Unread Counts**: Track message read status and unread messages per conversation.
- **Responsive UI**: Built with React and Chakra UI for a consistent, mobile-friendly experience.
- **Scalable Backend**: Node.js, Express, and MongoDB ensure efficient data management and scalability.
- **Error Handling & Security**: Input validation, file restrictions, and CORS for robust security.

![Screenshot 2025-06-05 171545](https://github.com/user-attachments/assets/25451cfa-8d4c-4633-8199-05aba0f2dcd3)

Creating an Account:
  ![Screenshot 2025-06-05 171806](https://github.com/user-attachments/assets/1cd785e2-5be4-4439-9d21-50410cd49fb9)

Login page:
![Screenshot 2025-06-05 171832](https://github.com/user-attachments/assets/c0c8459e-1d2b-4622-b05b-d17b8ecb30c7)

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

Send Image:
![Screenshot 2025-06-06 231717](https://github.com/user-attachments/assets/0c165610-090d-4ae4-a68a-e28d1a43b3ca)
![Screenshot 2025-06-06 231750](https://github.com/user-attachments/assets/f3786c7f-bd5f-4b27-9262-b10c3822a942)

## Tech Stack

### Frontend

- **React.js**: Component-based UI for dynamic and interactive chat interfaces.
- **Chakra UI**: Pre-styled components for a responsive and accessible design.
- **Socket.IO Client**: Handles real-time communication with the backend.
- **React Context**: Manages global state for chats and authentication.

### Backend

- **Node.js & Express**: RESTful API for handling requests and routing.
- **Socket.IO**: Enables real-time, bidirectional communication.
- **MongoDB with Mongoose**: NoSQL database for storing users, messages, and conversations.
- **Cloudinary**: Cloud-based storage for images with optimized delivery.
- **Google Generative AI (Gemini)**: Powers the AI chatbot for intelligent responses.
- **JWT**: Secures authentication and protects API routes.

## Project Structure
```text
DivineTalk/
├── backend/
│   ├── config/
│   │   └── imageupload.js         # Cloudinary configuration
│   ├── controllers/
│   │   ├── auth_controller.js     # Authentication logic
│   │   └── message_controller.js  # Message and AI response handling
│   ├── middleware/
│   │   └── fetchUser.js           # JWT verification middleware
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Message.js             # Message schema
│   │   └── Conversation.js        # Conversation schema
│   ├── routes/
│   │   ├── auth_routes.js         # Authentication endpoints
│   │   ├── message.js             # Message operations
│   │   ├── conversation.js        # Conversation management
│   │   ├── user.js                # User operations
│   │   └── upload.js              # Image upload endpoint
│   ├── socket/
│   │   ├── index.js               # Socket.IO server setup
│   │   └── handlers.js            # Socket.IO event handlers
│   └── server.js                  # Main Express server
├── src/
│   ├── components/
│   │   ├── ChatArea.js            # Main chat interface
│   │   ├── Message.js             # Message bubble component
│   │   ├── FileUploadModal.js     # Image upload UI
│   │   ├── Sidebar.js             # Chat list and navigation
│   │   └── UserProfile.js         # User profile management
│   ├── context/
│   │   ├── chatContext.js         # Chat state management
│   │   └── AuthContext.js         # Authentication state management
│   └── App.js                     # Main React app
├── .env                           # Environment variables
├── package.json                   # Project dependencies
└── README.md                      # This file
```


## Prerequisites

- **Node.js**: v16 or higher
- **MongoDB**: Local or cloud instance (e.g., MongoDB Atlas)
- **Cloudinary Account**: For image storage
- **Google Generative AI API Key**: For AI chatbot functionality
- **Git**: For cloning the repository

## Installation

### Clone the Repository
## Installation

### Clone the Repository

```bash
git clone https://github.com/shhbhm/DivineTalk.git
cd DivineTalk
```

### Install Dependencies

```bash
npm install
cd backend
npm install
```

### Set Up Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_AI_API_KEY=your_google_ai_api_key
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Start the Backend

```bash
cd backend
npm start
```

### Start the Frontend

```bash
cd ..
npm start
```

## Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

### Sign Up / Log In

- Create an account or log in using the authentication forms.
- JWTs are stored in the browser for session management.

### Start Chatting

- Use the sidebar to select or create conversations (private or group).
- Send text messages or upload images via the chat interface.
- Engage with the AI chatbot by sending messages to the designated AI recipient.

### Image Sharing

- Open the file upload modal to select and upload images.
- Images are stored in Cloudinary and displayed in chat bubbles.

### Real-time Features

- See typing indicators and read receipts in real-time.
- Receive instant message updates via Socket.IO.

---

## API Endpoints

### Authentication

- `POST /auth/login`: Log in and receive a JWT.
- `POST /auth/signup`: Register a new user.
- `POST /auth/verify-token`: Validate a JWT.

### Messages

- `GET /message/:conversationId`: Retrieve messages with pagination.
- `POST /message`: Send a message (complements Socket.IO).
- `PUT /message/:messageId`: Update message status (e.g., read).

### Conversations

- `GET /conversation`: List user conversations.
- `POST /conversation`: Create a new conversation.
- `GET /conversation/:conversationId`: Get conversation details.

### Users

- `GET /user/:userId`: Retrieve user profile.
- `PUT /user/:userId`: Update user details.
- `GET /user/search`: Search for users.

### File Upload

- `POST /upload/image`: Upload an image to Cloudinary.

### Socket.IO Events

- `setup`: Connects a user to their unique room.
- `join-chat`: Joins a conversation room.
- `send-message`: Sends a message to recipients.
- `typing`: Sends typing indicators.
- `disconnect`: Updates offline status.

---

## Performance Optimizations

- **Lazy Loading**: Images are lazy-loaded to reduce initial load times.
- **Pagination**: Messages are fetched in batches for efficient data handling.
- **Socket Debouncing**: Reduces unnecessary Socket.IO events.
- **Temporary Messages**: Provides instant UI feedback for messages.
- **Caching**: Optimizes frequent database queries (e.g., user profiles).

---

## Security Features

- **JWT Authentication**: Secures API routes and user sessions.
- **Input Validation**: Prevents injection attacks and invalid data.
- **File Restrictions**: Limits upload types and sizes.
- **CORS**: Restricts access to trusted origins.
- **Error Handling**: Graceful error responses for robustness.
## Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**.

2. **Create a new branch**:  
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make your changes and commit**:  
   ```bash
   git commit -m "Add your feature"
   ```

4. **Push to the branch**:  
   ```bash
   git push origin feature/your-feature
   ```

5. **Open a pull request** with a clear description of your changes.

Please follow the **Code of Conduct** and ensure **tests pass** before submitting your pull request.

---

## License

This project is licensed under the **MIT License**.

---

## Contact

For questions or feedback, feel free to:

- Reach out to **[@shhbhm](https://github.com/shhbhm)**
- Or open an [issue on GitHub](https://github.com/shhbhm/DivineTalk/issues)

