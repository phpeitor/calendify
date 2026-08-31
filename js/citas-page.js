document.addEventListener('DOMContentLoaded', async function () {
  const body = document.getElementById('citas-table-body');
  const table = document.getElementById('citas-datatable');
  if (!body || !table) return;

  try {
    const res = await fetch('./js/citas.json', { cache: 'no-store' });
    const json = await res.json();
    const citas = Array.isArray(json.events) ? json.events : [];

    if (!citas.length) {
      body.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-4">No hay citas registradas.</td>
        </tr>
      `;
      return;
    }

    body.innerHTML = citas.map((cita) => `
      <tr>
        <td>${cita.profesional || '-'}</td>
        <td>${cita.nombre || '-'}</td>
        <td>${cita.dni || '-'}</td>
        <td>${cita.telefono || '-'}</td>
        <td>${cita.fecha_cita || '-'}</td>
        <td>${(cita.start || '') + (cita.end ? ' - ' + cita.end : '') || '-'}</td>
        <td>${cita.direccion || '-'}</td>
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
        <td colspan="7" class="text-center py-4 text-danger">No se pudo cargar la información.</td>
      </tr>
    `;
  }
});
