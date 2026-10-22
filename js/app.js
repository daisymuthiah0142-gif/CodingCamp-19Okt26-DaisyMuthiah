/* =============================================
   MY DASHBOARD — app.js
   Features:
   - Language switcher: Indonesian / English (LocalStorage)
   - Dark / Light theme toggle (LocalStorage)
   - Greeting with custom name (LocalStorage)
   - Clock & date
   - Focus Timer with custom duration + alarm popup (LocalStorage)
   - To-Do List (LocalStorage)
   - Quick Links (LocalStorage)
   ============================================= */

// ─── Utility ─────────────────────────────────

/** Generate a simple unique ID. */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── 0. INTERNATIONALISATION (i18n) ──────────

const STORAGE_KEY_LANG = 'dashboard_lang';

/**
 * All UI strings in both languages.
 * Keys match data-i18n attributes in HTML.
 */
const TRANSLATIONS = {
  en: {
    // Topbar
    setYourName:          'Set your name',
    // Greeting
    greetMorning:         'Good Morning',
    greetAfternoon:       'Good Afternoon',
    greetEvening:         'Good Evening',
    greetNight:           'Good Night',
    // Timer card
    timerTitle:           'Focus Timer',
    timerDurationLabel:   'Duration (min)',
    timerSetBtn:          'Set',
    timerStart:           'Start',
    timerStop:            'Stop',
    timerReset:           'Reset',
    timerReady:           'Ready to focus',
    timerRunning:         '⏳ Stay focused…',
    timerPaused:          'Paused. Resume when ready.',
    timerDone:            '🎉 Session complete! Take a break.',
    timerDurationSet:     (n) => `Duration set to ${n} min. Ready to focus.`,
    // To-Do card
    todoTitle:            'To-Do List',
    todoPlaceholder:      'Add a new task...',
    todoAdd:              'Add',
    todoEmpty:            'No tasks yet. Add one above!',
    editTaskTitle:        'Edit Task',
    todoAriaCheck:        'Mark task as done',
    todoAriaEdit:         'Edit task',
    todoAriaDelete:       'Delete task',
    // Links card
    linksTitle:           'Quick Links',
    linksNamePlaceholder: 'Name (e.g. Home Workout)',
    linksUrlPlaceholder:  'URL (e.g. https://youtube.com)',
    linksAdd:             'Add',
    linksEmpty:           'No links yet. Add your favorites!',
    linksAlertName:       'Please enter a name for the link.',
    linksAlertUrl:        'Please enter a valid URL.',
    linksAriaRemove:      (name) => `Remove ${name}`,
    // Timer popup
    popupTitle:           "Time's Up!",
    popupMsg:             "Time's Up! You doing Awesome! >.<  — Let's Take a Break!",
    popupClose:           'Got it!',
    popupRestart:         'Start Again',
    // Notification
    notifTitle:           "⏰ Time's Up!",
    notifBody:            'Your focus session is complete. Take a break!',
    // Name modal
    nameModalTitle:       "What's your name?",
    nameModalPlaceholder: 'Enter your name…',
    // Shared
    save:                 'Save',
    cancel:               'Cancel',
  },

  id: {
    // Topbar
    setYourName:          'Atur namamu',
    // Greeting
    greetMorning:         'Selamat Pagi',
    greetAfternoon:       'Selamat Siang',
    greetEvening:         'Selamat Sore',
    greetNight:           'Selamat Malam',
    // Timer card
    timerTitle:           'Timer Fokus',
    timerDurationLabel:   'Durasi (menit)',
    timerSetBtn:          'Atur',
    timerStart:           'Mulai',
    timerStop:            'Berhenti',
    timerReset:           'Ulang',
    timerReady:           'Siap untuk fokus',
    timerRunning:         '⏳ Tetap fokus…',
    timerPaused:          'Dijeda. Lanjutkan kalau sudah siap.',
    timerDone:            '🎉 Sesi selesai! Saatnya istirahat.',
    timerDurationSet:     (n) => `Durasi diatur ke ${n} menit. Siap fokus.`,
    // To-Do card
    todoTitle:            'Daftar Tugas',
    todoPlaceholder:      'Tambah tugas baru...',
    todoAdd:              'Tambah',
    todoEmpty:            'Belum ada tugas. Tambahkan di atas!',
    editTaskTitle:        'Edit Tugas',
    todoAriaCheck:        'Tandai tugas selesai',
    todoAriaEdit:         'Edit tugas',
    todoAriaDelete:       'Hapus tugas',
    // Links card
    linksTitle:           'Tautan Cepat',
    linksNamePlaceholder: 'Nama (mis. GitHub)',
    linksUrlPlaceholder:  'URL (mis. https://github.com)',
    linksAdd:             'Tambah',
    linksEmpty:           'Belum ada tautan. Tambahkan favoritmu!',
    linksAlertName:       'Masukkan nama untuk tautan.',
    linksAlertUrl:        'Masukkan URL yang valid.',
    linksAriaRemove:      (name) => `Hapus ${name}`,
    // Timer popup
    popupTitle:           'Waktu Habis!',
    popupMsg:             "Waktu Habis! Kamu Hebat! >.<  — Yuk Istirahat Sebentar!",
    popupClose:           'Oke!',
    popupRestart:         'Mulai Lagi',
    // Notification
    notifTitle:           '⏰ Waktu Habis!',
    notifBody:            'Sesi fokusmu selesai. Istirahat dulu ya!',
    // Name modal
    nameModalTitle:       'Siapa namamu?',
    nameModalPlaceholder: 'Masukkan namamu…',
    // Shared
    save:                 'Simpan',
    cancel:               'Batal',
  },
};

