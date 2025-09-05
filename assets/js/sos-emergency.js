// SOS Emergency System
class SOSEmergency {
  constructor() {
    this.currentLocation = null;
    this.emergencyContacts = [
      { name: 'Emergency Services', number: '108', type: 'emergency' },
      { name: 'Police', number: '100', type: 'police' },
      { name: 'Ambulance', number: '102', type: 'ambulance' }
    ];
    this.nearbyHospitals = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.getCurrentLocation();
  }

  setupEventListeners() {
    // SOS Button
    const sosButton = document.getElementById('sos-button');
    const sosPanel = document.getElementById('sos-panel');
    const sosClose = document.getElementById('sos-close');

    sosButton.addEventListener('click', () => {
      this.toggleSOSPanel();
    });

    sosClose.addEventListener('click', () => {
      this.closeSOSPanel();
    });

    // Emergency Actions
    document.getElementById('send-whatsapp').addEventListener('click', () => {
      this.sendWhatsAppMessage();
    });

    document.getElementById('find-nearby-help').addEventListener('click', () => {
      this.findNearbyHelp();
    });

    document.getElementById('call-emergency').addEventListener('click', () => {
      this.callEmergency();
    });

    document.getElementById('refresh-location').addEventListener('click', () => {
      this.getCurrentLocation();
    });

    // Contact buttons
    document.querySelectorAll('.call-contact').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const contactItem = e.target.closest('.contact-item');
        const number = contactItem.querySelector('.contact-number').textContent;
        this.makeCall(number);
      });
    });

    // Modal close
    document.querySelector('.modal-close').addEventListener('click', () => {
      this.closeModal();
    });

    // Close modal on outside click
    document.getElementById('nearby-modal').addEventListener('click', (e) => {
      if (e.target.id === 'nearby-modal') {
        this.closeModal();
      }
    });
  }

  toggleSOSPanel() {
    const sosPanel = document.getElementById('sos-panel');
    const isHidden = sosPanel.getAttribute('aria-hidden') === 'true';
    
    if (isHidden) {
      sosPanel.setAttribute('aria-hidden', 'false');
      sosPanel.style.display = 'block';
      // Close chatbot if open
      const chatbotPanel = document.getElementById('chatbot-panel');
      if (chatbotPanel && chatbotPanel.getAttribute('aria-hidden') === 'false') {
        chatbotPanel.setAttribute('aria-hidden', 'true');
        chatbotPanel.style.display = 'none';
      }
    } else {
      this.closeSOSPanel();
    }
  }

  closeSOSPanel() {
    const sosPanel = document.getElementById('sos-panel');
    sosPanel.setAttribute('aria-hidden', 'true');
    sosPanel.style.display = 'none';
  }

  async getCurrentLocation() {
    const locationElement = document.getElementById('current-location');
    locationElement.textContent = 'Getting your location...';

    if (!navigator.geolocation) {
      locationElement.textContent = 'Geolocation not supported by this browser';
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      this.currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      // Get address from coordinates
      const address = await this.getAddressFromCoords(
        this.currentLocation.latitude, 
        this.currentLocation.longitude
      );

      locationElement.textContent = address || 
        `Lat: ${this.currentLocation.latitude.toFixed(6)}, Lng: ${this.currentLocation.longitude.toFixed(6)}`;

    } catch (error) {
      console.error('Error getting location:', error);
      locationElement.textContent = 'Unable to get location. Please check permissions.';
    }
  }

  async getAddressFromCoords(lat, lng) {
    try {
      // Using a free geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      
      if (data.city && data.principalSubdivision) {
        return `${data.city}, ${data.principalSubdivision}, ${data.countryName}`;
      }
      return null;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  }

  sendWhatsAppMessage() {
    if (!this.currentLocation) {
      this.showNotification('Please wait for location to be detected', 'warning');
      return;
    }

    const emergencyMessage = this.createEmergencyMessage();
    const whatsappNumber = '919876543210'; // Replace with actual emergency contact number
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(emergencyMessage)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    this.showNotification('WhatsApp message prepared with your location', 'success');
  }

  createEmergencyMessage() {
    const timestamp = new Date().toLocaleString();
    const location = this.currentLocation ? 
      `Lat: ${this.currentLocation.latitude.toFixed(6)}, Lng: ${this.currentLocation.longitude.toFixed(6)}` : 
      'Location not available';

    return `🚨 EMERGENCY ALERT 🚨

I need immediate medical assistance!

📍 Location: ${location}
⏰ Time: ${timestamp}
📱 Sent from: Pocket Doctor App

Please send help immediately!

This is an automated emergency message.`;
  }

  async findNearbyHelp() {
    if (!this.currentLocation) {
      this.showNotification('Please wait for location to be detected', 'warning');
      return;
    }

    this.showModal();
    const resultsContainer = document.getElementById('nearby-results');
    resultsContainer.innerHTML = '<div class="loading">Searching for nearby hospitals and clinics...</div>';

    try {
      // Simulate API call to find nearby hospitals
      // In a real app, you would use Google Places API or similar
      const nearbyHospitals = await this.searchNearbyHospitals();
      this.displayNearbyResults(nearbyHospitals);
    } catch (error) {
      console.error('Error finding nearby help:', error);
      resultsContainer.innerHTML = '<div class="loading">Error finding nearby hospitals. Please try again.</div>';
    }
  }

  async searchNearbyHospitals() {
    // Simulated data - in real app, use Google Places API
    const mockHospitals = [
      {
        name: 'Apollo Hospital',
        address: '123 Medical Street, City Center',
        distance: '0.8 km',
        phone: '+91-9876543210',
        type: 'hospital',
        rating: 4.5
      },
      {
        name: 'City Medical Center',
        address: '456 Health Avenue, Downtown',
        distance: '1.2 km',
        phone: '+91-9876543211',
        type: 'hospital',
        rating: 4.2
      },
      {
        name: 'Emergency Care Clinic',
        address: '789 Urgent Care Road, Suburb',
        distance: '2.1 km',
        phone: '+91-9876543212',
        type: 'clinic',
        rating: 4.0
      },
      {
        name: 'General Hospital',
        address: '321 Main Street, City',
        distance: '2.8 km',
        phone: '+91-9876543213',
        type: 'hospital',
        rating: 4.3
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return mockHospitals;
  }

  displayNearbyResults(hospitals) {
    const resultsContainer = document.getElementById('nearby-results');
    
    if (hospitals.length === 0) {
      resultsContainer.innerHTML = '<div class="loading">No nearby hospitals found. Please call emergency services.</div>';
      return;
    }

    const resultsHTML = hospitals.map(hospital => `
      <div class="nearby-item">
        <div class="nearby-icon">
          ${hospital.type === 'hospital' ? '🏥' : '🏥'}
        </div>
        <div class="nearby-info">
          <div class="nearby-name">${hospital.name}</div>
          <div class="nearby-address">${hospital.address}</div>
          <div class="nearby-distance">${hospital.distance} • ⭐ ${hospital.rating}</div>
        </div>
        <div class="nearby-actions">
          <button class="nearby-btn" onclick="sosEmergency.makeCall('${hospital.phone}')">
            📞 Call
          </button>
          <button class="nearby-btn" onclick="sosEmergency.getDirections('${hospital.name}', '${hospital.address}')">
            🗺️ Directions
          </button>
        </div>
      </div>
    `).join('');

    resultsContainer.innerHTML = resultsHTML;
  }

  makeCall(number) {
    // Create tel: link for mobile devices
    const telUrl = `tel:${number}`;
    window.location.href = telUrl;
    
    this.showNotification(`Calling ${number}...`, 'info');
  }

  getDirections(hospitalName, address) {
    if (!this.currentLocation) {
      this.showNotification('Location not available for directions', 'warning');
      return;
    }

    // Open Google Maps with directions
    const mapsUrl = `https://www.google.com/maps/dir/${this.currentLocation.latitude},${this.currentLocation.longitude}/${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
    
    this.showNotification(`Opening directions to ${hospitalName}`, 'info');
  }

  callEmergency() {
    this.makeCall('108');
  }

  showModal() {
    const modal = document.getElementById('nearby-modal');
    modal.style.display = 'flex';
  }

  closeModal() {
    const modal = document.getElementById('nearby-modal');
    modal.style.display = 'none';
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'danger' ? '❌' : 'ℹ️'}</span>
        <span class="notification-message">${message}</span>
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
}

// Initialize SOS Emergency System when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.sosEmergency = new SOSEmergency();
});

// Add notification styles if not already present
if (!document.querySelector('#sos-notification-styles')) {
  const style = document.createElement('style');
  style.id = 'sos-notification-styles';
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: var(--shadow);
      z-index: 1001;
      min-width: 300px;
      animation: slideInRight 0.3s ease;
    }

    .notification-success {
      border-left: 4px solid #10b981;
    }

    .notification-error {
      border-left: 4px solid #ef4444;
    }

    .notification-warning {
      border-left: 4px solid #f59e0b;
    }

    .notification-info {
      border-left: 4px solid #3b82f6;
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text);
    }

    .notification-close {
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      color: var(--muted);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: color 0.3s ease;
    }

    .notification-close:hover {
      color: var(--text);
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}
