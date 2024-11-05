import { Observable } from '@nativescript/core';

export function createViewModel(context) {
    const viewModel = new Observable();
    
    // Initialize empty form
    viewModel.name = '';
    viewModel.age = '';
    viewModel.parentName = '';
    viewModel.phone = '';
    viewModel.address = '';

    viewModel.onSave = (args) => {
        const patient = {
            name: viewModel.name,
            age: parseInt(viewModel.age, 10),
            parentName: viewModel.parentName,
            phone: viewModel.phone,
            address: viewModel.address
        };
        
        args.object.closeModal(patient);
    };

    viewModel.onCancel = (args) => {
        args.object.closeModal();
    };

    return viewModel;
}