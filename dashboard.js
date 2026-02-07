// Controls the mobile menu toggle for the hamburger and close icons for smaller screens in the dashboard header.
const mobileMenu = document.querySelector('.user-actions');

function showMenu() {
  mobileMenu.classList.add('active');
}

function hideMenu() {
  mobileMenu.classList.remove('active');
}

//when user clicks the "New Note" button, they are redirected to the new-note.html page where they can create a new note. This is done by adding a click event listener to the floating action button (FAB) that changes the window location to the new-note.html page.
document.querySelector('.fab').addEventListener('click', () => {
  window.location.href = 'new-note.html';
});

//object to hold the notes data for the dashboard, which will be rendered dynamically in the HTML.
const notes = [
  {
    title: 'Project Alpha Brainstorming',
    body: 'Key objectives for Q3 include refining the user onboarding flow...',
    updatedAt: 'Updated 2 hours ago',
  },
  {
    title: 'Grocery List',
    body: 'Milk (Oat) - Eggs - Spinach - Avocados - Chicken breast - Brown rice - Coffee beans (medium roast',
    updatedAt: 'Updated yesterday',
  },
  {
    title: 'Meeting Notes : Design Review',
    body: 'Attendees: Sarah, Mike, Jessica. Feedback on the new dashboard layout was generally positive...',
    updatedAt: 'Updated Oct 24, 2023',
  },
  {
    title: 'Book Recommendations',
    body: '"Atomic Habits" by James Clear "Deep Work" by Cal Newport "The Design of Everyday Things" by Don Norman "Refactoring UI" by Adam Wathan &amp; Steve Schoger',
    updatedAt: 'Updated Oct 12, 2023',
  },
];

//HTML element where the notes will be displayed on the dashboard.
// Selects the container element where the notes will be displayed on the dashboard.
const notesGrid = document.querySelector('.notes-grid');

//DOM manipulation to render the notes on the dashboard by iterating over the notes array and creating a note card for each note, appending it to the notes grid.
// Iterates over the notes array and creates a note card for each note, appending it to the notes grid.
function createNoteCard(note) {
  // Create elements
  const card = document.createElement('div');
  const title = document.createElement('h3');
  const body = document.createElement('p');
  const footer = document.createElement('div');
  const time = document.createElement('span');

  // Add classes to style the note card and its components using CSS. These classes will be defined in the CSS file to give the note cards a consistent appearance.
  card.classList.add('note-card');
  title.classList.add('note-title');
  body.classList.add('note-body');
  footer.classList.add('note-footer');

  // Insert content
  title.textContent = note.title;
  body.textContent = note.body;
  time.textContent = note.updatedAt;

  // Build structure: putting element inside each other to create the note card structure. The title and body are added to the card, and the time is added to the footer, which is then added to the card.
  footer.appendChild(time);
  card.appendChild(title);
  card.appendChild(body);
  card.appendChild(footer);

  return card;
}

//renders the notes on the dashboard by iterating over the notes array and creating a note card for each note, appending it to the notes grid.
notes.forEach((note) => {
  const noteCard = createNoteCard(note);
  notesGrid.appendChild(noteCard);
});
