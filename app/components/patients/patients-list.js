import { Observable } from '@nativescript/core';
import { databaseService } from '../../services/database.service';
import { showModal } from '@nativescript/core';

export function createViewModel() {
    const viewModel = new Observable();
    
    viewModel.patients = databaseService.patients;

    viewModel.onAddPatient = () => {
        showModal({
            moduleNameOrComponent: './components/patients/patient-form',
            context: {},
            fullscreen: true,
            animated: true
        }).then(patient => {
            if (patient) {
                databaseService.addPatient(patient);
            }
        });
    };

    viewModel.onPatientTap = (args) => {
        const patient = viewModel.patients[args.index];
        const navigationEntry = {
            moduleName: './components/patients/patient-detail',
            context: { patientId: patient.id },
            animated: true
        };
        const frame = args.object.page.frame;
        frame.navigate(navigationEntry);
    };

    return viewModel;
}