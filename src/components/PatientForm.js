const { ipcRenderer } = require('electron');
const store = require('../database/schema');

class PatientForm {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <form id="patientForm" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">File Number</label>
            <input type="text" name="fileNumber" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" name="firstName" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Father Name</label>
            <input type="text" name="fatherName" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Grandfather Name</label>
            <input type="text" name="grandfatherName" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Family Name</label>
            <input type="text" name="familyName" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input type="date" name="dateOfBirth" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Sex</label>
            <select name="sex" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nationality</label>
            <input type="text" name="nationality" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" name="address" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Father's Job</label>
            <input type="text" name="fatherJob" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Mother's Job</label>
            <input type="text" name="motherJob" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Allergies to Medications</label>
            <textarea name="allergies" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Special Medical Conditions</label>
            <textarea name="medicalConditions" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" id="cancelPatient" class="px-4 py-2 border rounded-md text-gray-600">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Save Patient</button>
        </div>
      </form>
    `;
  }

  attachEventListeners() {
    const form = document.getElementById('patientForm');
    form.addEventListener('submit', this.handleSubmit.bind(this));
    
    document.getElementById('cancelPatient').addEventListener('click', () => {
      ipcRenderer.send('navigate', 'patients-list');
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const patient = Object.fromEntries(formData.entries());
    
    // Convert string arrays to actual arrays
    patient.allergies = patient.allergies.split('\n').filter(Boolean);
    patient.medicalConditions = patient.medicalConditions.split('\n').filter(Boolean);
    
    const patients = store.get('patients') || [];
    patients.push(patient);
    store.set('patients', patients);
    
    ipcRenderer.send('navigate', 'patients-list');
  }
}

module.exports = PatientForm;