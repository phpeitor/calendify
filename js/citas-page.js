document.addEventListener('DOMContentLoaded', async function () {
  const body = document.getElementById('citas-table-body');
  const table = document.getElementById('citas-datatable');
  const dateRange = document.getElementById('citas-date-range');
  if (!body || !table || !dateRange) return;

  function randomAvatar() {
    const num = String(Math.floor(Math.random() * 10) + 1).padStart(2, '0');
    return `./images/${num}.jpg`;
  }

  function getEstadoBadge(estado) {
    const value = (estado || 'Enviado').toString();
    const map = {
      Enviado: 'bg-secondary',
      Confirmado: 'bg-success',
      Anulado: 'bg-danger',
      Cancelado: 'bg-danger'
    };
    return `<span class="badge ${map[value] || 'bg-secondary'}">${value}</span>`;
  }

  async function updateCitaEstado(id, nuevoEstado) {
    try {
      const response = await fetch('./php/update_estado_cita.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ id, estado: nuevoEstado })
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'No se pudo actualizar la cita');
      }

      const estadoMensaje = nuevoEstado === 'Confirmado' ? 'confirmada' : 'anulada';
      alertify.success(`Cita ${estadoMensaje} correctamente`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alertify.error(error.message || 'Error al actualizar la cita');
    }
  }

  function getToday() {
    const date = new Date();
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }

  function getDateThirtyDaysAgo() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }

  function renderTable(citas) {
    if (window.jQuery && $.fn.DataTable && $.fn.dataTable.isDataTable('#citas-datatable')) {
      $('#citas-datatable').DataTable().destroy();
    }

    if (!citas.length) {
      body.innerHTML = `
        <tr>
          <td colspan="10" class="text-center py-4">No hay citas para el rango seleccionado.</td>
        </tr>
      `;
    } else {
      body.innerHTML = citas.map((cita) => `
        <tr>
          <td class="sorting_1">
            <img src="${randomAvatar()}" class="rounded avatar-40 img-fluid" alt="${cita.nombre || 'Cita'}">
          </td>
          <td>${cita.profesional || '-'}</td>
          <td>${cita.nombre || '-'}</td>
          <td>${cita.dni || '-'}</td>
          <td>${cita.telefono || '-'}</td>
          <td>${cita.fecha_cita || '-'}</td>
          <td>${(cita.start || '') + (cita.end ? ' - ' + cita.end : '') || '-'}</td>
          <td>${cita.direccion || '-'}</td>
          <td>${getEstadoBadge(cita.estado)}</td>
          <td>
            <div class="d-flex align-items-center list-action">
              <button type="button" class="btn btn-sm btn-success mr-2" data-action="confirmar" data-id="${cita.id || ''}" title="Confirmar" aria-label="Confirmar cita" ${(cita.estado === 'Confirmado' || cita.estado === 'Anulado' || cita.estado === 'Cancelado') ? 'disabled' : ''}>
                <i class="ri-check-line" aria-hidden="true"></i>
              </button>
              <button type="button" class="btn btn-sm btn-danger" data-action="anular" data-id="${cita.id || ''}" title="Anular" aria-label="Anular cita" ${(cita.estado === 'Confirmado' || cita.estado === 'Anulado' || cita.estado === 'Cancelado') ? 'disabled' : ''}>
                <i class="ri-close-line" aria-hidden="true"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    document.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        const action = this.getAttribute('data-action');
        if (!id) return;
        updateCitaEstado(id, action === 'confirmar' ? 'Confirmado' : 'Anulado');
      });
    });

    if (window.jQuery && $.fn.DataTable) {
      $('#citas-datatable').DataTable({
        pageLength: 10,
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        ordering: true,
        searching: true,
        info: true,
        paging: true,
        language: {
          emptyTable: 'No hay citas registradas.',
          lengthMenu: 'Mostrar _MENU_ entradas',
          zeroRecords: 'No se encontraron resultados',
          info: 'Mostrando _START_ a _END_ de _TOTAL_ citas',
          infoEmpty: 'No hay citas para mostrar',
          search: 'Buscar:',
          paginate: {
            previous: 'Anterior',
            next: 'Siguiente'
          }
        }
      });
    }
  }

  function filterCitas(citas, startDate, endDate) {
    return citas.filter((cita) => {
      const fecha = (cita.fecha_cita || '').slice(0, 10);
      return fecha >= startDate && fecha <= endDate;
    });
  }

  try {
    const res = await fetch('./js/citas.json', { cache: 'no-store' });
    const json = await res.json();
    const citas = Array.isArray(json.events) ? json.events : [];

    const defaultStart = getDateThirtyDaysAgo();
    const defaultEnd = getToday();

    if (window.jQuery && $.fn.daterangepicker && window.moment) {
      $(dateRange).daterangepicker({
        startDate: moment(defaultStart),
        endDate: moment(defaultEnd),
        maxDate: moment(defaultEnd),
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
      }, function (start, end) {
        renderTable(filterCitas(citas, start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')));
      });
    }

    renderTable(filterCitas(citas, defaultStart, defaultEnd));
  } catch (error) {
    console.error('No se pudieron cargar las citas:', error);
    body.innerHTML = `
      <tr>
        <td colspan="10" class="text-center py-4 text-danger">No se pudo cargar la información.</td>
      </tr>
    `;
  }
});
