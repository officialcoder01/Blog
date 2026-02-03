import { API_BASE_URL } from './api.js';
import { getIdentity } from './auth.js';
const postsContainer = document.getElementById('posts-container');
const authNav = document.getElementById('auth-nav');

// Check if user is logged in
const identity = await getIdentity();
if (identity.isAuthenticated) {
    const user = identity.user;
    let navHTML = '<button id="logout-btn">Logout</button>';
    if (user && user.role === 'ADMIN') {
        navHTML = '<a href="admin.html"><button>Admin Dashboard</button></a> <a href="postForm.html"><button>Create Post</button></a> ' + navHTML;
    }
    authNav.innerHTML = navHTML;
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        location.reload();
    });
} else {
    authNav.innerHTML = '<a href="register.html"><button>Sign Up</button></a> <a href="login.html"><button>Sign In</button></a>';
}

// Fetch and display published posts
async function loadPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const posts = await response.json();
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>No published posts available.</p>';
        } else {
            posts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.innerHTML = `
                            <h2><a href="post.html?id=${post.id}">${post.title}</a></h2>
                            <p>${post.content.substring(0, 200)}...</p>
                            <small>By ${post.author.username}</small><br/>
                            <small>Published on ${new Date(post.createdAt).toLocaleDateString()}</small>
                        `;
                postsContainer.appendChild(postDiv);
            });
        }
    } catch (error) {
        console.error(error);
        postsContainer.innerHTML = '<p>Failed to load posts.</p>';
    }
}

loadPosts();