(function() {
  const fab = document.getElementById('chatbot-fab');
  const panel = document.getElementById('chatbot-panel');
  if (!fab || !panel) {
    console.error('Chatbot elements not found:', { fab: !!fab, panel: !!panel });
    return;
  }
  
  console.log('Chatbot elements found, initializing...');

  const body = document.getElementById('chatbot-body');
  const input = document.getElementById('chatbot-input');
  const send = document.getElementById('chatbot-send');
  const closeBtn = document.getElementById('chatbot-close');

  function toggle(open) {
    if (open) {
      panel.classList.add('show');
      panel.setAttribute('aria-hidden', 'false');
      console.log('Panel opened, classes:', panel.className);
      // Small delay to ensure display is set before focusing
      setTimeout(() => input.focus(), 100);
    } else {
      panel.classList.remove('show');
      panel.setAttribute('aria-hidden', 'true');
      console.log('Panel closed, classes:', panel.className);
    }
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

  function addTypingIndicator() {
    const el = document.createElement('div');
    el.className = 'chatbot-msg typing-indicator';
    el.id = 'typing-indicator';
    el.innerHTML = `
      <span class="robot-icon">🤖</span>
      <span class="typing-dots">
        <span>.</span><span>.</span><span>.</span>
      </span>
    `;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function removeTypingIndicator() {
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) {
      typingEl.remove();
    }
  }

  async function onSend() {
    const text = (input.value || '').trim();
    if (!text) return;
    addMsg(text, true);
    input.value = '';
    
    // Add typing indicator
    addTypingIndicator();
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      
      // Remove typing indicator and add response
      removeTypingIndicator();
      addMsg(String(data.reply || ''), false);
    } catch (e) {
      // Remove typing indicator and add error message
      removeTypingIndicator();
      addMsg('Sorry, I could not reach the assistant right now.', false);
    }
  }

  fab.addEventListener('click', () => toggle(!panel.classList.contains('show')));
  closeBtn.addEventListener('click', () => toggle(false));
  send.addEventListener('click', onSend);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') onSend(); });

  // Make toggleChatbot globally available
  window.toggleChatbot = function() {
    console.log('toggleChatbot called, current classes:', panel.className);
    const isCurrentlyOpen = panel.classList.contains('show');
    console.log('isCurrentlyOpen:', isCurrentlyOpen);
    toggle(!isCurrentlyOpen);
  };
  
  // Test function for debugging
  window.testChatbot = function() {
    console.log('Testing chatbot...');
    console.log('Panel element:', panel);
    console.log('Panel classes:', panel.className);
    console.log('Panel aria-hidden:', panel.getAttribute('aria-hidden'));
    console.log('Has show class:', panel.classList.contains('show'));
    toggle(true);
  };
})();


