// Cruising - Spracherkennung/-umschaltung, gemeinsam für alle Seiten.
// Läuft synchron (kein defer/async), damit die Weiterleitung passiert,
// bevor die deutsche Seite überhaupt gerendert wird.
(function () {
    "use strict";
    var SUPPORTED = ["en", "es", "fr", "it", "pl"]; // Deutsch = Root, kein Präfix
    var STORAGE_KEY = "cruising_lang_choice";

    var segments = window.location.pathname.split("/").filter(Boolean);
    var isLocalizedPage = segments.length > 0 && SUPPORTED.indexOf(segments[0]) !== -1;

    if (!isLocalizedPage) {
        var stored = null;
        try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}

        if (!stored) {
            var browserLangs = navigator.languages || [navigator.language || ""];
            var match = null;
            for (var i = 0; i < browserLangs.length; i++) {
                var code = (browserLangs[i] || "").slice(0, 2).toLowerCase();
                if (SUPPORTED.indexOf(code) !== -1) { match = code; break; }
            }
            if (match) {
                var page = segments.length > 0 ? segments[segments.length - 1] : "index.html";
                try { localStorage.setItem(STORAGE_KEY, match); } catch (e) {}
                window.location.replace("/" + match + "/" + page);
            }
        }
    }

    // Umschalter-Menü + "Wahl merken" - erst wenn DOM bereit ist.
    document.addEventListener("DOMContentLoaded", function () {
        var switcher = document.querySelector(".lang-switch");
        if (!switcher) return;
        var btn = switcher.querySelector(".lang-switch-btn");

        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            switcher.classList.toggle("open");
        });
        document.addEventListener("click", function () {
            switcher.classList.remove("open");
        });

        var links = switcher.querySelectorAll(".lang-switch-menu a[data-lang]");
        for (var j = 0; j < links.length; j++) {
            links[j].addEventListener("click", function (e) {
                try { localStorage.setItem(STORAGE_KEY, e.currentTarget.getAttribute("data-lang")); } catch (err) {}
            });
        }
    });
})();
