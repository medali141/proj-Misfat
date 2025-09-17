function togglePassword() {
	var input = document.getElementById('password');
	input.type = input.type === 'password' ? 'text' : 'password';
}

document.addEventListener('DOMContentLoaded', function () {
	var form = document.getElementById('login-form');
	if (form) {
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			var matricule = document.getElementById('matricule');
			var password = document.getElementById('password');
			var matriculeValue = matricule ? matricule.value.trim() : '';
			var passwordValue = password ? password.value : '';

			if (!matriculeValue || !passwordValue) {
				alert('Please enter your matricule and password.');
				return;
			}

			// TODO: Replace this with real authentication API call
			// Simulate success and redirect to dashboard
			window.location.href = 'dashboard.html';
		});
	}

	// Forgot password modal
	var forgotLink = document.getElementById('forgot-link');
	var modal = document.getElementById('forgot-modal');
	if (forgotLink && modal) {
		forgotLink.addEventListener('click', function (e) {
			e.preventDefault();
			modal.removeAttribute('hidden');
		});
		modal.addEventListener('click', function (e) {
			var target = e.target;
			if (target.hasAttribute('data-close')) {
				modal.setAttribute('hidden', '');
			}
		});
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
				modal.setAttribute('hidden', '');
			}
		});
	}

	// Avatar dropdown
	var avatarBtn = document.getElementById('avatar-button');
	var avatarMenu = document.getElementById('avatar-menu');
	if (avatarBtn && avatarMenu) {
		function closeMenu() {
			avatarMenu.setAttribute('hidden', '');
			avatarBtn.setAttribute('aria-expanded', 'false');
		}
		function openMenu() {
			avatarMenu.removeAttribute('hidden');
			avatarBtn.setAttribute('aria-expanded', 'true');
		}
		avatarBtn.addEventListener('click', function (e) {
			e.stopPropagation();
			if (avatarMenu.hasAttribute('hidden')) openMenu(); else closeMenu();
		});
		document.addEventListener('click', function () {
			if (!avatarMenu.hasAttribute('hidden')) closeMenu();
		});
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') closeMenu();
		});
	}

	// HR Console Modal + Donut Chart (fake data  for now real data will be added later when the api is ready)
	var openHrBtn = document.getElementById('open-hr-console');
	var hrModal = document.getElementById('hr-modal');
	if (openHrBtn && hrModal) {
		openHrBtn.addEventListener('click', function () {
			hrModal.removeAttribute('hidden');
			renderHrDonut({ contract: 925, interns: 575 });
		});
		hrModal.addEventListener('click', function (e) {
			var target = e.target;
			if (target.hasAttribute('data-close')) {
				hrModal.setAttribute('hidden', '');
			}
		});
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && !hrModal.hasAttribute('hidden')) {
				hrModal.setAttribute('hidden', '');
			}
		});
	}

	function renderHrDonut(data) {
		var contract = Number(data.contract) || 0;
		var interns = Number(data.interns) || 0;
		var total = contract + interns;
		var contractPercent = total ? Math.round((contract / total) * 100) : 0;
		var internsPercent = 100 - contractPercent;

		var donut = document.getElementById('hr-donut');
		if (!donut) return;

		// Clear previous
		while (donut.firstChild) donut.removeChild(donut.firstChild);

		// Build SVG donut
		var size = 260; var stroke = 28; var radius = (size - stroke) / 2; var center = size / 2; var circumference = 2 * Math.PI * radius;
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', size); svg.setAttribute('height', size);
		// Track
		var track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		track.setAttribute('cx', center); track.setAttribute('cy', center); track.setAttribute('r', radius);
		track.setAttribute('fill', 'none'); track.setAttribute('stroke', '#f0eef3'); track.setAttribute('stroke-width', stroke);
		svg.appendChild(track);
		// Contract slice
		var contractCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		contractCircle.setAttribute('cx', center); contractCircle.setAttribute('cy', center); contractCircle.setAttribute('r', radius);
		contractCircle.setAttribute('fill', 'none'); contractCircle.setAttribute('stroke', 'url(#grad-contract)'); contractCircle.setAttribute('stroke-width', stroke);
		contractCircle.setAttribute('stroke-linecap', 'round');
		contractCircle.setAttribute('transform', 'rotate(-90 ' + center + ' ' + center + ')');
		var dash = (contractPercent / 100) * circumference;
		contractCircle.setAttribute('class', 'slice');
		contractCircle.setAttribute('stroke-dasharray', dash + ' ' + (circumference - dash));
		svg.appendChild(contractCircle);
		var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
		var grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
		grad.setAttribute('id', 'grad-contract'); grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%'); grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '0%');
		var s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop'); s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', '#6ea8ff');
		var s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop'); s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', '#4f46e5');
		grad.appendChild(s1); grad.appendChild(s2); defs.appendChild(grad); svg.appendChild(defs);
		var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		text.setAttribute('x', center); text.setAttribute('y', center + 4); text.setAttribute('text-anchor', 'middle'); text.setAttribute('font-size', '26'); text.setAttribute('font-weight', '900'); text.textContent = total;
		var sub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		sub.setAttribute('x', center); sub.setAttribute('y', center + 26); sub.setAttribute('text-anchor', 'middle'); sub.setAttribute('class', 'center-sub'); sub.textContent = 'Total';
		svg.appendChild(text);
		svg.appendChild(sub);
		donut.appendChild(svg);

		// Update legend
		var vc = document.getElementById('val-contract');
		var vi = document.getElementById('val-intern');
		var vt = document.getElementById('val-total');
		if (vc) vc.textContent = String(contract);
		if (vi) vi.textContent = String(interns);
		if (vt) vt.textContent = String(total);
	}

	// Generate Word file on attestation click
	var attestationTile = document.getElementById('tile-attestation');
	if (attestationTile) {
		attestationTile.addEventListener('click', function () {
			generateAttestationDoc();
		});
	}

	function generateAttestationDoc() {
		var content = "Attestation de Travail\n\nSociété: Misfat\nEmployé: [Nom Prénom]\nMatricule: [XXXX]\nFonction: [Poste]\n\nNous attestons que l'employé susmentionné travaille chez Misfat.\n\nDate: " + new Date().toLocaleDateString();
		var blob = new Blob(['\ufeff', content], { type: 'application/msword' });
		var url = URL.createObjectURL(blob);
		var link = document.createElement('a');
		link.href = url;
		link.download = 'attestation.doc';
		document.body.appendChild(link);
		link.click();
		setTimeout(function () {
			URL.revokeObjectURL(url);
			document.body.removeChild(link);
		}, 0);
	}

	// Employees search (mock data)
	var searchInput = document.getElementById('search-mat');
	var searchBtn = document.getElementById('btn-search');
	var result = document.getElementById('result');
	if (searchInput && searchBtn && result) {
		var MOCK = [
			{ matricule: '1001', name: 'Amine Ben Ali', type: 'Employee', department: 'IT', role: 'Engineer' },
			{ matricule: '2002', name: 'Sara Trabelsi', type: 'Stagiaire', department: 'HR', role: 'Intern' },
			{ matricule: '3003', name: 'Hatem Gharbi', type: 'Employee', department: 'Finance', role: 'Analyst' }
		];

		function renderNotFound(val) {
			result.style.display = 'block';
			result.innerHTML = '<h3>No result</h3><p class="muted">No employee/stagiaire found for matricule <strong>' + val + '</strong>.</p>';
		}

		function renderProfile(rec) {
			result.style.display = 'block';
			result.innerHTML = '<h3>' + rec.name + ' <span style="font-size:12px; color:#6b6b6b">(' + rec.type + ')</span></h3>' +
				'<p class="muted">Matricule: <strong>' + rec.matricule + '</strong></p>' +
				'<p class="muted">Department: ' + rec.department + ' • Role: ' + rec.role + '</p>' +
				'<div style="margin-top:12px; display:flex; gap:8px;">' +
					'<button class="btn-chip" id="btn-attestation">Generate Attestation</button>' +
					'<button class="btn-chip" id="btn-back">Clear</button>' +
				'</div>';
			var btnA = document.getElementById('btn-attestation');
			var btnB = document.getElementById('btn-back');
			if (btnA) btnA.addEventListener('click', function(){ generateAttestationDoc(); });
			if (btnB) btnB.addEventListener('click', function(){ result.style.display='none'; searchInput.value=''; });
		}

		function doSearch() {
			var val = (searchInput.value || '').trim();
			if (!val) { searchInput.focus(); return; }
			var rec = MOCK.find(function(r){ return r.matricule === val; });
			if (rec) renderProfile(rec); else renderNotFound(val);
		}

		searchBtn.addEventListener('click', doSearch);
		searchInput.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });
	}
});

