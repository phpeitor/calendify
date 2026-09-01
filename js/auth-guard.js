(function () {
  fetch('./php/auth_check.php', { cache: 'no-store', credentials: 'same-origin' })
    .then(function (response) { return response.json(); })
    .then(function (result) {
      if (!result.authenticated) {
        var target = encodeURIComponent(window.location.pathname.split('/').pop() + window.location.search);
        window.location.replace('./login.html?redirect=' + target);
      }
    })
    .catch(function () {
      window.location.replace('./login.html');
    });
})();
