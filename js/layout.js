function bindDialogTriggers() {
  document.querySelectorAll('[data-open]').forEach((el) => {
    el.onclick = function (e) {
      e.preventDefault();
      const dlg = document.getElementById(el.getAttribute('data-open'));
      if (dlg) dlg.showModal();
    };
  });

  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.onclick = function () {
      const dlg = btn.closest('dialog');
      if (dlg) dlg.close();
    };
  });
}

function bindLogout() {
  document.querySelectorAll('.btn_logout').forEach((btn) => {
    btn.onclick = async function (e) {
      e.preventDefault();

      try {
        await fetch('./php/auth_logout.php', {
          method: 'POST',
          cache: 'no-store',
          credentials: 'same-origin'
        });
      } catch (error) {
        console.error('No se pudo cerrar sesion:', error);
      }

      window.location.replace('./login.html');
    };
  });
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isPublicIndexPage() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  return page === '' || page === 'index.html';
}

function hideSessionMenuOnPublicPage() {
  if (!isPublicIndexPage()) return;

  document.querySelectorAll('.caption-content').forEach((node) => {
    node.remove();
  });
}

async function loadSessionUser() {
  const userNode = document.querySelector('.nom_user');
  if (!userNode) return;

  try {
    const response = await fetch('./php/auth_check.php', {
      cache: 'no-store',
      credentials: 'same-origin'
    });
    const result = await response.json();
    if (!result.authenticated || !result.user) return;

    userNode.innerHTML = `${escapeHtml(result.user)}<i class="las la-angle-down ml-3"></i>`;
  } catch (error) {
    console.error('No se pudo cargar el usuario de sesion:', error);
  }
}

async function loadLayoutFragments() {
  try {
    const [headerHtml, footerHtml, dialogsHtml] = await Promise.all([
      fetch('./layout/header.html').then((r) => r.text()),
      fetch('./layout/footer.html').then((r) => r.text()),
      fetch('./layout/dialog.html').then((r) => r.text())
    ]);

    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');
    const dialogsContainer = document.getElementById('dialogs-container');

    if (headerContainer) headerContainer.innerHTML = headerHtml;
    if (footerContainer) footerContainer.innerHTML = footerHtml;
    if (dialogsContainer) dialogsContainer.innerHTML = dialogsHtml;

    const yearNode = document.querySelector('[data-current-year]');
    if (yearNode) {
      yearNode.textContent = new Date().getFullYear();
    }

    bindDialogTriggers();
    hideSessionMenuOnPublicPage();
    bindLogout();
    loadSessionUser();
  } catch (error) {
    console.error('No se pudieron cargar los fragmentos de layout:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadLayoutFragments);
