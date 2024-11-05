import { Observable } from '@nativescript/core';

export function createViewModel() {
    const viewModel = new Observable();

    // Initialize data
    viewModel.selectedTabIndex = 0;
    viewModel.patients = [
        { id: 1, name: 'John Smith', age: 5, parentName: 'Mary Smith' },
        { id: 2, name: 'Emma Davis', age: 3, parentName: 'Sarah Davis' }
    ];

    viewModel.visits = [
        { id: 1, patientName: 'John Smith', date: '2024-01-15', diagnosis: 'Common Cold' },
        { id: 2, patientName: 'Emma Davis', date: '2024-01-14', diagnosis: 'Vaccination' }
    ];

    viewModel.prescriptions = [
        { id: 1, patientName: 'John Smith', medication: 'Amoxicillin', dosage: '250mg twice daily' },
        { id: 2, patientName: 'Emma Davis', medication: 'Vitamin D', dosage: '400 IU daily' }
    ];

    viewModel.transactions = [
        { id: 1, patientName: 'John Smith', amount: 150, date: '2024-01-15', status: 'paid' },
        { id: 2, patientName: 'Emma Davis', amount: 200, date: '2024-01-14', status: 'pending' }
    ];

    viewModel.totalEarnings = 150;
    viewModel.pendingPayments = 200;

    // Actions
    viewModel.onAddPatient = () => {
        // TODO: Implement add patient dialog
        console.log('Add patient tapped');
    };

    viewModel.onPatientTap = (args) => {
        const patient = viewModel.patients[args.index];
        // TODO: Navigate to patient details
        console.log('Patient tapped:', patient.name);
    };

    return viewModel;
}