let currentLang = localStorage.getItem(STORAGE_KEY_LANG) || 'en';

/** Get a translation string for the current language. */
function t(key, ...args) {
  const val = TRANSLATIONS[currentLang][key];
  if (typeof val === 'function') return val(...args);
  return val ?? key;
}

/**
 * Update every element that has a data-i18n or data-i18n-placeholder attribute.
 * Called once on load and again each time the language changes.
 */
function applyTranslations() {
  // Text content
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const val = TRANSLATIONS[currentLang][key];
    if (val !== undefined && typeof val !== 'function') el.textContent = val;
  });

  // Placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = TRANSLATIONS[currentLang][key];
    if (val !== undefined && typeof val !== 'function') el.placeholder = val;
  });

  // Update <html lang> attribute
  document.documentElement.lang = currentLang;
}

// ── Language toggle button

const btnLang    = document.getElementById('btn-lang');
const elLangLabel = document.getElementById('lang-label');

function updateLangButton() {
  elLangLabel.textContent = currentLang === 'en' ? '🇮🇩 ID' : '🇬🇧 EN';
  btnLang.title           = currentLang === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English';
}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'id' : 'en';
  localStorage.setItem(STORAGE_KEY_LANG, currentLang);
  updateLangButton();
  applyTranslations();

  // Re-render dynamic content so translated strings are shown
  updateClock();
  renderTodos();
  renderLinks();

  // Sync live timer status text if timer is idle
  if (!timerRunning && timerRemaining === timerTotalSec) {
    elTimerStatus.textContent = t('timerReady');
  }
}

btnLang.addEventListener('click', toggleLang);

// ─── 1. THEME TOGGLE ─────────────────────────

const STORAGE_KEY_THEME = 'dashboard_theme';

const btnTheme    = document.getElementById('btn-theme');
const elThemeIcon = document.getElementById('theme-icon');
const htmlEl      = document.documentElement;

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  elThemeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem(STORAGE_KEY_THEME, theme);
}

