const { ipcRenderer } = require('electron');
const PatientList = require('./src/components/PatientList');
const PatientForm = require('./src/components/PatientForm');
const PatientDetail = require('./src/components/PatientDetail');
const VisitForm = require('./src/components/VisitForm');
const VisitDetail = require('./src/components/VisitDetail');

// Router
class Router {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentComponent = null;
    
    ipcRenderer.on('route-changed', (event, { route, params }) => {
      this.navigate(route, params);
    });
    
    // Initial route
    this.navigate('patients-list');
  }
  
  navigate(route, params = {}) {
    // Clear current content
    this.container.innerHTML = '';
    
    // Create new component based on route
    switch (route) {
      case 'patients-list':
        this.currentComponent = new PatientList('content');
        break;
        
      case 'patient-form':
        this.currentComponent = new PatientForm('content');
        break;
        
      case 'patient-detail':
        this.currentComponent = new PatientDetail('content', params.patientId);
        break;
        
      case 'visit-form':
        this.currentComponent = new VisitForm('content', params.patientId);
        break;
        
      case 'visit-detail':
        this.currentComponent = new VisitDetail('content', params.patientId, params.visitId);
        break;
        
      default:
        console.error('Unknown route:', route);
    }
  }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Router('content');
});