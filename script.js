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

function startMeeting(room, name) {
  joinBtn.disabled = true;
  joinBtnText.textContent = 'Connecting…';

  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('meet-container').style.display = 'block';

  const domain = 'meet.jit.si';
  const options = {
    roomName: 'HitroTechMeet-' + room,
    width: '100%',
    height: '100%',
    parentNode: document.getElementById('jitsi-frame-wrapper'),
    userInfo: { displayName: name },
    configOverwrite: {
      prejoinPageEnabled: true,
    },
    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      DEFAULT_BACKGROUND: '#0b0e17',
      APP_NAME: 'HitroTech Meet',
    },
  };

  const api = new JitsiMeetExternalAPI(domain, options);

  api.addEventListener('readyToClose', () => {
    window.location.reload();
  });
}
