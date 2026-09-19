document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('volunteers-filter');
  const dateRange = document.getElementById('volunteers-date-range');
  const table = document.getElementById('volunteers-datatable');
  const head = document.getElementById('volunteers-table-head');
  const body = document.getElementById('volunteers-table-body');

  if (!form || !dateRange || !table || !head || !body) return;

  const VOLUNTEERS_LIMIT = 100;

  const columns = [
    { key: 'id', label: 'Id' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'dni', label: 'DNI' },
    { key: 'created_at', label: 'Fecha Registro' },
    { key: 'fecha_nacimiento', label: 'Fecha Nacimiento' },
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'comentario', label: 'Comentario' }
  ];

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function toDateString(date) {
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate())
    ].join('-');
  }

  function toUtcRangeStart(dateStr) {
    return `${dateStr}T00:00:00+00:00`;
  }

  function toUtcRangeEnd(dateStr) {
    return `${dateStr}T00:00:00+00:00`;
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

    head.innerHTML = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('');
    body.innerHTML = rows.map((row) => `
      <tr>
        ${columns.map((column) => {
          const value = row?.[column.key];
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
    let since = '';
    let until = '';

    if (window.jQuery && $.fn.daterangepicker && $(dateRange).data('daterangepicker')) {
      const picker = $(dateRange).data('daterangepicker');
      since = picker.startDate.format('YYYY-MM-DD');
      until = picker.endDate.clone().add(1, 'day').format('YYYY-MM-DD');
    } else {
      const parts = (dateRange.value || '').split(' - ');
      since = parts[0] || '';
      until = parts[1] || '';
    }

    if (!since || !until) {
      alertify.warning('Seleccione un rango de fechas');
      return;
    }

    const params = new URLSearchParams({
      since: toUtcRangeStart(since),
      until: toUtcRangeEnd(until),
      limit: String(VOLUNTEERS_LIMIT)
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

  if (window.jQuery && $.fn.daterangepicker && window.moment) {
    $(dateRange).daterangepicker({
      startDate: moment(toDateString(defaultSince), 'YYYY-MM-DD'),
      endDate: moment(toDateString(defaultUntil), 'YYYY-MM-DD'),
      autoUpdateInput: true,
      locale: {
        format: 'YYYY-MM-DD',
        applyLabel: 'Aplicar',
        cancelLabel: 'Limpiar',
        fromLabel: 'Desde',
        toLabel: 'Hasta',
        customRangeLabel: 'Personalizado',
        daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        firstDay: 1
      }
    }, function () {
      loadVolunteers();
    });
  } else {
    dateRange.value = `${toDateString(defaultSince)} - ${toDateString(defaultUntil)}`;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    loadVolunteers();
  });

  loadVolunteers();
});
