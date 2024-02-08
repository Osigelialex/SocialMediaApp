# Social Media APP

## Description
The Social Media APP has a RESTful API backend that allows users to interact with a social media platform. It provides endpoints for creating, reading, updating, and deleting user profiles, posts, comments, and likes and followers and also supports file uploads via multer.

## Todo
Build Frontend in REACT

## Features
- User Management:
  - Create a new user profile
  - Retrieve user profile information
  - Update user profile information
  - Delete a user profile

- Post Management:
  - Create a new post
  - Retrieve post information
  - Update a post
  - Delete a post

- Comment Management:
  - Create a new comment on a post
  - Retrieve comment information
  - Update a comment
  - Delete a comment

- Reply Management
  - Create a new reply
  - Delete a reply
  - Get replies for a post

- Like Management:
  - Like a post
  - Unlike a post
  - Retrieve likes on a post

- Followers Management
  - Follow a user
  - Unfollow a user
  - Retrieve followers for a user

## Technologies Used
- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT) for authentication
- Mongoose for database modeling

## Installation
1. Clone the repository: `git clone https://github.com/Osigelialex/SocialMediaAPI.git`
2. Install the dependencies: `npm install`
3. Set up the environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
      PORT=3000
      DB_URL=mongodb://localhost:27017/socialMediaAPI
      JWT_SECRET=your-jwt-secret
      SALT_ROUNDS=preferred-salt-rounds
      SMTP_HOST=sandbox.smtp.mailtrap.io
      SMTP_PORT=2525
      SMTP_USER=your-mailtrap-sandbox-user
      SMTP_PASSWORD=your-mailtrap-sandbox-password
      NODE_ENV=development
     ```
4. Start the server: `npm start`

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.