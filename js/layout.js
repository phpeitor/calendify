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
    bindLogout();
  } catch (error) {
    console.error('No se pudieron cargar los fragmentos de layout:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadLayoutFragments);
