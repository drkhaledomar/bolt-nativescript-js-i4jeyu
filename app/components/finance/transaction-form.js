import { Observable } from '@nativescript/core';
import { databaseService } from '../../services/database.service';

export function createViewModel() {
    const viewModel = new Observable();
    
    // Initialize form data
    viewModel.amount = '';
    viewModel.description = '';
    viewModel.date = new Date();
    
    // Setup patient picker
    viewModel.patients = databaseService.patients;
    viewModel.patientNames = viewModel.patients.map(p => p.name);
    viewModel.selectedPatientIndex = 0;

    // Setup status picker
    viewModel.statusOptions = ['paid', 'pending'];
    viewModel.selectedStatusIndex = 0;

    viewModel.onSave = (args) => {
        const transaction = {
            patientId: viewModel.patients[viewModel.selectedPatientIndex].id,
            amount: parseFloat(viewModel.amount),
            description: viewModel.description,
            status: viewModel.statusOptions[viewModel.selectedStatusIndex],
            date: viewModel.date.toISOString().split('T')[0]
        };
        
        args.object.closeModal(transaction);
    };

    viewModel.onCancel = (args) => {
        args.object.closeModal();
    };

    return viewModel;
}