// ---------- HitroTech Meet: form validation + Jitsi integration ----------

const roomInput = document.getElementById('roomName');
const nameInput = document.getElementById('displayName');
const roomError = document.getElementById('roomNameError');
const nameError = document.getElementById('displayNameError');
const joinBtn = document.getElementById('joinBtn');
const joinBtnText = document.getElementById('joinBtnText');

const ROOM_PATTERN = /^[a-zA-Z0-9-]+$/;
const NAME_PATTERN = /^[a-zA-Z\s'.-]+$/;

// Strip invalid characters from the room name as the user types
// (keeps the field usable without letting Jitsi room URLs break).
roomInput.addEventListener('input', () => {
  const cleaned = roomInput.value.replace(/[^a-zA-Z0-9-]/g, '');
  if (cleaned !== roomInput.value) roomInput.value = cleaned;
  clearError(roomInput, roomError);
});

nameInput.addEventListener('input', () => clearError(nameInput, nameError));

function clearError(input, errorEl) {
  input.classList.remove('invalid');
  errorEl.textContent = '';
}

function setError(input, errorEl, message) {
  input.classList.add('invalid');
  errorEl.textContent = message;
}

function validateRoom(value) {
  if (!value) return 'Room name is required.';
  if (value.length < 3) return 'Room name must be at least 3 characters.';
  if (value.length > 40) return 'Room name must be under 40 characters.';
  if (!ROOM_PATTERN.test(value)) return 'Only letters, numbers, and hyphens are allowed.';
  return '';
}

function validateName(value) {
  if (!value) return 'Please enter your name.';
  if (value.length < 2) return 'Name must be at least 2 characters.';
  if (value.length > 30) return 'Name must be under 30 characters.';
  if (!NAME_PATTERN.test(value)) return 'Name contains invalid characters.';
  return '';
}

joinBtn.addEventListener('click', () => {
  const room = roomInput.value.trim();
  const name = nameInput.value.trim();

  const roomMsg = validateRoom(room);
  const nameMsg = validateName(name);

  clearError(roomInput, roomError);
  clearError(nameInput, nameError);

  if (roomMsg) setError(roomInput, roomError, roomMsg);
  if (nameMsg) setError(nameInput, nameError, nameMsg);
  if (roomMsg || nameMsg) return;

  startMeeting(room, name);
});

// Allow pressing Enter in either field to submit
[roomInput, nameInput].forEach((el) => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') joinBtn.click();
  });
});

// NOTE: We intentionally do NOT embed meet.jit.si via the iframe/External API.
// Jitsi explicitly disconnects embedded calls after 5 minutes ("embedding
// meet.jit.si is only meant for demo purposes"). Instead, we hand off to
// meet.jit.si directly (full navigation, not an iframe), which has no such
// restriction. The HitroTech branding lives on this landing page; the call
// itself runs on Jitsi's own site.
function startMeeting(room, name) {
  joinBtn.disabled = true;
  joinBtnText.textContent = 'Redirecting to your meeting…';

  const roomId = 'HitroTechMeet-' + room;
  const jitsiUrl =
    'https://meet.jit.si/' +
    encodeURIComponent(roomId) +
    '#userInfo.displayName=%22' + encodeURIComponent(name) + '%22';

  window.location.href = jitsiUrl;
}
