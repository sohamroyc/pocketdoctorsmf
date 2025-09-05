(function() {
  const qs = (s) => document.querySelector(s);

  function getParams() {
    const p = new URLSearchParams(window.location.search);
    return {
      symptom: p.get('symptom') || '',
      intensity: p.get('intensity') || '',
      duration: Number(p.get('duration') || 0),
      unit: p.get('unit') || 'hours'
    };
  }

  function computeRisk(intensity, duration, unit) {
    let durationHours = duration * (unit === 'days' ? 24 : 1);
    let score = 0;
    if (intensity === 'mild') score += 1; else if (intensity === 'moderate') score += 2; else if (intensity === 'severe') score += 3;
    if (durationHours >= 72) score += 2; else if (durationHours >= 24) score += 1;

    if (score <= 2) return 'green';
    if (score === 3 || score === 4) return 'yellow';
    return 'red';
  }

  function getSuggestion(risk, symptom) {
    const map = {
      green: {
        icon: '✅',
        text: 'Low immediate risk. Monitor symptoms, rest, and hydrate.'
      },
      yellow: {
        icon: '⚠️',
        text: 'Moderate risk. Consider contacting a healthcare provider if symptoms persist.'
      },
      red: {
        icon: '🚨',
        text: 'High risk. Seek urgent medical attention.'
      }
    };
    return map[risk];
  }

  function render() {
    const { symptom, intensity, duration, unit } = getParams();
    if (!symptom || !intensity || !duration) {
      window.location.replace('checker.html');
      return;
    }

    qs('#res-symptom').textContent = symptom;
    qs('#res-intensity').textContent = intensity;
    qs('#res-duration').textContent = `${duration} ${unit}`;

    const risk = computeRisk(intensity, duration, unit);
    const badge = qs('#risk-badge');
    badge.textContent = risk.toUpperCase();
    badge.classList.remove('risk-green', 'risk-yellow', 'risk-red');
    badge.classList.add(`risk-${risk}`);

    const s = getSuggestion(risk, symptom);
    qs('#suggestion-icon').textContent = s.icon;
    qs('#suggestion-text').textContent = s.text;

    qs('#find-help').addEventListener('click', function(e) {
      e.preventDefault();
      alert('Find Nearby Help: Coming soon.');
    });
    qs('#sos').addEventListener('click', function(e) {
      e.preventDefault();
      alert('SOS feature: Coming soon.');
    });
  }

  render();
})();


