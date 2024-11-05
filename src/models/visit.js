class Visit {
  constructor() {
    this.schema = {
      visitNumber: Number,
      patientId: String,
      date: Date,
      ageAtVisit: Number, // Calculated field
      complaint: String,
      complaintCategory: String,
      presentHistory: String,
      pastHistory: String,
      familyHistory: String,
      vitalSigns: {
        temperature: Number,
        weight: Number,
        height: Number,
        headCircumference: Number,
        bmi: Number, // Calculated field
        pulse: Number,
        bloodPressure: {
          systolic: Number,
          diastolic: Number
        },
        respiratoryRate: Number,
        spO2: Number
      },
      previousMedications: [String],
      examination: {
        general: String,
        headAndNeck: String,
        throat: String,
        chest: String,
        heart: String,
        abdomen: String,
        cns: String,
        limbs: String,
        other: String
      },
      investigations: [String],
      diagnosis: String,
      medications: [{
        drug: String,
        dose: String,
        route: String,
        duration: String,
        remarks: String
      }],
      finalRemarks: String
    };
  }
}

module.exports = Visit;