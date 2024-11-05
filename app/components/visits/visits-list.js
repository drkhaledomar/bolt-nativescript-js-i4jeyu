import { Observable } from '@nativescript/core';
import { databaseService } from '../../services/database.service';

export function createViewModel() {
    const viewModel = new Observable();
    
    // Combine visits with patient information
    viewModel.visits = databaseService.visits.map(visit => ({
        ...visit,
        patient: databaseService.getPatientById(visit.patientId)
    }));

    viewModel.onAddVisit = () => {
        showModal({
            moduleNameOrComponent: './components/visits/visit-form',
            context: {},
            fullscreen: true,
            animated: true
        }).then(visit => {
            if (visit) {
                databaseService.addVisit(visit);
                // Update the visits list
                viewModel.notifyPropertyChange('visits', viewModel.visits);
            }
        });
    };

    return viewModel;
}