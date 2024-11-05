import { Observable } from '@nativescript/core';
import { databaseService } from '../../services/database.service';

export function createViewModel() {
    const viewModel = new Observable();
    
    // Initialize form data
    viewModel.medication = '';
    viewModel.dosage = '';
    viewModel.frequency = '';
    viewModel.duration = '';
    viewModel.notes = '';
    
    // Setup patient picker
    viewModel.patients = databaseService.patients;
    viewModel.patientNames = viewModel.patients.map(p => p.name);
    viewModel.selectedPatientIndex = 0;

    viewModel.onSave = (args) => {
        const prescription = {
            patientId: viewModel.patients[viewModel.selectedPatientIndex].id,
            medication: viewModel.medication,
            dosage: viewModel.dosage,
            frequency: viewModel.frequency,
            duration: viewModel.duration,
            notes: viewModel.notes
        };
        
        args.object.closeModal(prescription);
    };

    viewModel.onCancel = (args) => {
        args.object.closeModal();
    };

    return viewModel;
}