import { Observable } from '@nativescript/core';
import { authService } from './services/auth.service';

export function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = createViewModel(page);
}

function createViewModel(page) {
    const viewModel = new Observable();
    
    viewModel.username = '';
    viewModel.password = '';
    viewModel.errorMessage = '';

    viewModel.onLogin = () => {
        const success = authService.login(viewModel.get('username'), viewModel.get('password'));
        
        if (success) {
            const frame = page.frame;
            frame.navigate({
                moduleName: 'main-page',
                clearHistory: true
            });
        } else {
            viewModel.set('errorMessage', 'Invalid username or password');
        }
    };

    return viewModel;
}

export function onLoginTap(args) {
    const button = args.object;
    const page = button.page;
    const vm = page.bindingContext;
    vm.onLogin();
}