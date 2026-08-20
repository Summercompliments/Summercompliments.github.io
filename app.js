/* ===== CONFIG =====
   Set this to your deployed backend URL once you've deployed /server
   (see README.md). Example: 'https://your-app.onrender.com'
   Leave as-is during local testing and the app will still work for guests —
   it just won't be able to deliver photos to Telegram until this is set. */
const BACKEND_URL = 'https://summercompliments-github-io.onrender.com/';

const $ = (s, el = document) => el.querySelector(s);

function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function goTo(id) {
  ['view-upload', 'view-reveal'].forEach(v => $('#' + v).classList.remove('active'));
  $('#' + id).classList.add('active');
}

/* ---- shuffled reading queues (no repeats until the pool is exhausted) ---- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
let complimentQueue = [];
let fortuneQueue = [];
function nextCompliment() {
  if (complimentQueue.length === 0) complimentQueue = shuffle(COMPLIMENTS);
  return complimentQueue.pop();
}
function nextFortune() {
  if (fortuneQueue.length === 0) fortuneQueue = shuffle(FORTUNES);
  return fortuneQueue.pop();
}

/* ---- photo selection (step 1) ---- */
let pendingBlob = null;
const dropZone = $('#dropZone');
const dropPlaceholder = $('#dropPlaceholder');
const photoInput = $('#photoInput');
const stepTwo = $('#stepTwo');
const capInput = $('#capInput');
const submitBtn = $('#submitBtn');

photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 900;
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const previewUrl = canvas.toDataURL('image/jpeg', 0.72);
      dropZone.innerHTML = `<img src="${previewUrl}" alt="preview">`;
      canvas.toBlob((blob) => {
        pendingBlob = blob;
        stepTwo.style.display = 'block';
      }, 'image/jpeg', 0.72);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

/* ---- step 2: submit doubles as consent + send ---- */
submitBtn.addEventListener('click', async () => {
  if (!pendingBlob) return;
  submitBtn.disabled = true;
  const originalLabel = submitBtn.textContent;
  submitBtn.textContent = 'Revealing…';

  const compliment = nextCompliment();
  const fortune = nextFortune();
  const caption = capInput.value.trim().slice(0, 220);

  // Show the reveal immediately — delivery happens in the background so a
  // slow or failed network call never blocks the guest's experience.
  $('#complimentText').textContent = compliment;
  $('#fortuneText').textContent = fortune;
  goTo('view-reveal');

  deliverEntry(pendingBlob, caption, compliment, fortune).catch((err) => {
    console.error('Delivery failed:', err.message);
  });

  // reset step 1/2 for next guest
  pendingBlob = null;
  dropZone.innerHTML = '<span class="placeholder" id="dropPlaceholder">Tap to choose a photo from your library</span>';
  capInput.value = '';
  stepTwo.style.display = 'none';
  submitBtn.disabled = false;
  submitBtn.textContent = originalLabel;
});

$('#againBtn').addEventListener('click', () => goTo('view-upload'));

/* ---- delivery to backend, which forwards to Telegram server-side ---- */
async function deliverEntry(blob, caption, compliment, fortune) {
  if (!BACKEND_URL || BACKEND_URL.includes('YOUR-BACKEND-URL')) {
    throw new Error('Backend URL not configured yet (see README.md)');
  }
  const form = new FormData();
  form.append('photo', blob, 'entry.jpg');
  form.append('caption', caption || '');
  form.append('compliment', compliment);
  form.append('fortune', fortune);

  const res = await fetch(`${BACKEND_URL}/api/submit`, { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(data.error || `Server responded ${res.status}`);
  }
}
