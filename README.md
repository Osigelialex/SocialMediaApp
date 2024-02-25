# Social Media App

<img width="959" alt="Netlink-dark" src="https://github.com/Osigelialex/SocialMediaApp/assets/97721950/8f5ea911-eed3-4c08-8f28-3f863e177d88">

This MERN stack social media application allows users to connect and share their thoughts, photos, and more. Below are the key features, prerequisites, and setup instructions for the application.

## Features

1. **User Registration:**
   - Users can create an account to access the application.

2. **User Profiles:**
   - Each user has a dedicated profile page.
   - Users can update their information and profile picture.

3. **Posts:**
   - Users can create posts to share their content.
   - Users can interact with posts by liking and commenting.

4. **Friends:**
   - Users can follow other users and be followed by other users

5. **Search:**
   - Users can search for other users using display names or usernames.

## Prerequisites

Ensure you have the following installed before setting up the application:

- [NodeJS](https://nodejs.org/)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass)

## Setup

Follow these steps to set up the application:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/SocialMediaApp.git

2. **Navigate to the main directory**
  ```bash
  cd SocialMediaApp
  ```

3. **Install dependencies**
  ```bash
  npm install
   ```

4. **Configure environment variables**
   Create a .env file in the root directory and set the following variables
   ```bash
     JWT_SECRET=YOUR_JWT_SECRET
     SALT_ROUNDS=10
     PORT=5000
     DB_URL=YOUR_MONGODB_CONNECTION_STRING
     NODE_ENV=development
     ```

6. **Run the Application**
  ```bash
  npm start
   ```

6. **Open in Browser**:
  Open your web browser and go to http://localhost:5173 to access the Social Media App.
