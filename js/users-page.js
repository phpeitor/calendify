document.addEventListener('DOMContentLoaded', async function () {
  const input = document.getElementById('dni-search');
  const searchButton = document.getElementById('dni-search-button');
  const results = document.getElementById('users-results');
  const pagination = document.getElementById('users-pagination');
  if (!input || !searchButton || !results || !pagination) return;

  const pageSize = 10;
  const icons = ['ri-calendar-check-line', 'ri-file-list-3-line', 'ri-user-line', 'ri-time-line', 'ri-briefcase-line'];
  let matchingCitas = [];
  let currentPage = 1;

  function escapeHtml(value) {
    return String(value ?? '-').replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
    }[character]));
  }

  function showMessage(message, type = 'muted') {
    results.innerHTML = `<div class="col-12"><p class="text-center text-${type} py-4">${escapeHtml(message)}</p></div>`;
    pagination.innerHTML = '';
  }

  function getEstadoLabel(estado) {
    const value = estado || 'Enviado';
    const normalized = value === 'Cancelado' ? 'Anulado' : value;
    const className = normalized.toLowerCase();
    return `<span class="users-status users-status-${className}">${escapeHtml(normalized)}</span>`;
  }

  function renderPagination() {
    const totalPages = Math.ceil(matchingCitas.length / pageSize);
    pagination.innerHTML = totalPages <= 1 ? '' : Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      return `<li class="page-item ${page === currentPage ? 'active' : ''}">
        <button type="button" class="page-link" data-page="${page}">${page}</button>
      </li>`;
    }).join('');

    pagination.querySelectorAll('[data-page]').forEach((button) => {
      button.addEventListener('click', function () {
        currentPage = Number(this.dataset.page);
        renderResults();
      });
    });
  }

  function renderResults() {
    const start = (currentPage - 1) * pageSize;
    const pageCitas = matchingCitas.slice(start, start + pageSize);
    results.innerHTML = pageCitas.map((cita, index) => `
      <div class="col-xl-3 col-lg-4 col-md-6">
        <div class="card card-block card-stretch card-height">
          <div class="card-body rounded work-detail work-detail-${index % 2 ? 'danger' : 'info'}">
            <div class="icon iq-icon-box-2 mb-3 rounded">
              <i class="${icons[(start + index) % icons.length]}" aria-hidden="true"></i>
            </div>
            <h5 class="mb-2">${escapeHtml(cita.nombre || 'Cita')}</h5>
            <p class="card-description mb-2">DNI: ${escapeHtml(cita.dni)}<br>Profesional: ${escapeHtml(cita.profesional)}<br>Fecha: ${escapeHtml(cita.fecha_cita)}<br>Horario: ${escapeHtml(cita.start)} - ${escapeHtml(cita.end)}</p>
            <div class="pt-2">Estado: ${getEstadoLabel(cita.estado)}</div>
          </div>
        </div>
      </div>
    `).join('');
    renderPagination();
  }

  async function searchByDni() {
    const dni = input.value.replace(/\D/g, '');
    input.value = dni;
    currentPage = 1;
    if (!dni) {
      matchingCitas = [];
      showMessage('Ingrese un DNI para buscar.');
      return;
    }

    try {
      const response = await fetch('./js/citas.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('No se pudo cargar citas.json');
      const json = await response.json();
      const citas = Array.isArray(json.events) ? json.events : [];
      matchingCitas = citas.filter((cita) => String(cita.dni || '').replace(/\D/g, '') === dni);
      if (!matchingCitas.length) {
        showMessage(`No se encontraron citas para el DNI ${dni}.`);
        return;
      }
      renderResults();
    } catch (error) {
      console.error(error);
      showMessage('No se pudo consultar las citas.', 'danger');
    }
  }

  searchButton.addEventListener('click', searchByDni);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') searchByDni();
  });
  showMessage('Ingrese un DNI para buscar sus citas.');
});