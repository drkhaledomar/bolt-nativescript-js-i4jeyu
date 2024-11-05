const Store = require('electron-store');

const schema = {
  patients: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        fileNumber: { type: 'string' },
        firstName: { type: 'string' },
        fatherName: { type: 'string' },
        grandfatherName: { type: 'string' },
        familyName: { type: 'string' },
        dateOfBirth: { type: 'string' },
        sex: { type: 'string', enum: ['Male', 'Female'] },
        address: { type: 'string' },
        fatherJob: { type: 'string' },
        motherJob: { type: 'string' },
        nationality: { type: 'string' },
        allergies: { type: 'array', items: { type: 'string' } },
        medicalConditions: { type: 'array', items: { type: 'string' } }
      },
      required: ['fileNumber', 'firstName', 'familyName', 'dateOfBirth', 'sex']
    }
  },
  visits: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        visitNumber: { type: 'number' },
        patientId: { type: 'string' },
        date: { type: 'string' },
        complaint: { type: 'string' },
        complaintCategory: { type: 'string' },
        presentHistory: { type: 'string' },
        pastHistory: { type: 'string' },
        familyHistory: { type: 'string' },
        vitalSigns: {
          type: 'object',
          properties: {
            temperature: { type: 'number' },
            weight: { type: 'number' },
            height: { type: 'number' },
            headCircumference: { type: 'number' },
            bmi: { type: 'number' },
            pulse: { type: 'number' },
            bloodPressure: {
              type: 'object',
              properties: {
                systolic: { type: 'number' },
                diastolic: { type: 'number' }
              }
            },
            respiratoryRate: { type: 'number' },
            spO2: { type: 'number' }
          }
        },
        previousMedications: { type: 'array', items: { type: 'string' } },
        examination: {
          type: 'object',
          properties: {
            general: { type: 'string' },
            headAndNeck: { type: 'string' },
            throat: { type: 'string' },
            chest: { type: 'string' },
            heart: { type: 'string' },
            abdomen: { type: 'string' },
            cns: { type: 'string' },
            limbs: { type: 'string' },
            other: { type: 'string' }
          }
        },
        investigations: { type: 'array', items: { type: 'string' } },
        diagnosis: { type: 'string' },
        medications: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              drug: { type: 'string' },
              dose: { type: 'string' },
              route: { type: 'string' },
              duration: { type: 'string' },
              remarks: { type: 'string' }
            }
          }
        },
        finalRemarks: { type: 'string' }
      },
      required: ['visitNumber', 'patientId', 'date']
    }
  },
  complaints: {
    type: 'array',
    items: { type: 'string' }
  }
};

const store = new Store({ schema });

// Initialize default complaints if empty
if (!store.get('complaints')) {
  store.set('complaints', [
    'Fever',
    'Cough',
    'Difficulty Breathing',
    'Vomiting',
    'Diarrhea',
    'Abdominal Pain',
    'Headache',
    'Rash',
    'Ear Pain',
    'Sore Throat'
  ]);
}

module.exports = store;