function toggleTheme() {
  const current = htmlEl.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

applyTheme(localStorage.getItem(STORAGE_KEY_THEME) || 'dark');
btnTheme.addEventListener('click', toggleTheme);

// ─── 2. CUSTOM NAME & GREETING ───────────────

const STORAGE_KEY_NAME = 'dashboard_user_name';

const elDisplayName = document.getElementById('display-name');
const btnEditName   = document.getElementById('btn-edit-name');
const elNameModal   = document.getElementById('name-modal');
const elNameInput   = document.getElementById('name-input');
const btnNameSave   = document.getElementById('btn-name-save');
const btnNameCancel = document.getElementById('btn-name-cancel');

const elDate     = document.getElementById('current-date');
const elGreeting = document.getElementById('greeting');
const elTime     = document.getElementById('current-time');

function getUserName() {
  return localStorage.getItem(STORAGE_KEY_NAME) || '';
}

function saveUserName(name) {
  localStorage.setItem(STORAGE_KEY_NAME, name.trim());
}

/**
 * Returns a greeting string based on hour and current language.
 * @param {number} hour
 * @param {string} name
 */
function getGreeting(hour, name) {
  let base;
  if (hour >= 5  && hour < 12) base = t('greetMorning');
  else if (hour >= 12 && hour < 17) base = t('greetAfternoon');
  else if (hour >= 17 && hour < 21) base = t('greetEvening');
  else base = t('greetNight');

  const suffix = name ? `, ${name}` : '';
  const emoji  = hour >= 5 && hour < 12 ? '☀️'
               : hour >= 12 && hour < 17 ? '🌤️'
               : hour >= 17 && hour < 21 ? '🌇'
               : '🌙';
  return `${base}${suffix}! ${emoji}`;
}

function formatDate(now) {
  const locale = currentLang === 'id' ? 'id-ID' : 'en-US';
  return now.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(now) {
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function updateClock() {
  const now  = new Date();
  const name = getUserName();
  elDate.textContent     = formatDate(now);
  elGreeting.textContent = getGreeting(now.getHours(), name);
  elTime.textContent     = formatTime(now);
  elDisplayName.textContent = name ? `👋 ${name}` : t('setYourName');
}

updateClock();
setInterval(updateClock, 1000);

// ── Name modal

function openNameModal() {
  // Sync placeholder with current language before opening
  elNameInput.placeholder = t('nameModalPlaceholder');
  elNameInput.value = getUserName();
  elNameModal.style.display = 'flex';
  elNameModal.classList.remove('hidden');
  elNameInput.focus();
  elNameInput.select();
}

function closeNameModal() {
  elNameModal.classList.add('hidden');
  elNameModal.style.display = '';
}

function saveName() {
  saveUserName(elNameInput.value.trim());
  updateClock();
  closeNameModal();
}

btnEditName.addEventListener('click', openNameModal);
btnNameSave.addEventListener('click', saveName);
btnNameCancel.addEventListener('click', closeNameModal);
elNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveName();
  if (e.key === 'Escape') closeNameModal();
});
elNameModal.addEventListener('click', (e) => {
  if (e.target === elNameModal) closeNameModal();
});

if (!getUserName()) {
  setTimeout(openNameModal, 400);
}

// ─── 3. FOCUS TIMER ──────────────────────────

const STORAGE_KEY_TIMER_DURATION = 'dashboard_timer_duration';
const STORAGE_KEY_TIMER_STATE    = 'dashboard_timer_state';
const DEFAULT_DURATION_MIN = 25;

const elTimerDisplay  = document.getElementById('timer-display');
const elTimerStatus   = document.getElementById('timer-status');
const elDurationInput = document.getElementById('timer-duration-input');
const btnSetDuration  = document.getElementById('btn-set-duration');
const btnStart        = document.getElementById('btn-start');
const btnStop         = document.getElementById('btn-stop');
const btnReset        = document.getElementById('btn-reset');

const elTimerPopup    = document.getElementById('timer-done-popup');
const btnPopupClose   = document.getElementById('btn-popup-close');
const btnPopupRestart = document.getElementById('btn-popup-restart');

function loadTimerDuration() {
  const saved = parseInt(localStorage.getItem(STORAGE_KEY_TIMER_DURATION), 10);
  return (!isNaN(saved) && saved >= 1 && saved <= 120) ? saved : DEFAULT_DURATION_MIN;
}

function saveTimerDuration(minutes) {
  localStorage.setItem(STORAGE_KEY_TIMER_DURATION, String(minutes));
}

/**
 * Persist the current running state so it survives a refresh.
 * Saves: remaining seconds + the timestamp when it was saved.
 */
function saveTimerState() {
  if (timerRunning) {
    localStorage.setItem(STORAGE_KEY_TIMER_STATE, JSON.stringify({
      remaining:  timerRemaining,
      savedAt:    Date.now(),
      running:    true,
    }));
  }
}

/** Clear persisted timer state (on stop / reset / finish). */
function clearTimerState() {
  localStorage.removeItem(STORAGE_KEY_TIMER_STATE);
}

/**
 * On page load, restore timer state from LocalStorage.
 * If the timer was running, calculate elapsed time since the
 * last save and subtract it so the countdown stays accurate.
 * Returns { remaining, wasRunning }.
 */
function restoreTimerState(totalSec) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TIMER_STATE);
    if (!raw) return { remaining: totalSec, wasRunning: false };

    const state = JSON.parse(raw);
    if (!state.running) return { remaining: totalSec, wasRunning: false };

    // Calculate how many seconds passed while the page was closed
    const elapsed   = Math.floor((Date.now() - state.savedAt) / 1000);
    const remaining = state.remaining - elapsed;

    // Timer already expired while page was closed
    if (remaining <= 0) {
      clearTimerState();
      return { remaining: 0, wasRunning: false, expired: true };
    }

    return { remaining, wasRunning: true };
  } catch {
    return { remaining: totalSec, wasRunning: false };
  }
}