// Standalone modules initialized after DOMContentLoaded block to avoid context issues
(function(){
	// Attendance page logic (localStorage)
	var attMat = document.getElementById('att-mat');
	var attDate = document.getElementById('att-date');
	if (attDate && !attDate.value) { try { attDate.valueAsDate = new Date(); } catch(e) { /* ignore */ } }
	var attStatus = document.getElementById('att-status');
	var attSave = document.getElementById('att-save');
	var attTable = document.getElementById('att-table');
	var STORAGE_KEY = 'misfat.attendance.v1';

	function loadAttendance() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e) { return []; } }
	function saveAttendance(rows) { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); }
	function renderAttendance() {
		if (!attTable) return;
		var tbody = attTable.querySelector('tbody'); if (!tbody) return;
		var rows = loadAttendance(); tbody.innerHTML = '';
		rows.forEach(function(r, idx){ var tr = document.createElement('tr'); tr.innerHTML = '<td>'+r.matricule+'</td><td>'+r.date+'</td><td>'+r.status+'</td><td><a class="action" data-idx="'+idx+'">Delete</a></td>'; tbody.appendChild(tr); });
		tbody.querySelectorAll('a.action').forEach(function(a){ a.addEventListener('click', function(){ var i = Number(a.getAttribute('data-idx')); var rows = loadAttendance(); rows.splice(i,1); saveAttendance(rows); renderAttendance(); }); });
	}

	if (attSave && attMat && attDate && attStatus && attTable) {
		attSave.addEventListener('click', function(){
			var row = { matricule: (attMat.value||'').trim(), date: attDate.value, status: attStatus.value };
			if (!row.matricule || !row.date) { alert('Enter matricule and date'); return; }
			var rows = loadAttendance(); rows.unshift(row); saveAttendance(rows); renderAttendance(); attMat.value='';
		});
		renderAttendance();
	}

	// Leave requests logic (localStorage)
	var lvMat = document.getElementById('lv-mat');
	var lvType = document.getElementById('lv-type');
	var lvFrom = document.getElementById('lv-from');
	var lvTo = document.getElementById('lv-to');
	var lvNotes = document.getElementById('lv-notes');
	var lvSave = document.getElementById('lv-save');
	var lvTable = document.getElementById('lv-table');
	var LV_KEY = 'misfat.leave.v1';

	function lvLoad(){ try { return JSON.parse(localStorage.getItem(LV_KEY) || '[]'); } catch(e){ return []; } }
	function lvSaveAll(rows){ localStorage.setItem(LV_KEY, JSON.stringify(rows)); }
	function lvRender(){ if (!lvTable) return; var tbody = lvTable.querySelector('tbody'); if (!tbody) return; var rows = lvLoad(); tbody.innerHTML = ''; rows.forEach(function(r, idx){ var tr = document.createElement('tr'); tr.innerHTML = '<td>'+r.matricule+'</td><td>'+r.type+'</td><td>'+r.from+'</td><td>'+r.to+'</td><td><span class="badge '+r.status+'">'+r.status+'</span></td><td><a class="action" data-idx="'+idx+'">Delete</a></td>'; tbody.appendChild(tr); }); tbody.querySelectorAll('a.action').forEach(function(a){ a.addEventListener('click', function(){ var i = Number(a.getAttribute('data-idx')); var rows = lvLoad(); rows.splice(i,1); lvSaveAll(rows); lvRender(); }); }); }

	if (lvSave && lvMat && lvType && lvFrom && lvTo && lvTable) {
		try { if (!lvFrom.value) lvFrom.valueAsDate = new Date(); if (!lvTo.value) lvTo.valueAsDate = new Date(); } catch(e){}
		lvSave.addEventListener('click', function(){ var row = { matricule: (lvMat.value||'').trim(), type: lvType.value, from: lvFrom.value, to: lvTo.value, status: 'pending', notes: (lvNotes && lvNotes.value)||'' }; if (!row.matricule || !row.from || !row.to) { alert('Please fill matricule and dates'); return; } var rows = lvLoad(); rows.unshift(row); lvSaveAll(rows); lvRender(); lvMat.value=''; if (lvNotes) lvNotes.value=''; });
		lvRender();
	}

	// Reports page charts
	var rptDonut = document.getElementById('rpt-donut');
	var rptBars = document.getElementById('rpt-bars');
	if (rptDonut) { var wrap = document.createElement('div'); wrap.className = 'donut'; wrap.id = 'hr-donut'; rptDonut.appendChild(wrap); renderHrDonut({ contract: 925, interns: 575 }); }
	if (rptBars) {
		var rows = (function(){ try { return JSON.parse(localStorage.getItem('misfat.attendance.v1')||'[]'); } catch(e){ return []; } })();
		var byDay = {}; var labels = [];
		for (var i=6; i>=0; i--) { var d = new Date(); d.setDate(d.getDate()-i); var key = d.toISOString().slice(0,10); labels.push(key.slice(5)); byDay[key] = 0; }
		rows.forEach(function(r){ if (byDay.hasOwnProperty(r.date) && r.status === 'Present') byDay[r.date]++; });
		var container = document.createElement('div'); container.className = 'bars';
		labels.forEach(function(l){ var bar = document.createElement('div'); bar.className = 'bar'; var key1 = new Date().getFullYear() + '-' + l; var val = byDay[key1] || 0; var h = Math.min(100, val * 10); bar.style.height = h + '%'; bar.setAttribute('data-label', l); container.appendChild(bar); });
		rptBars.appendChild(container);
	}
})();
