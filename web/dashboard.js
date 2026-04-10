// Controls opening and closing the mobile actions menu from the header icons.
const mobileMenu = document.querySelector('.user-actions');

function showMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add('active');
}

function hideMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('active');
}

// Central key for all saved notes so dashboard and editor stay in sync.
const NOTES_KEY = 'notesphere_notes_v1';

// Dashboard container where note cards are rendered.
const notesGrid = document.querySelector('.notes-grid');

// In-memory state used for instant UI updates after delete operations.
let notes = [];
let deleteModalState = null;

// Reads notes from localStorage and safely falls back to an empty array if data is missing or invalid.
function loadNotesFromStorage() {
  const stored = localStorage.getItem(NOTES_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    localStorage.removeItem(NOTES_KEY);
    return [];
  }
}

// Persists the current notes state so delete changes survive page reloads.
function persistNotes() {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// Lazily creates and caches the custom delete confirmation modal.
function ensureDeleteModal() {
  if (deleteModalState) return deleteModalState;

  const overlay = document.createElement('div');
  const panel = document.createElement('div');
  const title = document.createElement('h3');
  const message = document.createElement('p');
  const actions = document.createElement('div');
  const cancelBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');

  overlay.classList.add('confirm-modal-overlay');
  overlay.setAttribute('aria-hidden', 'true');
  panel.classList.add('confirm-modal');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');

  title.classList.add('confirm-modal-title');
  title.textContent = 'Delete note?';
  message.classList.add('confirm-modal-message');

  actions.classList.add('confirm-modal-actions');
  cancelBtn.classList.add('confirm-modal-cancel');
  deleteBtn.classList.add('confirm-modal-delete');
  cancelBtn.type = 'button';
  deleteBtn.type = 'button';
  cancelBtn.textContent = 'Cancel';
  deleteBtn.textContent = 'Delete';

  actions.appendChild(cancelBtn);
  actions.appendChild(deleteBtn);
  panel.appendChild(title);
  panel.appendChild(message);
  panel.appendChild(actions);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  deleteModalState = {
    overlay,
    message,
    cancelBtn,
    deleteBtn,
    resolve: null,
    onKeydown: null,
  };

  return deleteModalState;
}

// Opens the custom confirmation modal and resolves with the user's choice.
function confirmDeleteNote(noteLabel) {
  return new Promise((resolve) => {
    const modal = ensureDeleteModal();
    modal.resolve = resolve;

    modal.message.textContent = `Delete "${noteLabel}"? This action cannot be undone.`;
    modal.overlay.classList.add('is-open');
    modal.overlay.setAttribute('aria-hidden', 'false');

    const closeModal = (result) => {
      modal.overlay.classList.remove('is-open');
      modal.overlay.setAttribute('aria-hidden', 'true');
      if (modal.onKeydown) {
        document.removeEventListener('keydown', modal.onKeydown);
        modal.onKeydown = null;
      }
      if (modal.resolve) {
        const currentResolve = modal.resolve;
        modal.resolve = null;
        currentResolve(result);
      }
    };

    modal.cancelBtn.onclick = () => closeModal(false);
    modal.deleteBtn.onclick = () => closeModal(true);
    modal.overlay.onclick = (event) => {
      if (event.target === modal.overlay) {
        closeModal(false);
      }
    };
    modal.onKeydown = (event) => {
      if (event.key === 'Escape') {
        closeModal(false);
      }
    };
    document.addEventListener('keydown', modal.onKeydown);
    modal.cancelBtn.focus();
  });
}

// Deletes one note by id from the in-memory array and then writes the new array back to localStorage.
function deleteNoteById(noteId) {
  const targetIndex = notes.findIndex((note) => note.id === noteId);
  if (targetIndex === -1) return false;

  notes.splice(targetIndex, 1);
  persistNotes();
  return true;
}

// Shows a short placeholder message when there are no notes left to display.
function renderEmptyState() {
  const emptyMessage = document.createElement('p');
  emptyMessage.classList.add('notes-empty-state');
  emptyMessage.textContent = 'No notes yet. Tap "New Note" to create one.';
  notesGrid.appendChild(emptyMessage);
}

// Builds one note card with edit-on-card-click and delete-on-button-click behavior.
function createNoteCard(note) {
  // Create elements for the note card structure
  const card = document.createElement('div');
  const title = document.createElement('h3');
  const body = document.createElement('p');
  const footer = document.createElement('div');
  const time = document.createElement('span');
  const deleteBtn = document.createElement('button');

  //CSS classes for styling the card and its elements
  card.classList.add('note-card');
  title.classList.add('note-title');
  body.classList.add('note-body');
  footer.classList.add('note-footer');
  deleteBtn.classList.add('note-delete-btn');

  // Populate the card with note data and set up delete button and the note data are going from the note object to the card elements.
  title.textContent = note.title;
  body.textContent = note.body;
  time.textContent = note.updatedAt;

  // Delete button action: confirm first, then remove from state/storage, then remove from DOM instantly.
  deleteBtn.type = 'button';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', async (event) => {
    event.stopPropagation();

    const noteLabel = note.title && note.title.trim() ? note.title.trim() : 'this note';
    const shouldDelete = await confirmDeleteNote(noteLabel);
    if (!shouldDelete) return;

    const deleted = deleteNoteById(note.id);
    if (!deleted) return;

    card.remove();
    if (notes.length === 0) {
      renderEmptyState();
    }
  });

  footer.appendChild(time);
  footer.appendChild(deleteBtn);
  card.appendChild(title);
  card.appendChild(body);
  card.appendChild(footer);

  // Card click action: open selected note in edit mode.
  card.addEventListener('click', () => {
    localStorage.setItem('editNoteId', note.id);
    window.location.href = 'new-note.html';
  });

  return card;
}

// Renders all cards from current state; safe to call after any mutation.
function renderNotes() {
  notesGrid.innerHTML = '';

  //empty note if you just opened the website
  if (notes.length === 0) {
    renderEmptyState();
    return;
  }

  //create a fragment in the memory
  const fragment = document.createDocumentFragment();
  notes.forEach((note) => {
    fragment.appendChild(createNoteCard(note));
  });
  notesGrid.appendChild(fragment);
}

// Initializes dashboard behaviors after DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
  if (!notesGrid) return;

  const fab = document.querySelector('.fab');
  if (fab) {
    fab.addEventListener('click', () => {
      window.location.href = 'new-note.html';
    });
  }

  notes = loadNotesFromStorage();
  renderNotes();
});
