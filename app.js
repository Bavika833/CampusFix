const STORAGE_KEY = 'campusfix-reports-v1';
const dialog = document.querySelector('#report-dialog');
const form = document.querySelector('#report-form');
const photoInput = document.querySelector('#photo-input');
const photoPreview = document.querySelector('#photo-preview');
let photoData = '';

function getReports() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function renderReports() {
  const reports = getReports();
  const list = document.querySelector('#report-list');
  const empty = document.querySelector('#empty-state');
  list.innerHTML = '';
  empty.hidden = reports.length > 0;
  list.hidden = reports.length === 0;
  document.querySelector('#nav-count').textContent = reports.length;
  document.querySelector('#total-stat').textContent = reports.length;
  document.querySelector('#progress-stat').textContent = reports.filter(r => r.status !== 'Resolved').length;
  document.querySelector('#resolved-stat').textContent = reports.filter(r => r.status === 'Resolved').length;
  reports.slice(0, 5).forEach(report => {
    const row = document.createElement('article');
    row.className = 'report-row';
    const icon = ({ Lighting: '☼', 'HVAC / Fan': '◉', 'Wi-Fi / Internet': '⌁', 'Washroom / Plumbing': '♧', Cleaning: '✳', Furniture: '▤', 'Safety concern': '◇', Other: '✦' })[report.category] || '✦';
    row.innerHTML = `<span class="report-symbol">${icon}</span><span class="report-info"><strong></strong><small></small></span><span class="report-status"></span>`;
    row.querySelector('.report-info strong').textContent = report.category;
    row.querySelector('.report-info small').textContent = `${report.location} · ${new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    const status = row.querySelector('.report-status');
    status.textContent = report.status;
    if (report.status === 'Resolved') status.classList.add('resolved');
    if (report.status === 'Assigned') status.classList.add('assigned');
    list.append(row);
  });
}

function openForm() { dialog.showModal(); }
document.querySelectorAll('#report-top,#report-hero,#report-empty,#tip-report').forEach(button => button.addEventListener('click', openForm));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelector('.mobile-menu').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.querySelector('#upload-box').addEventListener('click', () => photoInput.click());
photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { alert('Please choose a photo smaller than 5 MB.'); photoInput.value = ''; return; }
  const reader = new FileReader();
  reader.onload = () => { photoData = reader.result; photoPreview.innerHTML = `<img alt="Selected issue photo" src="${photoData}">`; };
  reader.readAsDataURL(file);
});
const uploadBox = document.querySelector('#upload-box');
uploadBox.addEventListener('dragover', e => { e.preventDefault(); uploadBox.style.borderColor = '#679077'; });
uploadBox.addEventListener('dragleave', () => { uploadBox.style.borderColor = ''; });
uploadBox.addEventListener('drop', e => {
  e.preventDefault(); uploadBox.style.borderColor = '';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) { photoInput.files = e.dataTransfer.files; photoInput.dispatchEvent(new Event('change')); }
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const reports = getReports();
  reports.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), category: data.get('category'), location: data.get('location').trim(), description: data.get('description').trim(), photo: photoData, status: 'Received', createdAt: new Date().toISOString() });
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reports)); }
  catch { alert('Your browser storage is full. Try submitting without a photo.'); return; }
  renderReports(); form.reset(); photoData = ''; photoPreview.innerHTML = ''; dialog.close();
  const toast = document.querySelector('#toast'); toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3500);
});
renderReports();
