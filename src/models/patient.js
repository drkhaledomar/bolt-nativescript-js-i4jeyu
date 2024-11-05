class Patient {
  constructor() {
    this.schema = {
      fileNumber: String,
      firstName: String,
      fatherName: String,
      grandfatherName: String,
      familyName: String,
      dateOfBirth: Date,
      sex: ['Male', 'Female'],
      address: String,
      fatherJob: String,
      motherJob: String,
      nationality: String,
      allergies: [String],
      medicalConditions: [String]
    };
  }
}

module.exports = Patient;