const { ipcRenderer } = require('electron');
const store = require('../database/schema');
const { calculateAge, calculateBMI } = require('../utils/calculations');

class VisitForm {
  constructor(containerId, patientId) {
    this.container = document.getElementById(containerId);
    this.patientId = patientId;
    this.render();
    this.attachEventListeners();
  }

  render() {
    const complaints = store.get('complaints');
    
    this.container.innerHTML = `
      <form id="visitForm" class="space-y-6">
        <input type="hidden" name="patientId" value="${this.patientId}">
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Complaint</label>
            <select name="complaintCategory" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              ${complaints.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Other Complaints</label>
            <input type="text" name="complaint" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Present History</label>
            <textarea name="presentHistory" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Past History</label>
            <textarea name="pastHistory" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Family History</label>
            <textarea name="familyHistory" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          </div>
        </div>

        <div class="border-t pt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Vital Signs</h3>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Temperature (°C)</label>
              <input type="number" step="0.1" name="temperature" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input type="number" step="0.1" name="weight" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input type="number" step="0.1" name="height" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Head Circumference (cm)</label>
              <input type="number" step="0.1" name="headCircumference" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Pulse (bpm)</label>
              <input type="number" name="pulse" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Blood Pressure (mmHg)</label>
              <div class="flex space-x-2">
                <input type="number" name="systolic" placeholder="Systolic" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <input type="number" name="diastolic" placeholder="Diastolic" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Respiratory Rate</label>
              <input type="number" name="respiratoryRate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">SpO2 (%)</label>
              <input type="number" name="spO2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
          </div>
        </div>

        <div class="border-t pt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Examination</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">General Examination</label>
              <textarea name="generalExam" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Head and Neck</label>
                <textarea name="headAndNeck" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Throat</label>
                <textarea name="throat" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Chest</label>
                <textarea name="chest" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Heart</label>
                <textarea name="heart" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Abdomen</label>
                <textarea name="abdomen" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">CNS</label>
                <textarea name="cns" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Limbs</label>
                <textarea name="limbs" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Others</label>
                <textarea name="other" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Investigations</label>
            <textarea name="investigations" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Diagnosis</label>
            <textarea name="diagnosis" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          </div>
        </div>

        <div id="medications" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Medications</h3>
          <div class="medication-entry grid grid-cols-5 gap-2">
            <input type="text" placeholder="Drug" class="rounded-md border-gray-300 shadow-sm">
            <input type="text" placeholder="Dose" class="rounded-md border-gray-300 shadow-sm">
            <input type="text" placeholder="Route" class="rounded-md border-gray-300 shadow-sm">
            <input type="text" placeholder="Duration" class="rounded-md border-gray-300 shadow-sm">
            <input type="text" placeholder="Remarks" class="rounded-md border-gray-300 shadow-sm">
          </div>
          <button type="button" id="addMedication" class="text-blue-600">+ Add Medication</button>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Final Remarks</label>
          <textarea name="finalRemarks" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
        </div>

        <div class="flex justify-end space-x-2">
          <button type="button" id="cancelVisit" class="px-4 py-2 border rounded-md text-gray-600">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Save Visit</button>
        </div>
      </form>
    `;
  }

  attachEventListeners() {
    const form = document.getElementById('visitForm');
    const addMedicationBtn = document.getElementById('addMedication');
    
    form.addEventListener('submit', this.handleSubmit.bind(this));
    addMedicationBtn.addEventListener('click', this.addMedicationEntry.bind(this));
    
    document.getElementById('cancelVisit').addEventListener('click', () => {
      ipcRenderer.send('navigate', 'patient-detail', { patientId: this.patientId });
    });
  }

  addMedicationEntry() {
    const medicationsDiv = document.getElementById('medications');
    const newEntry = document.createElement('div');
    newEntry.className = 'medication-entry grid grid-cols-5 gap-2 mt-2';
    newEntry.innerHTML = `
      <input type="text" placeholder="Drug" class="rounded-md border-gray-300 shadow-sm">
      <input type="text" placeholder="Dose" class="rounded-md border-gray-300 shadow-sm">
      <input type="text" placeholder="Route" class="rounded-md border-gray-300 shadow-sm">
      <input type="text" placeholder="Duration" class="rounded-md border-gray-300 shadow-sm">
      <input type="text" placeholder="Remarks" class="rounded-md border-gray-300 shadow-sm">
    `;
    medicationsDiv.insertBefore(newEntry, document.getElementById('addMedication'));
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const visit = Object.fromEntries(formData.entries());
    
    // Get medications
    const medicationEntries = document.querySelectorAll('.medication-entry');
    visit.medications = Array.from(medicationEntries).map(entry => {
      const inputs = entry.querySelectorAll('input');
      return {
        drug: inputs[0].value,
        dose: inputs[1].value,
        route: inputs[2].value,
        duration: inputs[3].value,
        remarks: inputs[4].value
      };
    }).filter(med => med.drug); // Only include medications with at least a drug name
    
    // Calculate BMI
    if (visit.weight && visit.height) {
      visit.bmi = calculateBMI(parseFloat(visit.weight), parseFloat(visit.height));
    }
    
    // Get patient's age at visit
    const patient = store.get('patients').find(p => p.fileNumber === this.patientId);
    visit.ageAtVisit = calculateAge(patient.dateOfBirth);
    
    // Add visit number
    const visits = store.get('visits') || [];
    const patientVisits = visits.filter(v => v.patientId === this.patientId);
    visit.visitNumber = patientVisits.length + 1;
    
    visits.push(visit);
    store.set('visits', visits);
    
    ipcRenderer.send('navigate', 'patient-detail', { patientId: this.patientId });
  }
}

module.exports = VisitForm;