(function() {
  const form = document.getElementById('checker-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const symptom = document.getElementById('symptom').value;
    const intensity = (new FormData(form)).get('intensity');
    const durationValue = parseInt(document.getElementById('duration').value, 10);
    const durationUnit = document.getElementById('duration-unit').value;

    if (!symptom || !intensity || isNaN(durationValue)) {
      alert('Please complete all steps.');
      return;
    }

    const params = new URLSearchParams({
      symptom,
      intensity,
      duration: String(durationValue),
      unit: durationUnit
    });

    window.location.href = `result.html?${params.toString()}`;
  });
})();


