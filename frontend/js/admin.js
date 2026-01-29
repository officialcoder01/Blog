import { API_BASE_URL } from './api.js';
const postsContainer = document.getElementById('posts-container');
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

// Function to load all posts
async function loadPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/posts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch posts');
        const posts = await response.json();
        postsContainer.innerHTML = '';
        for (const post of posts) {
            const postDiv = document.createElement('div');
            postDiv.className = 'admin-post';
            const status = post.published ? 'Published' : 'Draft';
            const publishBtn = post.published ?
                `<button class="unpublish-btn" data-id="${post.id}">Unpublish</button>` :
                `<button class="publish-btn" data-id="${post.id}">Publish</button>`;
            postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>Status: ${status}</p>
                <p>By ${post.author.username} on ${new Date(post.createdAt).toLocaleDateString()}</p>
                <div class="post-actions">
                    ${publishBtn}
                    <button class="edit-btn" data-id="${post.id}">Edit</button>
                    <button class="delete-btn" data-id="${post.id}">Delete</button>
                </div>
                <div class="comments-section">
                    <!-- Comments will be loaded here -->
                </div>
            `;
            postsContainer.appendChild(postDiv);
            loadCommentsForPost(post.comments, postDiv.querySelector('.comments-section'));
        }
        // Add event listeners
        document.querySelectorAll('.publish-btn').forEach(btn => {
            btn.addEventListener('click', (e) => publishPost(e.target.dataset.id));
        });
        document.querySelectorAll('.unpublish-btn').forEach(btn => {
            btn.addEventListener('click', (e) => unpublishPost(e.target.dataset.id));
        });
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => editPost(e.target.dataset.id));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => deletePost(e.target.dataset.id));
        });
    } catch (error) {
        console.error(error);
        postsContainer.innerHTML = '<p>Failed to load posts.</p>';
    }
}

// Function to load comments for a post
function loadCommentsForPost(comments, commentsDiv) {
    if (comments.length === 0) {
        commentsDiv.innerHTML = '<p>No comments.</p>';
    } else {
        commentsDiv.innerHTML = '<h4>Comments:</h4>';
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'admin-comment';
            const authorName = comment.author ? comment.author.username : 'Anonymous';
            commentDiv.innerHTML = `
                <p><strong>${authorName}</strong>: ${comment.content}</p>
                <small>${new Date(comment.createdAt).toLocaleDateString()}</small>
                <div class="comment-actions">
                    <button class="edit-comment-btn" data-id="${comment.id}">Edit</button>
                    <button class="delete-comment-btn" data-id="${comment.id}">Delete</button>
                </div>
            `;
            commentsDiv.appendChild(commentDiv);
        });
    }
    // Add event listeners for comments
    document.querySelectorAll('.edit-comment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => editComment(e.target.dataset.id));
    });
    document.querySelectorAll('.delete-comment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => deleteComment(e.target.dataset.id));
    });
}

// Function to publish a post
async function publishPost(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}/publish`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            loadPosts(); // Reload posts
        } else {
            alert('Failed to publish post');
        }
    } catch (error) {
        console.error(error);
        alert('Failed to publish post');
    }
}

// Function to unpublish a post
async function unpublishPost(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}/unpublish`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            loadPosts(); // Reload posts
        } else {
            alert('Failed to unpublish post');
        }
    } catch (error) {
        console.error(error);
        alert('Failed to unpublish post');
    }
}

// Function to delete a post
async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            loadPosts(); // Reload posts
        } else {
            alert('Failed to delete post');
        }
    } catch (error) {
        console.error(error);
        alert('Failed to delete post');
    }
}

// Function to edit a post (redirect to edit page)
function editPost(postId) {
    window.location.href = `editPost.html?id=${postId}`;
}

// Function to edit a comment
async function editComment(commentId) {
    const editBtn = document.querySelector(`.edit-comment-btn[data-id="${commentId}"]`);
    if (!editBtn) return;
    const commentDiv = editBtn.closest('.admin-comment');
    if (!commentDiv) return;
    // Prevent duplicate edit forms
    if (commentDiv.querySelector('.edit-comment-form')) return;

    // Extract existing comment content (strip author prefix if present)
    let existingContent = '';
    const p = commentDiv.querySelector('p');
    if (p) {
        const text = p.innerText || '';
        const idx = text.indexOf(':');
        existingContent = idx !== -1 ? text.slice(idx + 1).trim() : text.trim();
    }

    // Create inline edit form
    const formDiv = document.createElement('div');
    formDiv.className = 'edit-comment-form';
    formDiv.innerHTML = `\
        <textarea class="edit-comment-textarea" rows="3" style="width:100%"></textarea>\
        <div class="edit-comment-actions">\
            <button class="save-edit-comment-btn">Save</button>\
            <button class="cancel-edit-comment-btn">Cancel</button>\
        </div>`;
    commentDiv.appendChild(formDiv);
    const textarea = formDiv.querySelector('.edit-comment-textarea');
    textarea.value = existingContent;

    // Cancel handler
    formDiv.querySelector('.cancel-edit-comment-btn').addEventListener('click', () => {
        formDiv.remove();
    });

    // Save handler
    formDiv.querySelector('.save-edit-comment-btn').addEventListener('click', async () => {
        const newContent = textarea.value.trim();
        if (!newContent) return alert('Comment cannot be empty');
        try {
            const response = await fetch(`${API_BASE_URL}/comments/edit/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newContent })
            });
            if (response.ok) {
                loadPosts(); // Reload to show updated comment
            } else {
                alert('Failed to edit comment');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to edit comment');
        }
    });
}

// Function to delete a comment
async function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/comments/delete/${commentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            loadPosts(); // Reload to remove deleted comment
        } else {
            alert('Failed to delete comment');
        }
    } catch (error) {
        console.error(error);
        alert('Failed to delete comment');
    }
}

// Load posts on page load
loadPosts();