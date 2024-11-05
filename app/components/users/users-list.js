import { Observable } from '@nativescript/core';
import { authService } from '../../services/auth.service';
import { showModal } from '@nativescript/core';

export function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = createViewModel();
}

function createViewModel() {
    const viewModel = new Observable();
    
    // Initialize properties
    viewModel.searchQuery = '';
    viewModel.users = authService.getAllUsers();
    
    // Filtered users based on search
    viewModel.filteredUsers = viewModel.users;

    // Watch for search query changes
    viewModel.on(Observable.propertyChangeEvent, (propertyChangeData) => {
        if (propertyChangeData.propertyName === 'searchQuery') {
            const query = propertyChangeData.value.toLowerCase();
            viewModel.set('filteredUsers', viewModel.users.filter(user => 
                user.name.toLowerCase().includes(query) || 
                user.username.toLowerCase().includes(query) ||
                user.role.toLowerCase().includes(query)
            ));
        }
    });

    // Add new user
    viewModel.onAddUser = () => {
        showModal({
            moduleNameOrComponent: './components/users/user-form',
            context: { isEdit: false },
            fullscreen: true
        }).then(newUser => {
            if (newUser) {
                authService.addUser(newUser);
                viewModel.set('users', authService.getAllUsers());
                viewModel.set('filteredUsers', viewModel.users);
            }
        });
    };

    // Edit user
    viewModel.onEditUser = (args) => {
        const user = viewModel.filteredUsers[args.index];
        showModal({
            moduleNameOrComponent: './components/users/user-form',
            context: { isEdit: true, user },
            fullscreen: true
        }).then(updatedUser => {
            if (updatedUser) {
                authService.updateUser(user.id, updatedUser);
                viewModel.set('users', authService.getAllUsers());
                viewModel.set('filteredUsers', viewModel.users);
            }
        });
    };

    // Delete user
    viewModel.onDeleteUser = (args) => {
        const user = viewModel.filteredUsers[args.index];
        confirm({
            title: "Delete User",
            message: `Are you sure you want to delete ${user.name}?`,
            okButtonText: "Delete",
            cancelButtonText: "Cancel"
        }).then(result => {
            if (result) {
                authService.deleteUser(user.id);
                viewModel.set('users', authService.getAllUsers());
                viewModel.set('filteredUsers', viewModel.users);
            }
        });
    };

    return viewModel;
}