/* Perimeter Pest Control — reviews filter */
(function () {
  "use strict";
  var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
  var wall = document.getElementById("reviewsWall");
  var empty = document.getElementById("reviewsEmpty");
  if (!chips.length || !wall) return;
  var cards = Array.prototype.slice.call(wall.querySelectorAll(".review"));

  function apply(filter) {
    var shown = 0;
    cards.forEach(function (card) {
      var match = filter === "all" || card.dataset.cat === filter;
      card.classList.toggle("is-hidden", !match);
      if (match) shown++;
    });
    if (empty) empty.style.display = shown === 0 ? "block" : "none";
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) {
        var active = c === chip;
        c.classList.toggle("is-active", active);
        c.setAttribute("aria-pressed", String(active));
      });
      apply(chip.dataset.filter);
    });
  });
})();
