// Registration Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is already logged in
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    window.location.href = 'dashboard.html';
    return;
  }

  setupRegistrationForm();
  setupPasswordToggles();
  setupSocialButtons();
});

function setupRegistrationForm() {
  const registerForm = document.getElementById('registerForm');
  const registerBtn = document.querySelector('.login-btn');
    
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
        
    // Get form data
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
        
    // Validation
    if (!validateForm(firstName, lastName, email, password, confirmPassword, role, agreeTerms)) {
      return;
    }
        
    // Show loading state
    registerBtn.classList.add('loading');
    registerBtn.innerHTML = '<span>Creating Account...</span>';
        
    // Simulate registration (in real app, this would be an API call)
    setTimeout(() => {
      if (registerUser(firstName, lastName, email, password, role)) {
        showSuccess('Account created successfully! Redirecting to login...');
                
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      } else {
        showError('Registration failed. Email might already be registered.');
        registerBtn.classList.remove('loading');
        registerBtn.innerHTML = '<span>Create Account</span><i class="fas fa-user-plus"></i>';
      }
    }, 1500);
  });
}

function validateForm(firstName, lastName, email, password, confirmPassword, role, agreeTerms) {
  // Check if all fields are filled
  if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
    showError('Please fill in all required fields.');
    return false;
  }
    
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('Please enter a valid email address.');
    return false;
  }
    
  // Validate password strength
  if (password.length < 6) {
    showError('Password must be at least 6 characters long.');
    return false;
  }
    
  // Check if passwords match
  if (password !== confirmPassword) {
    showError('Passwords do not match.');
    return false;
  }
    
  // Check terms agreement
  if (!agreeTerms) {
    showError('Please agree to the Terms and Conditions.');
    return false;
  }
    
  return true;
}

function registerUser(firstName, lastName, email, password, role) {
  // Get existing users from localStorage
  const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    
  // Check if email already exists
  const emailExists = existingUsers.some(user => user.email === email);
  if (emailExists) {
    return false;
  }
    
  // Create new user
  const newUser = {
    id: generateUserId(),
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password, // In real app, this should be hashed
    role: role,
    createdAt: new Date().toISOString(),
    isActive: true
  };
    
  // Add user to storage
  existingUsers.push(newUser);
  localStorage.setItem('users', JSON.stringify(existingUsers));
    
  return true;
}

function setupPasswordToggles() {
  // Password toggle
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
    
  togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
        
    const icon = togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
    
  // Confirm password toggle
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
    
  toggleConfirmPassword.addEventListener('click', function() {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
        
    const icon = toggleConfirmPassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
}

function setupSocialButtons() {
  // Google registration
  document.querySelector('.social-btn.google').addEventListener('click', function() {
    showNotification('Google registration functionality would be implemented here.');
  });
    
  // Facebook registration
  document.querySelector('.social-btn.facebook').addEventListener('click', function() {
    showNotification('Facebook registration functionality would be implemented here.');
  });
}

function generateUserId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
  const form = document.getElementById('registerForm');
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

function showSuccess(message) {
  // Remove existing messages
  const existingMessage = document.querySelector('.success-message');
  if (existingMessage) {
    existingMessage.remove();
  }
    
  // Create success message element
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message show';
  successDiv.textContent = message;
  successDiv.style.cssText = `
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
  // Insert after the form
  const form = document.getElementById('registerForm');
  form.parentNode.insertBefore(successDiv, form.nextSibling);
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
    
    .success-message {
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style); 