const sampleReports = [
  { community: 'Congo Cross', district: 'Western Area', status: 'Power off', reports: 12, time: '8 min ago', confidence: 'Likely outage', level: 'High confidence' },
  { community: 'Makeni Central', district: 'Bombali', status: 'Unstable', reports: 4, time: '22 min ago', confidence: 'Possible issue', level: 'Monitoring' },
  { community: 'Bo Town', district: 'Bo', status: 'Power restored', reports: 8, time: '41 min ago', confidence: 'Power restored', level: 'Community confirmed' },
  { community: 'Hangha Road', district: 'Kenema', status: 'Power off', reports: 5, time: '1 hr ago', confidence: 'Likely outage', level: 'Medium confidence' },
];

let reports = [...sampleReports];
const apiEnabled = location.protocol.startsWith('http');
let activeFilter = 'All';
const list = document.querySelector('#reportList');
const icons = { 'Power off': '◐', 'Unstable': 'ϟ', 'Power restored': '☀' };

function renderReports() {
  const visible = reports.filter(r => activeFilter === 'All' || r.district === activeFilter);
  list.innerHTML = visible.length ? visible.map(r => {
    const type = r.status === 'Power restored' ? 'restored' : r.status === 'Unstable' ? 'unstable' : 'off';
    return `<article class="report-card ${type}"><div class="status-icon">${icons[r.status]}</div><div class="report-main"><h3>${escapeHtml(r.community)}</h3><p>${escapeHtml(r.district)} · ${r.reports} community report${r.reports === 1 ? '' : 's'} · ${r.time}</p></div><div class="confidence"><b>${r.confidence}</b><small>${r.level}</small></div></article>`;
  }).join('') : '<p>No recent reports in this area.</p>';
  document.querySelector('#reportCount').textContent = reports.reduce((sum, r) => sum + r.reports, 0);
  document.querySelector('#activeCount').textContent = reports.filter(r => r.status !== 'Power restored').length;
}

function escapeHtml(value) {
  const div = document.createElement('div'); div.textContent = value; return div.innerHTML;
}

document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
  document.querySelector('.filter.active').classList.remove('active'); btn.classList.add('active'); activeFilter = btn.dataset.filter; renderReports();
}));

const dialog = document.querySelector('#reportDialog');
document.querySelectorAll('[data-open-report]').forEach(btn => btn.addEventListener('click', () => dialog.showModal()));
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
document.querySelector('#reportForm').addEventListener('submit', e => {
  e.preventDefault();
  const status = new FormData(e.currentTarget).get('power');
  if (!e.currentTarget.checkValidity()) { e.currentTarget.reportValidity(); return; }
  const payload = {community: document.querySelector('#community').value.trim(), district: document.querySelector('#district').value, power_status: status};
  submitReport(payload, e.currentTarget);
});

async function submitReport(payload, form) {
  let result = null;
  if (apiEnabled) {
    try { const response = await fetch('/api/reports', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)}); if (!response.ok) throw new Error('Report failed'); result = await response.json(); }
    catch (error) { document.querySelector('#toast').textContent = 'Could not reach the local Yelen service'; document.querySelector('#toast').classList.add('show'); return; }
  }
  const confidence = result ? `${Math.round(result.confidence * 100)}% model confidence` : 'Awaiting neighbours';
  reports.unshift({community: payload.community, district: payload.district, status: payload.power_status, reports: result?.cluster_size || 1, time: 'just now', confidence: result?.likely_outage ? 'Likely outage' : payload.power_status === 'Power restored' ? 'Power restored' : payload.power_status === 'Unstable' ? 'Possible issue' : 'New report', level: confidence});
  form.reset(); dialog.close(); activeFilter = 'All'; document.querySelector('.filter.active').classList.remove('active'); document.querySelector('[data-filter="All"]').classList.add('active'); renderReports();
  const toast = document.querySelector('#toast'); toast.textContent = result ? `✓ Stored locally. Confidence ${Math.round(result.confidence * 100)}%` : '✓ Report received. Tenki!'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3200);
}

async function loadStoredReports() {
  if (!apiEnabled) return;
  try {
    const response = await fetch('/api/reports'); const stored = await response.json();
    reports = stored.map(row => ({community:row.community,district:row.district,status:row.power_status,reports:row.cluster_size,time:'stored locally',confidence:row.likely_outage ? 'Likely outage' : row.power_status === 'Power restored' ? 'Power restored' : 'Monitoring',level:`${Math.round(row.confidence*100)}% model confidence`})); renderReports();
  } catch (error) { console.warn('Local API unavailable'); }
}

dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
renderReports();
loadStoredReports();

const mapPopup = document.querySelector('#mapPopup');
const mapPlaces = {'Congo Cross':['LIKELY OUTAGE','12 reports in the last 30 min','High confidence'],'Makeni Central':['PATTERN FORMING','4 reports in the last 30 min','Monitoring'],'Bo Town':['POWER RESTORED','8 community confirmations','Community confirmed'],'Hangha Road':['LIKELY OUTAGE','5 reports in the last 30 min','Medium confidence'],'Koidu':['UNSTABLE POWER','2 reports in the last 30 min','Monitoring']};
document.querySelectorAll('.map-pin').forEach(pin => pin.addEventListener('click', () => { const d=mapPlaces[pin.dataset.place]; mapPopup.querySelector('small').textContent=d[0]; mapPopup.querySelector('h3').textContent=pin.dataset.place; mapPopup.querySelector('p').textContent=d[1]; mapPopup.querySelector('b').textContent=d[2]; mapPopup.hidden=false; }));
mapPopup.querySelector('button').addEventListener('click',()=>mapPopup.hidden=true);
document.querySelectorAll('[data-map-layer]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.map-tool.active').classList.remove('active');b.classList.add('active');document.querySelector('#mapCanvas').classList.toggle('heat-mode',b.dataset.mapLayer==='heat')}));
let simTimer,simStep=0;const simEvents=[['New report · Wilberforce','Power off · just now','red'],['Neighbours confirm · Makeni','Confidence increased to 82%','amber'],['Power returned · Hangha Road','2 confirmations · just now','green'],['New cluster · Koidu','3 nearby reports detected','red']];
document.querySelector('#playSimulation').addEventListener('click',function(){if(simTimer){clearInterval(simTimer);simTimer=null;this.classList.remove('running');this.innerHTML='<span>▶</span> Run simulation';return}this.classList.add('running');this.innerHTML='<span>Ⅱ</span> Pause simulation';const tick=()=>{const e=simEvents[simStep%simEvents.length],feed=document.querySelector('#signalFeed'),item=document.createElement('article');item.className='feed-new';item.innerHTML=`<span class="feed-dot ${e[2]}"></span><div><b>${e[0]}</b><small>${e[1]}</small></div>`;feed.prepend(item);if(feed.children.length>5)feed.lastElementChild.remove();const m=42+(simStep+1)*4;document.querySelector('#simTime').textContent=`8:${String(m%60).padStart(2,'0')} PM`;document.querySelector('#clockProgress').style.width=`${16+((simStep+1)%8)*10}%`;simStep++};tick();simTimer=setInterval(tick,2200)});
