const { ipcRenderer } = require('electron');
const store = require('../database/schema');
const { calculateAge } = require('../utils/calculations');

class PatientList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
    this.attachEventListeners();
  }

  render() {
    const patients = store.get('patients') || [];
    
    this.container.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">Patients</h2>
          <button id="addPatient" class="px-4 py-2 bg-blue-600 text-white rounded-md">
            Add New Patient
          </button>
        </div>

        <div class="bg-white rounded-lg shadow">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File No.</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sex</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${patients.map(patient => `
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">${patient.fileNumber}</td>
                  <td class="px-6 py-4">
                    ${patient.firstName} ${patient.fatherName} ${patient.grandfatherName} ${patient.familyName}
                  </td>
                  <td class="px-6 py-4">${calculateAge(patient.dateOfBirth)}</td>
                  <td class="px-6 py-4">${patient.sex}</td>
                  <td class="px-6 py-4">
                    <button class="text-blue-600 hover:text-blue-800 view-patient" data-id="${patient.fileNumber}">
                      View Details
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    document.getElementById('addPatient').addEventListener('click', () => {
      ipcRenderer.send('navigate', 'patient-form');
    });

    this.container.querySelectorAll('.view-patient').forEach(button => {
      button.addEventListener('click', (e) => {
        const patientId = e.target.dataset.id;
        ipcRenderer.send('navigate', 'patient-detail', { patientId });
      });
    });
  }
}

module.exports = PatientList;