// Pruefung fuer das Wartelisten-Formular auf den Startseiten (alle 6 Sprachen).
// Nur Gmail-Adressen (@gmail.com oder @googlemail.com): der Zugang laeuft ueber
// Google Play (Tests), siehe Hinweis unter dem Formular. Solange das
// Eingabefeld noch "disabled" ist, zeigt der Knopf nur die "oeffnet in
// Kuerze"-Meldung direkt auf der Seite (kein Browser-Popup) - die Pruefung
// greift automatisch, sobald das Feld freigeschaltet wird. Es wird nichts
// gesendet oder gespeichert.
(function () {
  var GMAIL = /^[a-z0-9._%+\-]+@(gmail|googlemail)\.com$/;

  window.isValidGmail = function (value) {
    return GMAIL.test(String(value || '').trim().toLowerCase());
  };

  window.waitlistSubmit = function (button) {
    var form = button.closest('.waitlist-form');
    var input = form.querySelector('input');
    var error = document.getElementById('waitlist-error');
    var status = document.getElementById('waitlist-status');

    function showSoon() {
      error.hidden = true;
      input.removeAttribute('aria-invalid');
      status.textContent = form.getAttribute('data-soon');
      status.hidden = false;
    }

    if (input.disabled) {
      showSoon();
      return;
    }
    if (!window.isValidGmail(input.value)) {
      status.hidden = true;
      error.textContent = form.getAttribute('data-invalid');
      error.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    showSoon();
  };
})();
