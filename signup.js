// Get the signup form element
const form = document.getElementById('signupForm');

// Get all input fields
const nameInput = document.getElementById('name');
const dobInput = document.getElementById('dob');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

// Get the submit button inside the form
const submitBtn = form.querySelector('button');

// Email format validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//
// -------- UTILITY FUNCTIONS --------
// These are helper functions reused in validation
//

// Display an error message for a specific input
function showError(input, message) {
  // Assumes the error <small> or <span> is right after the input
  const error = input.nextElementSibling;
  error.textContent = message;

  // Add error styling to input
  input.classList.add('input-error');
}

// Remove error message and styling
function clearError(input) {
  const error = input.nextElementSibling;
  error.textContent = '';
  input.classList.remove('input-error');
}

// Calculate user's age based on date of birth
function getAge(dateString) {
  const today = new Date();
  const birthDate = new Date(dateString);

  let age = today.getFullYear() - birthDate.getFullYear();

  const m = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn’t occurred this year
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// Check if there are any validation errors on the form
function checkFormValidity() {
  const errors = document.querySelectorAll('.error');

  // If any error message has text, the form is invalid
  const hasError = [...errors].some((err) => err.textContent !== '');

  // Disable submit button if there is any error
  submitBtn.disabled = hasError;
}

//
// -------- FIELD VALIDATIONS --------
//

// Validate name field
function validateName() {
  const name = nameInput.value.trim();

  if (name.length < 2) {
    showError(nameInput, 'Name must be at least 2 characters');
  } else {
    clearError(nameInput);
  }
}

// Validate date of birth
function validateDOB() {
  if (!dobInput.value) {
    showError(dobInput, 'Date of birth is required');
    return;
  }

  const age = getAge(dobInput.value);

  if (age < 13) {
    showError(dobInput, 'You must be at least 13 years old');
  } else {
    clearError(dobInput);
  }
}

// Validate email field
function validateEmail() {
  const email = emailInput.value.trim();

  if (!email) {
    showError(emailInput, 'Email is required');
  } else if (!emailRegex.test(email)) {
    showError(emailInput, 'Enter a valid email address');
  } else {
    clearError(emailInput);
  }
}

// Validate password strength
function validatePassword() {
  const password = passwordInput.value.trim();

  if (password.length < 8) {
    showError(passwordInput, 'Password must be at least 8 characters');
  } else {
    clearError(passwordInput);
  }
}

// Ensure password and confirm password match
function validateConfirmPassword() {
  if (confirmPasswordInput.value !== passwordInput.value) {
    showError(confirmPasswordInput, 'Passwords do not match');
  } else {
    clearError(confirmPasswordInput);
  }
}

//
// -------- LIVE VALIDATION --------
// Runs as the user types
//

nameInput.addEventListener('input', () => {
  validateName();
  checkFormValidity();
});

dobInput.addEventListener('change', () => {
  validateDOB();
  checkFormValidity();
});

emailInput.addEventListener('input', () => {
  validateEmail();
  checkFormValidity();
});

passwordInput.addEventListener('input', () => {
  validatePassword();
  validateConfirmPassword();
  checkFormValidity();
});

confirmPasswordInput.addEventListener('input', () => {
  validateConfirmPassword();
  checkFormValidity();
});

//
// -------- FORM SUBMISSION --------
//

// Flag to prevent multiple submissions
let isSubmitting = false;

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Stop if already submitting
  if (isSubmitting) return;

  // Run all validations one final time
  validateName();
  validateDOB();
  validateEmail();
  validatePassword();
  validateConfirmPassword();
  checkFormValidity();

  // Stop if form is still invalid
  if (submitBtn.disabled) return;

  // Lock the form
  isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating account...';

  // Collect user data into one object
  const userData = {
    name: nameInput.value.trim(),
    dob: dobInput.value,
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
  };

  // TEMPORARY FLOW:
  // Signup successful → redirect to login page
  window.location.href = 'login.html';

  // Later:
  // This is where the API call will be made
  console.log('Signup data ready:', userData);
});
