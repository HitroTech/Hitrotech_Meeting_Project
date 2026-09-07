// ---------- HitroTech Meet: form validation + Jitsi integration ----------

const roomInput = document.getElementById('roomName');
const nameInput = document.getElementById('displayName');
const roomError = document.getElementById('roomNameError');
const nameError = document.getElementById('displayNameError');
const joinBtn = document.getElementById('joinBtn');
const joinBtnText = document.getElementById('joinBtnText');
const JOIN_LABEL = joinBtnText.textContent;

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

// Coming back from the meeting restores this page from the back/forward cache
// with the DOM exactly as we left it — button disabled, label still saying
// "Redirecting…". Reset it so the user can start another meeting immediately.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    joinBtn.disabled = false;
    joinBtnText.textContent = JOIN_LABEL;
  }
});

// NOTE: We intentionally do NOT embed meet.jit.si via the iframe/External API.
// Jitsi explicitly disconnects embedded calls after 5 minutes ("embedding
// meet.jit.si is only meant for demo purposes"). Instead, we hand off to
// meet.jit.si directly (full navigation, not an iframe), which has no such
// restriction. The HitroTech branding lives on this landing page; the call
// itself runs on Jitsi's own site.
//
// meet.jit.si only honours a whitelist of URL overrides. config.subject is
// accepted (verified against the live server); the interfaceConfig.* branding
// keys are ignored, so the Jitsi watermark cannot be removed from the public
// server — that needs JaaS or a self-hosted instance.
function quoted(value) {
  return '%22' + encodeURIComponent(value) + '%22';
}

function startMeeting(room, name) {
  joinBtn.disabled = true;
  joinBtnText.textContent = 'Redirecting to your meeting…';

  // The room ID keeps its prefix so it cannot collide with unrelated public
  // rooms, but Jitsi renders that slug in the meeting header. Send a clean
  // subject alongside it so the call shows a readable name instead.
  const roomId = 'HitroTechMeet-' + room;
  const subject = 'HitroTech · ' + room.replace(/-/g, ' ');

  const params = [
    'userInfo.displayName=' + quoted(name),
    'config.subject=' + quoted(subject)
  ];

  window.location.href =
    'https://meet.jit.si/' + encodeURIComponent(roomId) + '#' + params.join('&');
}
