// Get the login form element from the HTML using its id
const form = document.getElementById('loginForm');

// Get the email input field
const emailInput = document.getElementById('email');

// Get the password input field
const passwordInput = document.getElementById('password');

// Get the submit button inside the form
// This allows us to disable it later to prevent double submission
const submitBtn = form.querySelector('button');

// Listen for when the form is submitted
form.addEventListener('submit', function (e) {
  // Prevent the browser's default behavior
  // (which is reloading the page on form submit)
  e.preventDefault();

  // If the button is already disabled,
  // it means the form is already being processed
  // so we stop here to avoid double submission
  if (submitBtn.disabled) return;

  // Read the values entered by the user
  // .trim() removes spaces from the beginning and end
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Regular expression to check if email format is valid
  // Example: test@email.com ✔️
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // -------- VALIDATION STARTS HERE --------

  // Check if email field is empty
  if (!email) {
    alert('Email is required');
    return; // stop execution if invalid
  }

  // Check if email matches standard email format
  if (!emailRegex.test(email)) {
    alert('Enter a valid email address');
    return;
  }

  // Check if password field is empty
  if (!password) {
    alert('Password is required');
    return;
  }

  // Enforce minimum password length
  if (password.length < 8) {
    alert('Password must be at least 8 characters');
    return;
  }

  // -------- VALIDATION PASSED --------

  // Disable the submit button to prevent multiple clicks
  submitBtn.disabled = true;

  // Give visual feedback to the user
  submitBtn.textContent = 'Logging in...';

  // TEMPORARY STEP:
  // This simulates successful validation before backend exists
  // Later, this is where an API request will be made
  console.log('Validated input:', { email, password });

  // TEMPORARY REDIRECT:
  // Since we assume login is successful,
  // redirect the user to the dashboard page
  window.location.href = 'dashboard.html';
});
