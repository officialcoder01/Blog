My Blog Project
A full-stack blog application built with Node.js, Express, Prisma, and PostgreSQL for the backend, and vanilla JavaScript, HTML, and CSS for the frontend. The application supports user authentication, post management, and commenting.

Table of Contents
Features
Prerequisites
Installation
Environment Setup
Database Setup
Running the Application
API Endpoints
Frontend Pages
Authentication
Usage
Contributing
License

Features:
* User Registration and Login: Users can register and log in with email and password.
* Role-Based Access: Supports ADMIN and USER roles. Admins can manage posts.
* Post Management: Admins can create, edit, publish, unpublish, and delete posts.
* Commenting: Users/Visitors (authenticated or anonymous) can comment on posts. Authenticated users can edit/delete their own comments; admins can manage all comments.
* Responsive Frontend: Simple, clean UI for viewing posts, managing content, and interacting with the blog.
* JWT Authentication: Secure token-based authentication for protected routes.
* Database: PostgreSQL with Prisma ORM for data management.

Prerequisites:
Node.js (v14 or higher)
npm or yarn
PostgreSQL database
Git (for cloning the repository)

Installation:
Clone the repository:
````
git clone <repository-url>
cd my-blog-project
````

Install backend dependencies:
````
cd backend
npm install
````

Environment Setup
Create a .env file in the backend directory with the following variables:
````
PORT=3000
JWT_SECRET=your_jwt_secret_here
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminpassword
ADMIN_NAME=admin
````

PORT: Port for the server (default 3000).
JWT_SECRET: Secret key for JWT token signing.
DATABASE_URL: PostgreSQL connection string.
ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME: Credentials for seeding the initial admin user.

Database Setup:
1. Ensure PostgreSQL is running and create a database (e.g., blog_db).

2. Run Prisma migrations:
````
cd backend
npx prisma migrate dev
````

3. Seed the database with an admin user:
````
npx prisma db seed
````

Running the Application:
1. Start the backend server:
````
cd backend
npm run dev  # For development with nodemon
# or
npm start    # For production
````

API Endpoints:

Authentication
* POST /auth/register: Register a new user.
* POST /auth/login: Login and receive JWT token.

Posts (Public)
* GET /posts: Get all published posts.
* GET /posts/:id: Get a specific published post by ID.

Admin Posts (Requires JWT and ADMIN role)
* POST /admin/new: Create a new post.
* GET /admin/posts: Get all posts (including drafts).
* GET /admin/posts/:id: Get a specific post by ID.
* PUT /admin/posts/:id: Update a post.
* PATCH /admin/posts/:id/publish: Publish a post.
* PATCH /admin/posts/:id/unpublish: Unpublish a post.
* DELETE /admin/posts/:id: Delete a post.

Comments
* POST /comments: Create a new comment (optional auth).
* GET /comments/:postId: Get comments for a post.
* PUT /comments/edit/:id: Edit a comment (author or admin).
* DELETE /comments/delete/:id: Delete a comment (author or admin).

Frontend Pages:
1. index.html: Home page displaying published posts.
2. login.html: User login form.
3. register.html: User registration form.
4. admin.html: Admin dashboard for managing posts and comments.
5. post.html: View a single post and its comments.
6. postForm.html: Form to create a new post (admin only).
7. editPost.html: Form to edit an existing post (admin only).

Authentication:
* Users log in to receive a JWT token stored in localStorage.
* Protected routes require the Authorization: Bearer <token> header.
* Admins have additional permissions for post management.
* Comments can be made anonymously or by authenticated users.

Usage:
1. Visit the home page to view published posts.
2. Register or log in to access more features.
3. As an admin, access the admin dashboard to create and manage posts.
4. Users can comment on posts; authenticated users can edit/delete their comments.

Contributing:
1. Fork the repository.
2. Create a feature branch.
3. Make changes and test.
4. Submit a pull request.

License
This project is licensed under the ISC License. See the LICENSE file for details.