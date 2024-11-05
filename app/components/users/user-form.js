import { Observable } from '@nativescript/core';
import { authService } from '../../services/auth.service';

export function onNavigatingTo(args) {
    const page = args.object;
    const context = page.navigationContext;
    page.bindingContext = createViewModel(context);
}

function createViewModel(context) {
    const viewModel = new Observable();
    const { isEdit, user } = context;

    // Available roles
    viewModel.roles = [
        'admin',
        'doctor',
        'nurse',
        'accountant',
        'receptionist'
    ];

    // Set initial values
    if (isEdit && user) {
        viewModel.set('isEdit', true);
        viewModel.set('name', user.name);
        viewModel.set('username', user.username);
        viewModel.set('email', user.email || '');
        viewModel.set('phone', user.phone || '');
        viewModel.set('selectedRoleIndex', viewModel.roles.indexOf(user.role));
    } else {
        viewModel.set('isEdit', false);
        viewModel.set('name', '');
        viewModel.set('username', '');
        viewModel.set('password', '');
        viewModel.set('email', '');
        viewModel.set('phone', '');
        viewModel.set('selectedRoleIndex', 0);
    }

    // Save user
    viewModel.onSave = (args) => {
        // Validate required fields
        if (!viewModel.get('name') || !viewModel.get('username') || 
            (!isEdit && !viewModel.get('password'))) {
            alert({
                title: "Validation Error",
                message: "Please fill in all required fields",
                okButtonText: "OK"
            });
            return;
        }

        const userData = {
            name: viewModel.get('name'),
            username: viewModel.get('username'),
            role: viewModel.roles[viewModel.get('selectedRoleIndex')],
            email: viewModel.get('email'),
            phone: viewModel.get('phone')
        };

        if (!isEdit) {
            userData.password = viewModel.get('password');
        }

        args.object.closeModal(userData);
    };

    // Cancel
    viewModel.onCancel = (args) => {
        args.object.closeModal();
    };

    return viewModel;
}