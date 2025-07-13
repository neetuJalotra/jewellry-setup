// Login Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is already logged in
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    window.location.href = 'dashboard.html';
    return;
  }

  setupLoginForm();
  setupPasswordToggle();
  setupSocialButtons();
});

function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.querySelector('.login-btn');
    
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
        
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
        
    // Show loading state
    loginBtn.classList.add('loading');
    loginBtn.innerHTML = '<span>Signing In...</span>';
        
    // Authenticate user
    setTimeout(() => {
      const user = authenticateUser(email, password);
      if (user) {
        // Store user data
        const userData = {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          loginTime: new Date().toISOString()
        };
                
        localStorage.setItem('currentUser', JSON.stringify(userData));
                
        if (remember) {
          localStorage.setItem('rememberMe', 'true');
        }
                
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      } else {
        showError('Invalid email or password. Please try again.');
        loginBtn.classList.remove('loading');
        loginBtn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
      }
    }, 1500);
  });
}

function setupPasswordToggle() {
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
    
  togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
        
    const icon = togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
}

function setupSocialButtons() {
  // Google login
  document.querySelector('.social-btn.google').addEventListener('click', function() {
    showNotification('Google login functionality would be implemented here.');
  });
    
  // Facebook login
  document.querySelector('.social-btn.facebook').addEventListener('click', function() {
    showNotification('Facebook login functionality would be implemented here.');
  });
}

function authenticateUser(email, password) {
  // Get registered users from localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];
    
  // Find user with matching email and password
  const user = users.find(u => u.email === email && u.password === password && u.isActive);
    
  return user || null;
}

function showError(message) {
  // Remove existing error messages
  const existingError = document.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
    
  // Create error message element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message show';
  errorDiv.textContent = message;
    
  // Insert after the form
  const form = document.getElementById('loginForm');
  form.parentNode.insertBefore(errorDiv, form.nextSibling);
    
  // Remove error after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.classList.remove('show');
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv);
        }
      }, 300);
    }
  }, 5000);
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: #17a2b8;
        color: white;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
  document.body.appendChild(notification);
    
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 