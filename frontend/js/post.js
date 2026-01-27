import { API_BASE_URL } from './api.js';
const postContainer = document.getElementById('post-container');
const authNav = document.getElementById('auth-nav');
const commentsContainer = document.getElementById('comments-container');
const commentForm = document.getElementById('comment-form');
const commentContent = document.getElementById('comment-content');
const submitCommentBtn = document.getElementById('submit-comment');

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

// Check if user is logged in
const token = localStorage.getItem('token');
let user = null;
if (token) {
    user = decodeJWT(token);
    let navHTML = '<a href="index.html"><button>Go Back Home</button></a> <button id="logout-btn">Logout</button>';
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

// Get post ID from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
    postContainer.innerHTML = '<p>Post not found.</p>';
} else {
    // Fetch and display the post
    async function loadPost() {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
            if (!response.ok) throw new Error('Failed to fetch post');
            const post = await response.json();
            postContainer.innerHTML = `
                        <article class="post">
                            <h2>${post.title}</h2>
                            <p>${post.content}</p>
                            <small>By ${post.author.username}</small><br/>
                            <small>Published on ${new Date(post.createdAt).toLocaleDateString()}</small><br/>
                            <small>Last Updated ${new Date(post.updatedAt).toLocaleDateString()}</small>
                        </article>
                    `;
        } catch (error) {
            console.error(error);
            postContainer.innerHTML = '<p>Failed to load post.</p>';
        }
    }

    // Fetch and display comments
    async function loadComments() {
        try {
            const response = await fetch(`${API_BASE_URL}/comments/${postId}`);
            if (!response.ok) throw new Error('Failed to fetch comments');
            const comments = await response.json();
            if (comments.length === 0) {
                commentsContainer.innerHTML = '<p>No comments yet.</p>';
            } else {
                commentsContainer.innerHTML = '<h3>Comments</h3>';
                comments.forEach(comment => {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment';
                    const authorName = comment.author ? comment.author.username : 'Anonymous';
                    let buttonsHTML = '';
                    if (token && user && comment.authorId === user.id) {
                        buttonsHTML = `
                            <button class="edit-comment-btn" data-comment-id="${comment.id}">Edit</button>
                            <button class="delete-comment-btn" data-comment-id="${comment.id}">Delete</button>
                        `;
                    }
                    commentDiv.innerHTML = `
                        <p><strong>${authorName}</strong> said:</p>
                        <p class="comment-content" data-comment-id="${comment.id}">${comment.content}</p>
                        <small>Posted on ${new Date(comment.createdAt).toLocaleDateString()}</small>
                        ${buttonsHTML}
                    `;
                    commentsContainer.appendChild(commentDiv);
                });

                // Add event listeners for edit and delete buttons
                document.querySelectorAll('.edit-comment-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => startEditComment(e.target.dataset.commentId));
                });
                document.querySelectorAll('.delete-comment-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => deleteComment(e.target.dataset.commentId));
                });
            }
        } catch (error) {
            console.error(error);
            commentsContainer.innerHTML = '<p>Failed to load comments.</p>';
        }
    }

    // Function to start editing a comment
    function startEditComment(commentId) {
        const commentContentP = document.querySelector(`.comment-content[data-comment-id="${commentId}"]`);
        const originalContent = commentContentP.textContent;
        const commentDiv = commentContentP.closest('.comment');

        // Replace content with input
        commentContentP.innerHTML = `<input type="text" value="${originalContent}" class="edit-input" data-comment-id="${commentId}"> <button class="save-edit-btn" data-comment-id="${commentId}">Save</button> <button class="cancel-edit-btn" data-comment-id="${commentId}">Cancel</button>`;

        // Add event listeners
        document.querySelector(`.save-edit-btn[data-comment-id="${commentId}"]`).addEventListener('click', () => saveEditComment(commentId));
        document.querySelector(`.cancel-edit-btn[data-comment-id="${commentId}"]`).addEventListener('click', () => cancelEditComment(commentId, originalContent));
    }

    // Function to save edited comment
    async function saveEditComment(commentId) {
        const input = document.querySelector(`.edit-input[data-comment-id="${commentId}"]`);
        const newContent = input.value.trim();
        if (!newContent) {
            alert('Comment cannot be empty.');
            return;
        }

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
                loadComments(); // Reload comments
            } else {
                const error = await response.json();
                alert('Failed to edit comment: ' + (error.message || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert('Failed to edit comment.');
        }
    }

    // Function to cancel editing
    function cancelEditComment(commentId, originalContent) {
        const commentContentP = document.querySelector(`.comment-content[data-comment-id="${commentId}"]`);
        commentContentP.innerHTML = originalContent;
    }

    // Function to delete a comment
    async function deleteComment(commentId) {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/comments/delete/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadComments(); // Reload comments
            } else {
                const error = await response.json();
                alert('Failed to delete comment: ' + (error.message || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert('Failed to delete comment.');
        }
    }
    async function submitComment() {
        const content = commentContent.value.trim();
        if (!content) {
            alert('Comment cannot be empty.');
            return;
        }

        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/comments`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ content, postId: parseInt(postId) })
            });

            if (response.ok) {
                commentContent.value = '';
                loadComments(); // Reload comments
            } else {
                const error = await response.json();
                alert('Failed to submit comment: ' + (error.message || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit comment.');
        }
    }

    submitCommentBtn.addEventListener('click', submitComment);

    loadPost();
    loadComments();
}