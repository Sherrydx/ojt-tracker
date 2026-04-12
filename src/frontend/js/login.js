// Initialize theme
function initTheme() {
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
        document.documentElement.classList.add('dark');
        updateThemeButton('light');
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeButton('dark');
    }
}

// Update theme button emoji
function updateThemeButton(nextTheme) {
    const btn = document.getElementById('themeToggle');
    btn.innerHTML = nextTheme === 'dark' 
        ? '<span class="text-xl">🌙</span>' 
        : '<span class="text-xl">☀️</span>';
}

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateThemeButton('dark');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateThemeButton('light');
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Clear previous errors
    emailError.textContent = '';
    passwordError.textContent = '';
    emailError.classList.add('hidden');
    passwordError.classList.add('hidden');

    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.classList.remove('hidden');
        isValid = false;
    }
    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        passwordError.classList.remove('hidden');
        isValid = false;
    }

    if (!isValid) return;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            // Comment out alerts for auto-redirect
            // alert('Login successful! Welcome, ' + (data?.user?.email || email));
            window.location.href = 'index.html';
        } else {
            if (Array.isArray(data.detail)) {
                passwordError.textContent = data.detail.map(item => item.msg || JSON.stringify(item)).join(' | ');
            } else {
                passwordError.textContent = data.detail || 'Login failed';
            }
            passwordError.classList.remove('hidden');
        }
    } catch (error) {
        passwordError.textContent = 'An error occurred. Please try again.';
        passwordError.classList.remove('hidden');
    }
});

// Password visibility toggle
document.getElementById('passwordToggle').addEventListener('click', (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById('password');
    const toggle = e.currentTarget;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggle.innerHTML = '🙈';
    } else {
        passwordInput.type = 'password';
        toggle.innerHTML = '👁️';
    }
});


// Initialize on load
initTheme();