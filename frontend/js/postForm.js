import { API_BASE_URL } from './api.js';
const authNav = document.getElementById('auth-nav');
const postForm = document.getElementById('post-form');

// Function to decode JWT payload
function decodeJWT(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

// Check if user is logged in and is admin
const token = localStorage.getItem('token');
if (token) {
    const user = decodeJWT(token);
    if (user && user.role === 'ADMIN') {
        let navHTML = '<a href="admin.html"><button>Admin Dashboard</button></a> <button id="logout-btn">Logout</button>';
        authNav.innerHTML = navHTML;
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    } else {
        // Not admin, redirect
        window.location.href = 'index.html';
    }
} else {
    // Not logged in, redirect to login
    window.location.href = 'login.html';
}

// Handle form submission
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const action = e.submitter.value; // 'draft' or 'publish'
    const published = action === 'publish';

    try {
        const response = await fetch(`http://${API_BASE_URL}/admin/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content, published })
        });
        if (response.ok) {
            alert(`Post ${published ? 'published' : 'saved as draft'} successfully!`);
            window.location.href = 'admin.html';
        } else {
            const error = await response.json();
            alert('Error: ' + error.message);
        }
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post.');
    }
});