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

//save note to localStorage and clear the draft. When the user clicks the "Save Note" button, this function checks if there is any content to save. If there is, it creates a new note object with a unique ID, title, body, and timestamp. It then retrieves the existing notes from localStorage, adds the new note to the beginning of the list, and saves it back to localStorage. Finally, it clears the draft and redirects the user to the dashboard.
function saveNote() {
  if (!hasContent()) {
    setStatus('Nothing to save');
    return;
  }

  const payload = getDraftPayload();
  const note = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}`,
    title: payload.title || 'Untitled note',
    body: payload.body,
    updatedAt: new Date().toISOString(),
  };

  const existing = localStorage.getItem(NOTES_KEY);
  const notes = existing ? JSON.parse(existing) : [];
  notes.unshift(note);
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

loadDraft();
