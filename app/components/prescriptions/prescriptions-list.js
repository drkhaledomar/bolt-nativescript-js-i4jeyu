import { Observable } from '@nativescript/core';
import { databaseService } from '../../services/database.service';
import { showModal } from '@nativescript/core';

export function createViewModel() {
    const viewModel = new Observable();
    
    // Combine prescriptions with patient information
    viewModel.prescriptions = databaseService.prescriptions.map(prescription => ({
        ...prescription,
        patient: databaseService.getPatientById(prescription.patientId)
    }));

    viewModel.onAddPrescription = () => {
        showModal({
            moduleNameOrComponent: './components/prescriptions/prescription-form',
            context: {},
            fullscreen: true,
            animated: true
        }).then(prescription => {
            if (prescription) {
                databaseService.addPrescription(prescription);
                // Update the prescriptions list
                viewModel.notifyPropertyChange('prescriptions', viewModel.prescriptions);
            }
        });
    };

    return viewModel;
}