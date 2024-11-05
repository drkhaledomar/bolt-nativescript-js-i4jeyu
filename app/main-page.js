import { Observable } from '@nativescript/core';
import { authService } from './services/auth.service';

export function onNavigatingTo(args) {
    const page = args.object;
    
    // Check authentication
    if (!authService.isAuthenticated()) {
        page.frame.navigate({
            moduleName: 'login-page',
            clearHistory: true
        });
        return;
    }
    
    page.bindingContext = createViewModel();
}

export function createViewModel() {
    const viewModel = new Observable();
    const currentUser = authService.getCurrentUser();
    
    viewModel.selectedTabIndex = 0;
    viewModel.userName = currentUser.name;
    viewModel.userRole = currentUser.role;

    viewModel.onLogout = (args) => {
        authService.logout();
        const frame = args.object.page.frame;
        frame.navigate({
            moduleName: 'login-page',
            clearHistory: true
        });
    };

    return viewModel;
}