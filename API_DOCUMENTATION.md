# DivineTalk API Documentation

This document outlines the REST API endpoints available in the DivineTalk chat application.

## Base URL

All API endpoints are relative to the base URL:

```
https://api.divinetalk.com
```

Or if running locally:

```
http://localhost:5000
```

## Authentication

Most API endpoints require authentication. Authentication is handled using JSON Web Tokens (JWT).

### Headers

For authenticated requests, include the JWT token in the `auth-token` header:

```
auth-token: your_jwt_token_here
```

## API Endpoints

### Authentication

#### Register a New User

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "authtoken": "jwt_token_here"
}
```

#### Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "authtoken": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePic": "url_to_profile_picture"
  }
}
```

#### Login with OTP

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:** Same as regular login

#### Send OTP

```
POST /api/auth/sendotp
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent"
}
```

### User Management

#### Get User Profile

```
GET /api/auth/user
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "profilePic": "url_to_profile_picture",
  "about": "Hello World!!",
  "isOnline": true,
  "lastSeen": "2025-04-01T12:00:00.000Z"
}
```

#### Update User Profile

```
POST /api/user/update
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "about": "New bio information",
  "oldpassword": "currentpassword",
  "newpassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Profile Updated"
}
```

#### Get Online Status

```
GET /api/user/online-status/:id
```

**Response:**
```json
{
  "isOnline": true,
  "lastSeen": "2025-04-01T12:00:00.000Z"
}
```

### Chat Management

#### Get Non-Friends List

```
GET /api/user/non-friends
```

**Response:**
```json
[
  {
    "_id": "user_id",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "profilePic": "url_to_profile_picture"
  }
]
```

#### Create Conversation

```
POST /api/conversations
```

**Request Body:**
```json
{
  "receiverId": "recipient_user_id"
}
```

**Response:**
```json
{
  "_id": "conversation_id",
  "members": ["user_id", "recipient_user_id"],
  "createdAt": "2025-04-01T12:00:00.000Z",
  "updatedAt": "2025-04-01T12:00:00.000Z"
}
```

#### Get Conversation

```
GET /api/conversations/:id
```

**Response:**
```json
{
  "_id": "conversation_id",
  "members": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "profilePic": "url_to_profile_picture",
      "isOnline": true
    },
    {
      "_id": "recipient_user_id",
      "name": "Jane Doe",
      "profilePic": "url_to_profile_picture",
      "isOnline": false
    }
  ],
  "latest_message": {
    "_id": "message_id",
    "conversationId": "conversation_id",
    "senderId": "user_id",
    "text": "Hello there!",
    "createdAt": "2025-04-01T12:00:00.000Z"
  },
  "createdAt": "2025-04-01T12:00:00.000Z",
  "updatedAt": "2025-04-01T12:00:00.000Z"
}
```

#### Get Conversation List

```
GET /api/conversations
```

**Response:**
```json
[
  {
    "_id": "conversation_id",
    "members": [
      {
        "_id": "user_id",
        "name": "John Doe",
        "profilePic": "url_to_profile_picture"
      },
      {
        "_id": "recipient_user_id",
        "name": "Jane Doe",
        "profilePic": "url_to_profile_picture"
      }
    ],
    "latest_message": {
      "_id": "message_id",
      "conversationId": "conversation_id",
      "senderId": "user_id",
      "text": "Hello there!",
      "createdAt": "2025-04-01T12:00:00.000Z"
    },
    "unreadCount": 3,
    "createdAt": "2025-04-01T12:00:00.000Z",
    "updatedAt": "2025-04-01T12:00:00.000Z"
  }
]
```

### Messages

#### Send Message

```
POST /api/messages
```

**Request Body:**
```json
{
  "conversationId": "conversation_id",
  "text": "Hello there!"
}
```

**Response:**
```json
{
  "_id": "message_id",
  "conversationId": "conversation_id",
  "senderId": "user_id",
  "text": "Hello there!",
  "seenBy": ["user_id"],
  "createdAt": "2025-04-01T12:00:00.000Z",
  "updatedAt": "2025-04-01T12:00:00.000Z"
}
```

#### Get Messages for a Conversation

```
GET /api/messages/:conversationId
```

**Response:**
```json
[
  {
    "_id": "message_id",
    "conversationId": "conversation_id",
    "senderId": "user_id",
    "text": "Hello there!",
    "seenBy": ["user_id", "recipient_user_id"],
    "createdAt": "2025-04-01T12:00:00.000Z",
    "updatedAt": "2025-04-01T12:00:00.000Z"
  }
]
```

#### Delete Message

```
DELETE /api/messages/:id
```

**Response:**
```json
{
  "message": "Message deleted successfully"
}
```

### File Upload

#### Get Presigned URL for S3 Upload

```
GET /api/user/presigned-url
```

**Query Parameters:**
```
fileName: string
fileType: string
```

**Response:**
```json
{
  "url": "presigned_s3_url",
  "key": "file_key"
}
```

## Real-time Events (Socket.io)

DivineTalk uses Socket.io for real-time communication. Below are the events used:

### Client to Server Events

- `join`: Join a user to their own room for personal notifications
- `typing`: Indicate user is typing in a conversation
- `stop-typing`: Indicate user has stopped typing
- `send-message`: Send a new message
- `mark-seen`: Mark messages as seen

### Server to Client Events

- `receive-message`: Receive a new message
- `user-typing`: Someone is typing in your conversation
- `user-stop-typing`: Someone stopped typing in your conversation
- `message-deleted`: A message was deleted
- `online-status`: User online status changed

## Error Handling

All API endpoints return appropriate HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

Error responses include a message field:

```json
{
  "error": "Error message description"
}
```

## Rate Limiting

API requests are rate-limited to 100 requests per minute per user.

## Versioning

This documentation is for API version 1.0. 