let timerDurationMin = loadTimerDuration();
let timerTotalSec    = timerDurationMin * 60;
let timerInterval    = null;
let timerRunning     = false;

// ── Restore state from before refresh
const restored = restoreTimerState(timerTotalSec);
let timerRemaining = restored.remaining;

elDurationInput.value = timerDurationMin;

function secondsToDisplay(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function renderTimer() {
  elTimerDisplay.textContent = secondsToDisplay(timerRemaining);
}

// ── Alarm (Web Audio API)

function playAlarm() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    function beep(frequency, startTime, duration, gain = 0.4) {
      const osc      = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);
      gainNode.gain.setValueAtTime(gain, ctx.currentTime + startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime  + startTime + duration);
    }

    // Ascending C5 → E5 → G5 pattern, played twice
    beep(523.25, 0.0,  0.18);
    beep(659.25, 0.22, 0.18);
    beep(783.99, 0.44, 0.18);
    beep(783.99, 0.66, 0.45);
    beep(523.25, 1.3,  0.18);
    beep(659.25, 1.52, 0.18);
    beep(783.99, 1.74, 0.18);
    beep(783.99, 1.96, 0.55);

    setTimeout(() => ctx.close(), 3200);
  } catch (err) {
    console.warn('Web Audio API unavailable:', err);
  }
}

// ── Browser Notification

function fireNotification() {
  if (!('Notification' in window)) return;

  const send = () => {
    new Notification(t('notifTitle'), {
      body: t('notifBody'),
      icon: 'https://openmoji.org/data/color/svg/23F0.svg',
      tag:  'focus-timer-done',
    });
  };

  if (Notification.permission === 'granted') {
    send();
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') send();
    });
  }
}

// ── Popup

function openTimerPopup() {
  elTimerPopup.classList.remove('hidden');
}

function closeTimerPopup() {
  elTimerPopup.classList.add('hidden');
}

btnPopupClose.addEventListener('click', closeTimerPopup);
btnPopupRestart.addEventListener('click', () => {
  closeTimerPopup();
  resetTimer();
  startTimer();
});
elTimerPopup.addEventListener('click', (e) => {
  if (e.target === elTimerPopup) closeTimerPopup();
});

// ── Timer core

function timerTick() {
  if (timerRemaining <= 0) {
    clearInterval(timerInterval);
    timerInterval  = null;
    timerRunning   = false;
    timerRemaining = 0;
    clearTimerState();
    renderTimer();
    elTimerDisplay.className  = 'timer-display finished';
    elTimerStatus.textContent = t('timerDone');
    playAlarm();
    openTimerPopup();
    fireNotification();
    return;
  }
  timerRemaining--;
  renderTimer();
  saveTimerState(); // persist every tick
}

function startTimer() {
  if (timerRunning || timerRemaining <= 0) return;
  timerRunning  = true;
  timerInterval = setInterval(timerTick, 1000);
  elTimerDisplay.className  = 'timer-display running';
  elTimerStatus.textContent = t('timerRunning');
  saveTimerState();
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning  = false;
  clearTimerState(); // paused = don't resume on refresh
  elTimerDisplay.className  = 'timer-display';
  elTimerStatus.textContent = t('timerPaused');
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval  = null;
  timerRunning   = false;
  timerRemaining = timerTotalSec;
  clearTimerState();
  renderTimer();
  elTimerDisplay.className  = 'timer-display';
  elTimerStatus.textContent = t('timerReady');
}

