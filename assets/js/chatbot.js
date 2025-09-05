(function() {
  const fab = document.getElementById('chatbot-fab');
  const panel = document.getElementById('chatbot-panel');
  if (!fab || !panel) return;

  const body = document.getElementById('chatbot-body');
  const input = document.getElementById('chatbot-input');
  const send = document.getElementById('chatbot-send');
  const closeBtn = document.getElementById('chatbot-close');

  function toggle(open) {
    panel.style.display = open ? 'block' : 'none';
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) input.focus();
  }

  function addMsg(text, isUser) {
    const el = document.createElement('div');
    el.className = 'chatbot-msg' + (isUser ? ' user' : '');
    
    if (isUser) {
      el.innerHTML = `<span>${text}</span>`;
    } else {
      el.innerHTML = `<span class="robot-icon">🤖</span><span>${text}</span>`;
    }
    
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  async function onSend() {
    const text = (input.value || '').trim();
    if (!text) return;
    addMsg(text, true);
    input.value = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      addMsg(String(data.reply || '')), false;
    } catch (e) {
      addMsg('Sorry, I could not reach the assistant right now.', false);
    }
  }

  fab.addEventListener('click', () => toggle(panel.style.display !== 'block'));
  closeBtn.addEventListener('click', () => toggle(false));
  send.addEventListener('click', onSend);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') onSend(); });
})();


