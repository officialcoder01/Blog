const userName = document.getElementById('username');
const userEmail = document.getElementById('email');
const userPassword = document.getElementById('password');
const userConfirmPassword = document.getElementById('confirmPassword');
const form = document.querySelector('form');

// Registration form submission handler
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (userPassword.value !== userConfirmPassword.value) {
            alert('Passwords do not match');
            return;
        }

        const payload = {
            username: userName.value,
            email: userEmail.value,
            password: userPassword.value,
            confirmPassword: userConfirmPassword.value
        };

        try {
            const res = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                alert('Registration successful! Please log in.');
                window.location.href = './login.html';
                return;
            }

            if (data && data.errors) {
                const msgs = data.errors.map(err => err.msg || err.message).join('\n');
                alert(msgs || 'Registration failed');
                return;
            }

            alert(data.message || 'Registration failed.');
        } catch (err) {
            console.error(err);
            alert('Registration failed. Please try again.');
        }
    });
}

// Login form submission handler
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            email: loginEmail.value,
            password: loginPassword.value
        };
        try {
            const res = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            const token = data.token;
            if (token) {
                localStorage.setItem('token', token);
            }

            if (res.ok) {
                alert('Login successful!');
                window.location.href = './index.html';
                return;
            }
            alert(data.message || 'Login failed.');
        } catch (err) {
            console.error(err);
            alert('Login failed. Please try again.');
        }
    });
}