(function () {
  fetch('./php/auth_check.php', { cache: 'no-store', credentials: 'same-origin' })
    .then(function (response) { return response.json(); })
    .then(function (result) {
      if (result.authenticated) {
        window.location.replace('./citas.html');
      }
    })
    .catch(function () {});
})();
