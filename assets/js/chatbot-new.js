// Simple Chatbot Implementation
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing new chatbot...');
  
  const fab = document.getElementById('chatbot-fab');
  const panel = document.getElementById('chatbot-panel');
  
  if (!fab || !panel) {
    console.error('Chatbot elements not found');
    return;
  }
  
  console.log('Chatbot elements found');
  
  // Simple toggle function
  function toggleChatbot() {
    console.log('Toggle called, current display:', panel.style.display);
    
    if (panel.style.display === 'block') {
      panel.style.display = 'none';
      panel.setAttribute('aria-hidden', 'true');
      console.log('Chatbot closed');
    } else {
      panel.style.display = 'block';
      panel.setAttribute('aria-hidden', 'false');
      console.log('Chatbot opened');
      
      // Focus input after a short delay
      setTimeout(() => {
        const input = document.getElementById('chatbot-input');
        if (input) input.focus();
      }, 100);
    }
  }
  
  // Make it globally available
  window.toggleChatbot = toggleChatbot;
  
  // Add click event to FAB
  fab.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('FAB clicked');
    toggleChatbot();
  });
  
  // Add close button functionality
  const closeBtn = document.getElementById('chatbot-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Close button clicked');
      panel.style.display = 'none';
      panel.setAttribute('aria-hidden', 'true');
    });
  }
  
  // Add send functionality
  const sendBtn = document.getElementById('chatbot-send');
  const input = document.getElementById('chatbot-input');
  const body = document.getElementById('chatbot-body');
  
  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-msg' + (isUser ? ' user' : '');
    
    if (isUser) {
      messageDiv.innerHTML = `<span>${text}</span>`;
    } else {
      messageDiv.innerHTML = `<span class="robot-icon">🤖</span><span>${text}</span>`;
    }
    
    body.appendChild(messageDiv);
    body.scrollTop = body.scrollHeight;
  }
  
  function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-msg typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <span class="robot-icon">🤖</span>
      <span class="typing-dots">
        <span>.</span><span>.</span><span>.</span>
      </span>
    `;
    body.appendChild(typingDiv);
    body.scrollTop = body.scrollHeight;
  }
  
  function removeTypingIndicator() {
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) {
      typingEl.remove();
    }
  }
  
  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    input.value = '';
    
    // Add typing indicator
    addTypingIndicator();
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
      });
      
      const data = await response.json();
      
      // Remove typing indicator
      removeTypingIndicator();
      
      if (response.ok) {
        addMessage(data.reply || 'No response received');
      } else {
        addMessage('Sorry, I could not reach the assistant right now.');
      }
    } catch (error) {
      console.error('Chat error:', error);
      removeTypingIndicator();
      addMessage('Sorry, I could not reach the assistant right now.');
    }
  }
  
  // Add send button click
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
  
  // Add enter key support
  if (input) {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
  
  console.log('New chatbot initialized successfully');
});