function applyDuration() {
  const raw = parseInt(elDurationInput.value, 10);
  if (isNaN(raw) || raw < 1 || raw > 120) {
    elDurationInput.value = timerDurationMin;
    return;
  }
  timerDurationMin = raw;
  timerTotalSec    = raw * 60;
  saveTimerDuration(raw);
  resetTimer();
  elTimerStatus.textContent = t('timerDurationSet', raw);
}

btnSetDuration.addEventListener('click', applyDuration);
elDurationInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyDuration(); });
btnStart.addEventListener('click', startTimer);
btnStop.addEventListener('click',  stopTimer);
btnReset.addEventListener('click', resetTimer);

// ── Resume or handle expired timer on page load
renderTimer();

if (restored.expired) {
  // Timer finished while page was closed — show popup + alarm
  timerRemaining = 0;
  elTimerDisplay.className  = 'timer-display finished';
  elTimerStatus.textContent = t('timerDone');
  renderTimer();
  openTimerPopup();
  playAlarm();
} else if (restored.wasRunning) {
  // Timer was running — resume automatically
  elTimerDisplay.className  = 'timer-display running';
  elTimerStatus.textContent = t('timerRunning');
  timerRunning  = true;
  timerInterval = setInterval(timerTick, 1000);
}

// ─── 4. TO-DO LIST ───────────────────────────

const STORAGE_KEY_TODOS = 'dashboard_todos';

const elTodoInput    = document.getElementById('todo-input');
const btnAddTodo     = document.getElementById('btn-add-todo');
const elTodoList     = document.getElementById('todo-list');
const elTodoEmpty    = document.getElementById('todo-empty');
const elEditModal    = document.getElementById('edit-modal');
const elEditInput    = document.getElementById('edit-input');
const btnModalSave   = document.getElementById('btn-modal-save');
const btnModalCancel = document.getElementById('btn-modal-cancel');

let todos         = loadTodos();
let editingTodoId = null;

function loadTodos() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_TODOS)) || []; }
  catch { return []; }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
}

function renderTodos() {
  elTodoList.innerHTML = '';

  if (todos.length === 0) {
    elTodoEmpty.style.display = 'block';
    // Keep data-i18n in sync when language changed
    elTodoEmpty.textContent = t('todoEmpty');
    return;
  }
  elTodoEmpty.style.display = 'none';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className  = 'todo-item' + (todo.done ? ' done' : '');
    li.dataset.id = todo.id;

    const checkbox     = document.createElement('input');
    checkbox.type      = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked   = todo.done;
    checkbox.setAttribute('aria-label', t('todoAriaCheck'));
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const span       = document.createElement('span');
    span.className   = 'todo-text';
    span.textContent = todo.text;

    const actions     = document.createElement('div');
    actions.className = 'todo-actions';

    const btnEdit     = document.createElement('button');
    btnEdit.className = 'btn btn-edit';
    btnEdit.title     = t('todoAriaEdit');
    btnEdit.innerHTML = '✏️';
    btnEdit.setAttribute('aria-label', t('todoAriaEdit'));
    btnEdit.addEventListener('click', () => openEditModal(todo.id));

    const btnDel     = document.createElement('button');
    btnDel.className = 'btn btn-danger';
    btnDel.title     = t('todoAriaDelete');
    btnDel.innerHTML = '🗑️';
    btnDel.setAttribute('aria-label', t('todoAriaDelete'));
    btnDel.addEventListener('click', () => deleteTodo(todo.id));

    actions.appendChild(btnEdit);
    actions.appendChild(btnDel);
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(actions);
    elTodoList.appendChild(li);
  });
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  todos.push({ id: uid(), text: trimmed, done: false });
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((t) => t.id === id ? { ...t, done: !t.done } : t);
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos();
}

function openEditModal(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  editingTodoId     = id;
  elEditInput.value = todo.text;
  elEditModal.classList.remove('hidden');
  elEditInput.focus();
}

function closeEditModal() {
  editingTodoId = null;
  elEditModal.classList.add('hidden');
}

