const { ipcRenderer } = require('electron');
const store = require('../database/schema');
const { calculateAge } = require('../utils/calculations');

class PatientDetail {
  constructor(containerId, patientId) {
    this.container = document.getElementById(containerId);
    this.patientId = patientId;
    this.render();
    this.attachEventListeners();
  }

  render() {
    const patient = store.get('patients').find(p => p.fileNumber === this.patientId);
    const visits = (store.get('visits') || [])
      .filter(v => v.patientId === this.patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    this.container.innerHTML = `
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">Patient Details</h2>
          <div class="space-x-2">
            <button id="backToList" class="px-4 py-2 border rounded-md text-gray-600">
              Back to List
            </button>
            <button id="addVisit" class="px-4 py-2 bg-blue-600 text-white rounded-md">
              Add New Visit
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-600">File Number</label>
              <p class="font-medium">${patient.fileNumber}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Full Name</label>
              <p class="font-medium">
                ${patient.firstName} ${patient.fatherName} ${patient.grandfatherName} ${patient.familyName}
              </p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Age</label>
              <p class="font-medium">${calculateAge(patient.dateOfBirth)} years</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Sex</label>
              <p class="font-medium">${patient.sex}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Nationality</label>
              <p class="font-medium">${patient.nationality}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Address</label>
              <p class="font-medium">${patient.address}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Father's Job</label>
              <p class="font-medium">${patient.fatherJob}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Mother's Job</label>
              <p class="font-medium">${patient.motherJob}</p>
            </div>
            <div class="col-span-2">
              <label class="text-sm text-gray-600">Allergies</label>
              <p class="font-medium">${patient.allergies.join(', ') || 'None'}</p>
            </div>
            <div class="col-span-2">
              <label class="text-sm text-gray-600">Medical Conditions</label>
              <p class="font-medium">${patient.medicalConditions.join(', ') || 'None'}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow">
          <h3 class="text-lg font-semibold p-4 border-b">Visit History</h3>
          <div class="divide-y">
            ${visits.map(visit => `
              <div class="p-4 hover:bg-gray-50 cursor-pointer view-visit" data-id="${visit.visitNumber}">
                <div class="flex justify-between">
                  <div>
                    <p class="font-medium">Visit #${visit.visitNumber}</p>
                    <p class="text-sm text-gray-600">${new Date(visit.date).toLocaleDateString()}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium">${visit.diagnosis}</p>
                    <p class="text-sm text-gray-600">${visit.complaintCategory}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    document.getElementById('backToList').addEventListener('click', () => {
      ipcRenderer.send('navigate', 'patients-list');
    });

    document.getElementById('addVisit').addEventListener('click', () => {
      ipcRenderer.send('navigate', 'visit-form', { patientId: this.patientId });
    });

    this.container.querySelectorAll('.view-visit').forEach(element => {
      element.addEventListener('click', (e) => {
        const visitId = e.currentTarget.dataset.id;
        ipcRenderer.send('navigate', 'visit-detail', { 
          patientId: this.patientId,
          visitId: parseInt(visitId)
        });
      });
    });
  }
}

module.exports = PatientDetail;