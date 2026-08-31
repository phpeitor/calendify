document.addEventListener('DOMContentLoaded', async function () {
  const body = document.getElementById('citas-table-body');
  const table = document.getElementById('citas-datatable');
  if (!body || !table) return;

  function randomAvatar() {
    const num = String(Math.floor(Math.random() * 10) + 1).padStart(2, '0');
    return `./images/${num}.jpg`;
  }

  function getEstadoBadge(estado) {
    const value = (estado || 'Enviado').toString();
    const map = {
      Enviado: 'bg-secondary',
      Confirmado: 'bg-success',
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

      alertify.success(`Cita ${nuevoEstado.toLowerCase()} correctamente`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alertify.error(error.message || 'Error al actualizar la cita');
    }
  }

  try {
    const res = await fetch('./js/citas.json', { cache: 'no-store' });
    const json = await res.json();
    const citas = Array.isArray(json.events) ? json.events : [];

    if (!citas.length) {
      body.innerHTML = `
        <tr>
          <td colspan="10" class="text-center py-4">No hay citas registradas.</td>
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
        <td>${getEstadoBadge(cita.estado)}</td>
        <td>
          <div class="d-flex align-items-center list-action">
            <button type="button" class="btn btn-sm btn-success mr-2" data-action="confirmar" data-id="${cita.id || ''}">Confirmar</button>
            <button type="button" class="btn btn-sm btn-danger" data-action="cancelar" data-id="${cita.id || ''}">Cancelar</button>
          </div>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        const action = this.getAttribute('data-action');
        if (!id) return;
        updateCitaEstado(id, action === 'confirmar' ? 'Confirmado' : 'Cancelado');
      });
    });

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
