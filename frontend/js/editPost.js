const editForm = document.getElementById('edit-post-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const publishedInput = document.getElementById('published');
const logoutBtn = document.getElementById('logout-btn');

// Logout functionality
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// Get token
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
}

// Get post ID from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
    alert('No post ID provided');
    window.location.href = 'admin.html';
}

// Load post data
async function loadPost() {
    try {
        const response = await fetch(`http://localhost:3000/admin/posts/${postId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch post');
        const post = await response.json();
        titleInput.value = post.title;
        contentInput.value = post.content;
        publishedInput.checked = post.published;
    } catch (error) {
        console.error(error);
        alert('Failed to load post');
        window.location.href = 'admin.html';
    }
}

// Handle form submission
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const published = publishedInput.checked;

    if (!title || !content) {
        alert('Title and content are required');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/admin/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content, published })
        });
        if (response.ok) {
            alert('Post updated successfully');
            window.location.href = 'admin.html';
        } else {
            alert('Failed to update post');
        }
    } catch (error) {
        console.error(error);
        alert('Failed to update post');
    }
});

// Load post on page load
loadPost();