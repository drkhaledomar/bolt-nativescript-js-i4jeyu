import { Observable } from '@nativescript/core';

export function onNavigatingTo(args) {
    const page = args.object;
    const context = page.navigationContext;
    page.bindingContext = createViewModel(context);
}

function createViewModel(context) {
    const viewModel = new Observable();
    
    viewModel.set('htmlContent', context.html);
    
    viewModel.onClose = (args) => {
        args.object.page.closeModal();
    };
    
    return viewModel;
}