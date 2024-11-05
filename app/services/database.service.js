import { Observable } from '@nativescript/core';

class DatabaseService extends Observable {
    constructor() {
        super();
        this.patients = [];
        this.visits = [];
        this.prescriptions = [];
        this.transactions = [];
        this.initializeData();
    }

    initializeData() {
        // Sample data - in a real app, this would come from a database
        this.patients = [
            { id: 1, name: 'John Smith', age: 5, parentName: 'Mary Smith', phone: '555-0101', address: '123 Main St' },
            { id: 2, name: 'Emma Davis', age: 3, parentName: 'Sarah Davis', phone: '555-0102', address: '456 Oak Ave' }
        ];

        this.visits = [
            { id: 1, patientId: 1, date: '2024-01-15', diagnosis: 'Common Cold', notes: 'Prescribed rest and fluids' },
            { id: 2, patientId: 2, date: '2024-01-14', diagnosis: 'Vaccination', notes: 'Regular checkup' }
        ];

        this.prescriptions = [
            { id: 1, patientId: 1, medication: 'Amoxicillin', dosage: '250mg', frequency: 'twice daily', duration: '7 days' },
            { id: 2, patientId: 2, medication: 'Vitamin D', dosage: '400 IU', frequency: 'daily', duration: '30 days' }
        ];

        this.transactions = [
            { id: 1, patientId: 1, amount: 150, date: '2024-01-15', status: 'paid', description: 'Consultation' },
            { id: 2, patientId: 2, amount: 200, date: '2024-01-14', status: 'pending', description: 'Vaccination' }
        ];
    }

    addPatient(patient) {
        const newId = this.patients.length + 1;
        const newPatient = { ...patient, id: newId };
        this.patients.push(newPatient);
        this.notifyPropertyChange('patients', this.patients);
        return newPatient;
    }

    addVisit(visit) {
        const newId = this.visits.length + 1;
        const newVisit = { ...visit, id: newId };
        this.visits.push(newVisit);
        this.notifyPropertyChange('visits', this.visits);
        return newVisit;
    }

    addPrescription(prescription) {
        const newId = this.prescriptions.length + 1;
        const newPrescription = { ...prescription, id: newId };
        this.prescriptions.push(newPrescription);
        this.notifyPropertyChange('prescriptions', this.prescriptions);
        return newPrescription;
    }

    addTransaction(transaction) {
        const newId = this.transactions.length + 1;
        const newTransaction = { ...transaction, id: newId };
        this.transactions.push(newTransaction);
        this.notifyPropertyChange('transactions', this.transactions);
        return newTransaction;
    }

    getPatientById(id) {
        return this.patients.find(patient => patient.id === id);
    }

    getVisitsByPatientId(patientId) {
        return this.visits.filter(visit => visit.patientId === patientId);
    }

    getPrescriptionsByPatientId(patientId) {
        return this.prescriptions.filter(prescription => prescription.patientId === patientId);
    }

    getTransactionsByPatientId(patientId) {
        return this.transactions.filter(transaction => transaction.patientId === patientId);
    }
}

export const databaseService = new DatabaseService();