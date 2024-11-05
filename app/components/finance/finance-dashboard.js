import { Observable } from '@nativescript/core';
import { databaseService } from '../../services/database.service';
import { showModal } from '@nativescript/core';

export function createViewModel() {
    const viewModel = new Observable();
    
    // Calculate summary data
    const transactions = databaseService.transactions.map(transaction => ({
        ...transaction,
        patient: databaseService.getPatientById(transaction.patientId)
    }));

    viewModel.transactions = transactions;
    viewModel.totalEarnings = transactions
        .filter(t => t.status === 'paid')
        .reduce((sum, t) => sum + t.amount, 0);
    viewModel.pendingPayments = transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);

    viewModel.onAddTransaction = () => {
        showModal({
            moduleNameOrComponent: './components/finance/transaction-form',
            context: {},
            fullscreen: true,
            animated: true
        }).then(transaction => {
            if (transaction) {
                databaseService.addTransaction(transaction);
                // Update the dashboard
                viewModel.notifyPropertyChange('transactions', viewModel.transactions);
                viewModel.notifyPropertyChange('totalEarnings', viewModel.totalEarnings);
                viewModel.notifyPropertyChange('pendingPayments', viewModel.pendingPayments);
            }
        });
    };

    return viewModel;
}