function saveEdit() {
  const newText = elEditInput.value.trim();
  if (!newText || !editingTodoId) { closeEditModal(); return; }
  todos = todos.map((t) => t.id === editingTodoId ? { ...t, text: newText } : t);
  saveTodos();
  renderTodos();
  closeEditModal();
}

btnAddTodo.addEventListener('click', () => {
  addTodo(elTodoInput.value);
  elTodoInput.value = '';
  elTodoInput.focus();
});
elTodoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { addTodo(elTodoInput.value); elTodoInput.value = ''; }
});
btnModalSave.addEventListener('click', saveEdit);
btnModalCancel.addEventListener('click', closeEditModal);
elEditModal.addEventListener('click', (e) => { if (e.target === elEditModal) closeEditModal(); });
elEditInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveEdit();
  if (e.key === 'Escape') closeEditModal();
});

renderTodos();

// ─── 5. QUICK LINKS ──────────────────────────

const STORAGE_KEY_LINKS = 'dashboard_links';

const elLinkName       = document.getElementById('link-name-input');
const elLinkUrl        = document.getElementById('link-url-input');
const btnAddLink       = document.getElementById('btn-add-link');
const elLinksContainer = document.getElementById('links-container');
const elLinksEmpty     = document.getElementById('links-empty');

let links = loadLinks();

function loadLinks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_LINKS)) || []; }
  catch { return []; }
}

function saveLinks() {
  localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(links));
}

function renderLinks() {
  elLinksContainer.innerHTML = '';

  if (links.length === 0) {
    elLinksEmpty.style.display = 'block';
    elLinksEmpty.textContent   = t('linksEmpty');
    return;
  }
  elLinksEmpty.style.display = 'none';

  links.forEach((link) => {
    const chip     = document.createElement('div');
    chip.className = 'link-chip';

    const icon       = document.createElement('span');
    icon.className   = 'link-chip-icon';
    icon.textContent = '🔗';

    const label         = document.createElement('a');
    label.href          = link.url;
    label.target        = '_blank';
    label.rel           = 'noopener noreferrer';
    label.textContent   = link.name;
    label.style.cssText = 'color:inherit;text-decoration:none;';

    const removeBtn     = document.createElement('button');
    removeBtn.className = 'link-chip-remove';
    removeBtn.innerHTML = '✕';
    removeBtn.title     = t('linksAriaRemove', link.name);
    removeBtn.setAttribute('aria-label', t('linksAriaRemove', link.name));
    removeBtn.addEventListener('click', (e) => { e.stopPropagation(); removeLink(link.id); });

    chip.appendChild(icon);
    chip.appendChild(label);
    chip.appendChild(removeBtn);
    elLinksContainer.appendChild(chip);
  });
}

function normaliseUrl(raw) {
  let url = raw.trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  try { new URL(url); return url; } catch { return null; }
}

function addLink(name, rawUrl) {
  const trimmedName = name.trim();
  const validUrl    = normaliseUrl(rawUrl);
  if (!trimmedName) { alert(t('linksAlertName')); elLinkName.focus(); return; }
  if (!validUrl)    { alert(t('linksAlertUrl'));  elLinkUrl.focus();  return; }
  links.push({ id: uid(), name: trimmedName, url: validUrl });
  saveLinks();
  renderLinks();
}

function removeLink(id) {
  links = links.filter((l) => l.id !== id);
  saveLinks();
  renderLinks();
}

btnAddLink.addEventListener('click', () => {
  addLink(elLinkName.value, elLinkUrl.value);
  elLinkName.value = '';
  elLinkUrl.value  = '';
  elLinkName.focus();
});
elLinkUrl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addLink(elLinkName.value, elLinkUrl.value);
    elLinkName.value = '';
    elLinkUrl.value  = '';
    elLinkName.focus();
  }
});

renderLinks();

// ─── Global Escape handler ───────────────────

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!elTimerPopup.classList.contains('hidden'))  closeTimerPopup();
    if (!elEditModal.classList.contains('hidden'))   closeEditModal();
    if (!elNameModal.classList.contains('hidden'))   closeNameModal();
  }
});

// ─── Bootstrap i18n ──────────────────────────
// Run after all elements are defined
updateLangButton();
applyTranslations();
