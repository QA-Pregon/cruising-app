// Wartelisten-Formular auf den Startseiten (alle 6 Sprachen): Anmeldung fuer die
// Android-Tests. Normale E-Mail-Pruefung (keine Gmail-Pflicht, der Hinweis auf
// das Google-Konto steht nur unter dem Formular) plus Einwilligungs-Haekchen.
// Solange das Eingabefeld noch "disabled" ist, zeigt der Knopf nur die
// "oeffnet in Kuerze"-Meldung direkt auf der Seite (kein Browser-Popup). Ist es
// freigeschaltet, geht die Anmeldung an die Cloud Function submitTesterSignup
// (functions/src/testerSignup.ts), die sie fuer den Admin in Firestore ablegt.
(function () {
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var ENDPOINT = 'https://europe-west1-cruising-1.cloudfunctions.net/submitTesterSignup';

  window.isValidEmail = function (value) {
    return EMAIL.test(String(value || '').trim().toLowerCase());
  };

  window.waitlistSubmit = function (button) {
    var form = button.closest('.waitlist-form');
    var input = form.querySelector('input');
    var consent = document.getElementById('waitlist-consent');
    var honeypot = document.getElementById('waitlist-hp');
    var error = document.getElementById('waitlist-error');
    var status = document.getElementById('waitlist-status');

    function showStatus(text) {
      error.hidden = true;
      input.removeAttribute('aria-invalid');
      status.textContent = text;
      status.hidden = false;
    }

    function showError(text) {
      status.hidden = true;
      error.textContent = text;
      error.hidden = false;
    }

    if (input.disabled) {
      showStatus(form.getAttribute('data-soon'));
      return;
    }
    if (!window.isValidEmail(input.value)) {
      showError(form.getAttribute('data-invalid'));
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    if (!consent.checked) {
      showError(form.getAttribute('data-consent'));
      consent.focus();
      return;
    }

    button.disabled = true;
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: input.value.trim(),
        lang: document.documentElement.lang || 'de',
        consent: true,
        website: honeypot ? honeypot.value : ''
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('http ' + res.status);
      showStatus(form.getAttribute('data-sent'));
      input.value = '';
      input.disabled = true;
      consent.disabled = true;
    }).catch(function () {
      showError(form.getAttribute('data-failed'));
      button.disabled = false;
    });
  };
})();
