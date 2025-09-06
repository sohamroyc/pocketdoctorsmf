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

  async function getAIAnalysis(symptom, intensity, duration, unit) {
    try {
      const symptomText = `${symptom} (${intensity} intensity, ${duration} ${unit})`;
      const response = await fetch('/api/analyze-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptomText })
      });
      
      if (!response.ok) {
        throw new Error('AI analysis failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('AI analysis error:', error);
      return null;
    }
  }

  async function render() {
    const { symptom, intensity, duration, unit } = getParams();
    if (!symptom || !intensity || !duration) {
      window.location.replace('checker.html');
      return;
    }

    qs('#res-symptom').textContent = symptom;
    qs('#res-intensity').textContent = intensity;
    qs('#res-duration').textContent = `${duration} ${unit}`;

    // Show loading state
    const badge = qs('#risk-badge');
    const suggestionIcon = qs('#suggestion-icon');
    const suggestionText = qs('#suggestion-text');
    
    badge.textContent = 'ANALYZING...';
    badge.className = 'risk-badge risk-yellow';
    suggestionIcon.textContent = '⏳';
    suggestionText.textContent = 'AI is analyzing your symptoms...';

    // Try to get AI analysis
    const aiAnalysis = await getAIAnalysis(symptom, intensity, duration, unit);
    
    if (aiAnalysis) {
      // Use AI analysis
      badge.textContent = aiAnalysis.riskLevel.toUpperCase();
      badge.className = 'risk-badge';
      badge.classList.add(`risk-${aiAnalysis.riskLevel === 'low' ? 'green' : aiAnalysis.riskLevel === 'moderate' ? 'yellow' : 'red'}`);
      
      suggestionIcon.textContent = aiAnalysis.riskLevel === 'low' ? '✅' : aiAnalysis.riskLevel === 'moderate' ? '⚠️' : '🚨';
      suggestionText.textContent = aiAnalysis.analysis;
      
      // Update recommendations if element exists
      const recommendationsEl = qs('#recommendations');
      if (recommendationsEl && aiAnalysis.recommendations) {
        recommendationsEl.innerHTML = aiAnalysis.recommendations.map(rec => `<li>${rec}</li>`).join('');
      }
      
      // Update medical help if element exists
      const medicalHelpEl = qs('#medical-help');
      if (medicalHelpEl && aiAnalysis.medicalHelp) {
        medicalHelpEl.textContent = aiAnalysis.medicalHelp;
      }
    } else {
      // Fallback to basic risk calculation
      const risk = computeRisk(intensity, duration, unit);
      badge.textContent = risk.toUpperCase();
      badge.classList.remove('risk-green', 'risk-yellow', 'risk-red');
      badge.classList.add(`risk-${risk}`);

      const s = getSuggestion(risk, symptom);
      suggestionIcon.textContent = s.icon;
      suggestionText.textContent = s.text;
    }

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


