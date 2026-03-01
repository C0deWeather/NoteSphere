function initNotePage() {
  const editId = localStorage.getItem('editNoteId');
  if (editId) {
    loadNoteForEditing();
  } else {
    loadDraft();
  }
}

// Initialize the note page when the DOM content is loaded. This ensures that all the elements are available before we try to access them. It checks if there is an editNoteId in localStorage to determine if the user is editing an existing note or creating a new one, and loads the appropriate data accordingly.
document.addEventListener('DOMContentLoaded', () => {
  initNotePage();
});

//localStorage Key = Folder name
//Version = Folder version
const DRAFT_KEY = 'notesphere_draft_v1';
const NOTES_KEY = 'notesphere_notes_v1';

const titleInput = document.getElementById('note-title');
const bodyInput = document.getElementById('note-body');
const statusEl = document.getElementById('draft-status');
const timeEl = document.getElementById('draft-time');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');

//draftTimer → controls delayed auto-save
let draftTimer = null;
//lastSavedAt → remembers last save time
let lastSavedAt = null;

//TIME FORMAT HELPER
function nowLabel(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

//BUILDING A DRAFT OBJECT
function getDraftPayload() {
  return {
    title: titleInput.value.trim(),
    body: bodyInput.value.trim(),
    updatedAt: new Date().toISOString(),
  };
}

//CHECK IF THERE IS CONTENT
function hasContent() {
  return titleInput.value.trim().length > 0 || bodyInput.value.trim().length > 0;
}

//If there is no content disable save button
function updateSaveState() {
  saveBtn.disabled = !hasContent();
}

//save draft
function setStatus(message, date = null) {
  statusEl.textContent = message;
  if (date) {
    timeEl.textContent = `• ${nowLabel(date)}`;
  } else {
    timeEl.textContent = '';
  }
}

//don't store empty drafts and update status accordingly
function persistDraft() {
  if (!hasContent()) {
    localStorage.removeItem(DRAFT_KEY);
    setStatus('Draft cleared');
    updateSaveState();
    return;
  }

  const payload = getDraftPayload();
  localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  lastSavedAt = new Date();
  setStatus('Draft saved', lastSavedAt);
  updateSaveState();
}

//This is called debouncing the draft save, so it only saves after the user has stopped typing for a short period (400ms or 0.4secs in this case). If the user types again before that time, the timer resets, preventing unnecessary saves and improving performance.
function scheduleDraftSave() {
  setStatus('Saving...');
  if (draftTimer) {
    window.clearTimeout(draftTimer);
  }
  draftTimer = window.setTimeout(persistDraft, 400);
}

//load draft from localStorage when the page loads. If a draft exists, populate the title and body fields with the saved content. If the draft has an updatedAt timestamp, display it in the status. If the stored draft is corrupted or cannot be parsed, clear it from localStorage and reset the status.
function loadDraft() {
  const stored = localStorage.getItem(DRAFT_KEY);
  if (!stored) {
    updateSaveState();
    return;
  }

  try {
    const draft = JSON.parse(stored);
    titleInput.value = draft.title || '';
    bodyInput.value = draft.body || '';
    if (draft.updatedAt) {
      lastSavedAt = new Date(draft.updatedAt);
      setStatus('Draft restored', lastSavedAt);
    } else {
      setStatus('Draft restored');
    }
  } catch (error) {
    localStorage.removeItem(DRAFT_KEY);
    setStatus('Draft reset');
  }
  updateSaveState();
}

//for editing existing notes, load the note data into the draft when new-note.html is opened with an editNoteId in localStorage. This allows users to edit their existing notes by pre-filling the title and body fields with the note's current content. If the note is not found or there is an error parsing the stored notes, it clears the editNoteId from localStorage to prevent issues.
function loadNoteForEditing() {
  const editId = localStorage.getItem('editNoteId');
  if (!editId) return; // no note to edit

  const storedNotes = localStorage.getItem(NOTES_KEY);
  if (!storedNotes) return;

  const notes = JSON.parse(storedNotes);
  const note = notes.find((n) => n.id === editId);
  if (!note) return;

  // Populate the inputs
  titleInput.value = note.title;
  bodyInput.value = note.body;

  // Remember last saved time
  if (note.updatedAt) {
    lastSavedAt = new Date(note.updatedAt);
    setStatus('Editing note', lastSavedAt);
  }
}

//SAVE NOTE FUNCTION
function saveNote() {
  if (!hasContent()) {
    setStatus('Nothing to save');
    return;
  }

  const payload = getDraftPayload();
  const editId = localStorage.getItem('editNoteId'); // check if editing
  const existing = localStorage.getItem(NOTES_KEY);
  const notes = existing ? JSON.parse(existing) : [];

  if (editId) {
    // ✅ Update existing note
    const index = notes.findIndex((n) => n.id === editId);
    if (index !== -1) {
      notes[index] = { ...notes[index], title: payload.title || 'Untitled note', body: payload.body, updatedAt: new Date().toISOString() };
    }
    localStorage.removeItem('editNoteId');
  } else {
    // ✅ Add new note
    const note = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}`,
      title: payload.title || 'Untitled note',
      body: payload.body,
      updatedAt: new Date().toISOString(),
    };
    notes.unshift(note);
  }

  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  localStorage.removeItem(DRAFT_KEY);
  setStatus('Note saved');
  window.location.href = 'dashboard.html';
}

function cancelNote() {
  if (hasContent()) {
    const shouldDiscard = window.confirm('Discard this note and return to the dashboard?');
    if (!shouldDiscard) {
      return;
    }
  }
  localStorage.removeItem(DRAFT_KEY);
  window.location.href = 'dashboard.html';
}

titleInput.addEventListener('input', scheduleDraftSave);
bodyInput.addEventListener('input', scheduleDraftSave);

saveBtn.addEventListener('click', saveNote);
cancelBtn.addEventListener('click', cancelNote);

//shortcut for saving the note using Ctrl+S or Cmd+S
window.addEventListener('keydown', (event) => {
  const isSave = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
  if (!isSave) return;
  event.preventDefault();
  saveNote();
});
