// Modern AI Health Assistant
class AIAssistant {
  constructor() {
    this.isOpen = false;
    this.isTyping = false;
    this.init();
  }

  init() {
    console.log('🤖 Initializing AI Assistant...');
    
    // Get elements
    this.btn = document.getElementById('ai-assistant-btn');
    this.panel = document.getElementById('ai-chat-panel');
    this.closeBtn = document.getElementById('ai-chat-close');
    this.input = document.getElementById('ai-chat-input');
    this.sendBtn = document.getElementById('ai-chat-send');
    this.messagesContainer = document.getElementById('ai-chat-messages');

    if (!this.btn || !this.panel) {
      console.error('❌ AI Assistant elements not found');
      return;
    }

    // Add event listeners
    this.btn.addEventListener('click', () => this.toggle());
    this.closeBtn.addEventListener('click', () => this.close());
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-focus input when panel opens
    this.panel.addEventListener('transitionend', () => {
      if (this.isOpen) {
        this.input.focus();
      }
    });

    console.log('✅ AI Assistant initialized successfully');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    console.log('🔓 Opening AI Assistant...');
    this.isOpen = true;
    this.panel.classList.add('show');
    this.btn.style.transform = 'scale(0.95)';
    
    // Update button text
    const textSpan = this.btn.querySelector('.ai-text');
    if (textSpan) {
      textSpan.textContent = 'Close';
    }
  }

  close() {
    console.log('🔒 Closing AI Assistant...');
    this.isOpen = false;
    this.panel.classList.remove('show');
    this.btn.style.transform = 'scale(1)';
    
    // Update button text
    const textSpan = this.btn.querySelector('.ai-text');
    if (textSpan) {
      textSpan.textContent = 'AI Assistant';
    }
  }

  async sendMessage() {
    const message = this.input.value.trim();
    if (!message || this.isTyping) return;

    console.log('📤 Sending message:', message);

    // Check if message is health-related
    if (!this.isHealthRelated(message)) {
      this.addMessage("I'm a health assistant and can only help with health-related questions. Please ask me about symptoms, medical concerns, wellness, or health advice.", 'ai');
      return;
    }

    // Add user message
    this.addMessage(message, 'user');
    this.input.value = '';

    // Show typing indicator
    this.showTyping();

    try {
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
      });

      const data = await response.json();

      // Hide typing indicator
      this.hideTyping();

      if (response.ok) {
        // Add AI response
        const reply = data.reply || 'No response received';
        console.log('✅ AI Response received:', reply);
        this.addMessage(reply, 'ai');
      } else {
        // Show error message
        const errorMsg = 'Sorry, I could not reach the assistant right now. Please try again.';
        console.error('❌ API Error:', data.error);
        this.addMessage(errorMsg, 'ai');
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      this.hideTyping();
      const errorMsg = 'Sorry, I could not reach the assistant right now. Please check your connection and try again.';
      console.log('Adding error message:', errorMsg);
      this.addMessage(errorMsg, 'ai');
    }
  }

  addMessage(content, type = 'ai') {
    console.log('Adding message:', { content, type });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'user' ? 'user-message' : 'ai-message';

    const icon = type === 'user' ? '👤' : '🤖';
    
    messageDiv.innerHTML = `
      <span class="ai-icon">${icon}</span>
      <div class="message-content">
        <p>${this.escapeHtml(content)}</p>
      </div>
    `;

    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
    
    console.log('Message added to DOM:', messageDiv);
  }

  showTyping() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
      <span class="ai-icon">🤖</span>
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;

    this.messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTyping() {
    this.isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 100);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  isHealthRelated(message) {
    const healthKeywords = [
      'health', 'medical', 'doctor', 'hospital', 'clinic', 'medicine', 'medication', 'drug', 'pill',
      'symptom', 'pain', 'ache', 'fever', 'temperature', 'headache', 'cough', 'cold', 'flu',
      'stomach', 'nausea', 'vomit', 'diarrhea', 'constipation', 'breathing', 'chest', 'heart',
      'blood', 'pressure', 'sugar', 'diabetes', 'allergy', 'rash', 'skin', 'wound', 'injury',
      'bone', 'muscle', 'joint', 'back', 'neck', 'shoulder', 'knee', 'ankle', 'foot', 'hand',
      'eye', 'ear', 'nose', 'throat', 'mouth', 'tooth', 'teeth', 'gum', 'sleep', 'insomnia',
      'anxiety', 'stress', 'depression', 'mental', 'therapy', 'counseling', 'exercise', 'fitness',
      'diet', 'nutrition', 'vitamin', 'supplement', 'pregnancy', 'baby', 'child', 'elderly',
      'cancer', 'tumor', 'infection', 'virus', 'bacteria', 'immune', 'vaccine', 'immunization',
      'emergency', 'urgent', 'severe', 'chronic', 'acute', 'diagnosis', 'treatment', 'cure',
      'wellness', 'prevention', 'checkup', 'examination', 'test', 'scan', 'xray', 'mri', 'ct',
      'surgery', 'operation', 'procedure', 'recovery', 'rehabilitation', 'physical therapy'
    ];

    const messageLower = message.toLowerCase();
    return healthKeywords.some(keyword => messageLower.includes(keyword));
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.aiAssistant = new AIAssistant();
});

// Make it globally accessible
window.AIAssistant = AIAssistant;
