document.addEventListener('DOMContentLoaded', async function () {
  const body = document.getElementById('citas-table-body');
  const table = document.getElementById('citas-datatable');
  if (!body || !table) return;

  function randomAvatar() {
    const num = String(Math.floor(Math.random() * 10) + 1).padStart(2, '0');
    return `./images/${num}.jpg`;
  }

  try {
    const res = await fetch('./js/citas.json', { cache: 'no-store' });
    const json = await res.json();
    const citas = Array.isArray(json.events) ? json.events : [];

    if (!citas.length) {
      body.innerHTML = `
        <tr>
          <td colspan="9" class="text-center py-4">No hay citas registradas.</td>
        </tr>
      `;
      return;
    }

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
        <td>
          <div class="d-flex align-items-center list-action">
            <a class="badge bg-warning-light mr-2" data-toggle="tooltip" data-placement="top" title="Rating" href="#"><i class="far fa-star"></i></a>
            <a class="badge bg-success-light mr-2" data-toggle="tooltip" data-placement="top" title="Ver" href="#"><i class="lar la-eye"></i></a>
            <div class="badge bg-primary-light" data-toggle="tooltip" data-placement="top" title="Acción">
              <div class="dropdown">
                <div class="text-primary dropdown-toggle action-item" id="moreOptions${Math.random().toString(16).slice(2)}" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false"></div>
                <div class="dropdown-menu" aria-labelledby="moreOptions${Math.random().toString(16).slice(2)}">
                  <a class="dropdown-item" href="#">Edit</a>
                  <a class="dropdown-item" href="#">Delete</a>
                  <a class="dropdown-item" href="#">Hide from Contacts</a>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    `).join('');

    if (window.jQuery && $.fn.DataTable) {
      if ($.fn.dataTable.isDataTable('#citas-datatable')) {
        $('#citas-datatable').DataTable().destroy();
      }

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
  } catch (error) {
    console.error('No se pudieron cargar las citas:', error);
    body.innerHTML = `
      <tr>
        <td colspan="9" class="text-center py-4 text-danger">No se pudo cargar la información.</td>
      </tr>
    `;
  }
});
