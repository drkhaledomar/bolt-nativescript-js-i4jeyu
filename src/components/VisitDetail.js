const { ipcRenderer } = require('electron');
const store = require('../database/schema');

class VisitDetail {
  constructor(containerId, patientId, visitId) {
    this.container = document.getElementById(containerId);
    this.patientId = patientId;
    this.visitId = visitId;
    this.render();
    this.attachEventListeners();
  }

  render() {
    const visit = store.get('visits')
      .find(v => v.patientId === this.patientId && v.visitNumber === this.visitId);
    const patient = store.get('patients')
      .find(p => p.fileNumber === this.patientId);

    this.container.innerHTML = `
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">Visit Details</h2>
            <p class="text-gray-600">
              ${patient.firstName} ${patient.familyName} - Visit #${visit.visitNumber}
            </p>
          </div>
          <button id="backToPatient" class="px-4 py-2 border rounded-md text-gray-600">
            Back to Patient
          </button>
        </div>

        <div class="bg-white rounded-lg shadow p-6 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-600">Date</label>
              <p class="font-medium">${new Date(visit.date).toLocaleDateString()}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Age at Visit</label>
              <p class="font-medium">${visit.ageAtVisit} years</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Main Complaint</label>
              <p class="font-medium">${visit.complaintCategory}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Other Complaints</label>
              <p class="font-medium">${visit.complaint || 'None'}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-sm text-gray-600">Present History</label>
              <p class="font-medium">${visit.presentHistory}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Past History</label>
              <p class="font-medium">${visit.pastHistory}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Family History</label>
              <p class="font-medium">${visit.familyHistory}</p>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-3">Vital Signs</h3>
            <div class="grid grid-cols-4 gap-4">
              <div>
                <label class="text-sm text-gray-600">Temperature</label>
                <p class="font-medium">${visit.vitalSigns.temperature}°C</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Weight</label>
                <p class="font-medium">${visit.vitalSigns.weight} kg</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Height</label>
                <p class="font-medium">${visit.vitalSigns.height} cm</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">BMI</label>
                <p class="font-medium">${visit.vitalSigns.bmi.toFixed(1)}</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Head Circumference</label>
                <p class="font-medium">${visit.vitalSigns.headCircumference} cm</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Pulse</label>
                <p class="font-medium">${visit.vitalSigns.pulse} bpm</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Blood Pressure</label>
                <p class="font-medium">${visit.vitalSigns.bloodPressure.systolic}/${visit.vitalSigns.bloodPressure.diastolic}</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">SpO2</label>
                <p class="font-medium">${visit.vitalSigns.spO2}%</p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-3">Examination</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-600">General</label>
                <p class="font-medium">${visit.examination.general}</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Head and Neck</label>
                <p class="font-medium">${visit.examination.headAndNeck}</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Throat</label>
                <p class="font-medium">${visit.examination.throat}</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Chest</label>
                <p class="font-medium">${visit.examination.chest}</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Heart</label>
                <p class="font-medium">${visit.examination.heart}</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Abdomen</label>
                <p class="font-medium">${visit.examination.abdomen}</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">CNS</label>
                <p class="font-medium">${visit.examination.cns}</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Limbs</label>
                <p class="font-medium">${visit.examination.limbs}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-3">Medications</h3>
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="text-left text-sm font-medium text-gray-500">Drug</th>
                  <th class="text-left text-sm font-medium text-gray-500">Dose</th>
                  <th class="text-left text-sm font-medium text-gray-500">Route</th>
                  <th class="text-left text-sm font-medium text-gray-500">Duration</th>
                  <th class="text-left text-sm font-medium text-gray-500">Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${visit.medications.map(med => `
                  <tr>
                    <td class="py-2">${med.drug}</td>
                    <td class="py-2">${med.dose}</td>
                    <td class="py-2">${med.route}</td>
                    <td class="py-2">${med.duration}</td>
                    <td class="py-2">${med.remarks}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div>
            <label class="text-sm text-gray-600">Final Remarks</label>
            <p class="font-medium">${visit.finalRemarks}</p>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    document.getElementById('backToPatient').addEventListener('click', () => {
      ipcRenderer.send('navigate', 'patient-detail', { patientId: this.patientId });
    });
  }
}

module.exports = VisitDetail;