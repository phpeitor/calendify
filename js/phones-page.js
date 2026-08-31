document.addEventListener('DOMContentLoaded', async function () {
  const results = document.getElementById('phones-results');
  if (!results) return;

  const icons = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

  function escapeHtml(value) {
    return String(value ?? '-').replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
    }[character]));
  }

  function normalizePhone(phone) {
    return String(phone || '').replace(/\D/g, '');
  }

  function groupByDni(citas) {
    const groups = new Map();

    citas.forEach((cita) => {
      const dni = String(cita.dni || '').trim();
      if (!dni) return;

      if (!groups.has(dni)) {
        groups.set(dni, {
          dni,
          nombre: cita.nombre || 'Paciente',
          telefonos: new Set()
        });
      }

      const phone = normalizePhone(cita.telefono);
      if (phone) groups.get(dni).telefonos.add(phone);
    });

    return Array.from(groups.values());
  }

  function render(groups) {
    if (!groups.length) {
      results.innerHTML = '<div class="col-12"><p class="text-center py-4">No hay teléfonos registrados.</p></div>';
      return;
    }

    results.innerHTML = groups.map((group, index) => {
      const phones = Array.from(group.telefonos);
      const primaryPhone = phones[0] || '';
      const phoneItems = phones.length
        ? phones.map((phone) => `<a href="tel:${phone}" class="d-block mb-1"><i class="ri-phone-line mr-1" aria-hidden="true"></i>${escapeHtml(phone)}</a>`).join('')
        : '<span class="text-muted">Sin teléfono registrado</span>';
      const whatsapp = primaryPhone
        ? `<a href="https://wa.me/${primaryPhone}" target="_blank" rel="noopener" class="btn btn-icon rounded-circle title-whatsapp iq-card-btn" title="WhatsApp" aria-label="Contactar por WhatsApp"><i class="ri-whatsapp-line m-0"></i></a>`
        : '';

      return `
        <div class="col-sm-6 col-md-6 col-lg-3 mt-4">
          <div class="card card-block card-stretch card-height">
            <div class="card-body">
              <div class="subscriber-detail text-center">
                <div class="image mb-2 position-relative d-inline-block">
                  <img src="./images/${icons[index % icons.length]}.jpg" alt="${escapeHtml(group.nombre)}" class="img-fluid rounded-circle avatar-100 text-center">
                  ${whatsapp}
                </div>
                <h5>${escapeHtml(group.nombre)}</h5>
                <p class="mb-2">DNI: ${escapeHtml(group.dni)}</p>
                <div class="text-left">${phoneItems}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  try {
    const response = await fetch('./js/citas.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('No se pudo cargar citas.json');
    const json = await response.json();
    const citas = Array.isArray(json.events) ? json.events : [];
    render(groupByDni(citas));
  } catch (error) {
    console.error('No se pudieron cargar los teléfonos:', error);
    results.innerHTML = '<div class="col-12"><p class="text-center text-danger py-4">No se pudo cargar la información.</p></div>';
  }
});