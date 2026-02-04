// Controls the mobile menu toggle for the hamburger and close icons.
const mobileMenu = document.querySelector('.user-actions');

function showMenu() {
  mobileMenu.classList.add('active');
}

function hideMenu() {
  mobileMenu.classList.remove('active');
}
