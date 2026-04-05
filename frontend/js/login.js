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
    btn.innerHTML = nextTheme === 'dark' ? '🌙' : '☀️';
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

// Form validation
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    let isValid = true;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.classList.remove('hidden');
        isValid = false;
    } else {
        emailError.classList.add('hidden');
    }
    
    // Password validation
    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        passwordError.classList.remove('hidden');
        isValid = false;
    } else {
        passwordError.classList.add('hidden');
    }
    
    if (isValid) {
        //console.log('Form submitted:', { email, password });
        //alert('Login attempt - Ready for Supabase integration!');
    }
});

// Form validation
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Redirect to dashboard immediately
    window.location.href = 'index.html';
});

// Initialize on load
initTheme();