document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('volunteers-filter');
  const sinceInput = document.getElementById('volunteers-since');
  const untilInput = document.getElementById('volunteers-until');
  const limitInput = document.getElementById('volunteers-limit');
  const table = document.getElementById('volunteers-datatable');
  const head = document.getElementById('volunteers-table-head');
  const body = document.getElementById('volunteers-table-body');

  if (!form || !sinceInput || !untilInput || !limitInput || !table || !head || !body) return;

  const preferredColumns = [
    'id', 'name', 'nombre', 'email', 'correo', 'phone', 'telefono', 'dni', 'created_at', 'createdAt', 'date', 'fecha'
  ];

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function toLocalInputValue(date) {
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate())
    ].join('-') + 'T' + [pad(date.getHours()), pad(date.getMinutes())].join(':');
  }

  function toIsoWithOffset(value) {
    const date = new Date(value);
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const abs = Math.abs(offset);
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate())
    ].join('-') + 'T' + [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(':') + sign + pad(Math.floor(abs / 60)) + ':' + pad(abs % 60);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function normalizeRows(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.volunteers)) return data.volunteers;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  }

  function getColumns(rows) {
    const discovered = Array.from(rows.reduce((keys, row) => {
      if (row && typeof row === 'object' && !Array.isArray(row)) {
        Object.keys(row).forEach((key) => keys.add(key));
      }
      return keys;
    }, new Set()));

    const ordered = preferredColumns.filter((key) => discovered.includes(key));
    return [...ordered, ...discovered.filter((key) => !ordered.includes(key))];
  }

  function renderEmpty(message) {
    if (window.jQuery && $.fn.DataTable && $.fn.dataTable.isDataTable('#volunteers-datatable')) {
      $('#volunteers-datatable').DataTable().destroy();
    }

    head.innerHTML = '<th>Resultado</th>';
    body.innerHTML = `<tr><td class="text-center py-4">${escapeHtml(message)}</td></tr>`;
  }

  function renderTable(rows) {
    if (window.jQuery && $.fn.DataTable && $.fn.dataTable.isDataTable('#volunteers-datatable')) {
      $('#volunteers-datatable').DataTable().destroy();
    }

    if (!rows.length) {
      renderEmpty('No se encontraron voluntarios para el rango seleccionado.');
      return;
    }

    const columns = getColumns(rows);
    head.innerHTML = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('');
    body.innerHTML = rows.map((row) => `
      <tr>
        ${columns.map((column) => {
          const value = row?.[column];
          const text = typeof value === 'object' && value !== null ? JSON.stringify(value) : value;
          return `<td>${escapeHtml(text || '-')}</td>`;
        }).join('')}
      </tr>
    `).join('');

    if (window.jQuery && $.fn.DataTable) {
      $('#volunteers-datatable').DataTable({
        pageLength: 10,
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        ordering: true,
        searching: true,
        info: true,
        paging: true,
        language: {
          emptyTable: 'No hay voluntarios registrados.',
          lengthMenu: 'Mostrar _MENU_ entradas',
          zeroRecords: 'No se encontraron resultados',
          info: 'Mostrando _START_ a _END_ de _TOTAL_ voluntarios',
          infoEmpty: 'No hay voluntarios para mostrar',
          search: 'Buscar:',
          paginate: {
            previous: 'Anterior',
            next: 'Siguiente'
          }
        }
      });
    }
  }

  async function loadVolunteers() {
    const since = sinceInput.value;
    const until = untilInput.value;
    const limit = Math.max(1, Math.min(Number(limitInput.value) || 100, 500));

    if (!since || !until) {
      alertify.warning('Seleccione fecha desde y hasta');
      return;
    }

    const params = new URLSearchParams({
      since: toIsoWithOffset(since),
      until: toIsoWithOffset(until),
      limit: String(limit)
    });

    renderEmpty('Cargando voluntarios...');

    try {
      const response = await fetch(`./php/volunteers_proxy.php?${params.toString()}`, {
        cache: 'no-store',
        credentials: 'same-origin'
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'No se pudo cargar voluntarios');
      }

      renderTable(normalizeRows(result.data));
    } catch (error) {
      console.error(error);
      renderEmpty(error.message || 'No se pudo cargar voluntarios.');
      alertify.error(error.message || 'No se pudo cargar voluntarios');
    }
  }

  const defaultSince = new Date('2026-09-16T00:00:00');
  const defaultUntil = new Date('2026-09-17T00:00:00');
  sinceInput.value = toLocalInputValue(defaultSince);
  untilInput.value = toLocalInputValue(defaultUntil);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    loadVolunteers();
  });

  loadVolunteers();
});
