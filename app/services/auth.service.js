import { Observable } from '@nativescript/core';
import { getString, setString } from '@nativescript/core/application-settings';

class AuthService extends Observable {
    constructor() {
        super();
        this.initializeUsers();
        this.currentUser = null;
    }

    initializeUsers() {
        // Try to get users from storage
        const storedUsers = getString('users');
        if (storedUsers) {
            this.users = JSON.parse(storedUsers);
        } else {
            // Initial admin user
            this.users = [{
                id: 1,
                username: 'admin',
                password: 'admin123',
                name: 'Administrator',
                role: 'admin',
                email: 'admin@clinic.com',
                phone: ''
            }];
            this.saveUsers();
        }
    }

    saveUsers() {
        setString('users', JSON.stringify(this.users));
    }

    login(username, password) {
        console.log('Login attempt:', username, password);
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            console.log('Login successful:', user.name);
            this.currentUser = user;
            return true;
        }
        console.log('Login failed');
        return false;
    }

    logout() {
        this.currentUser = null;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    hasPermission(role) {
        if (!this.currentUser) return false;
        if (this.currentUser.role === 'admin') return true;
        return this.currentUser.role === role;
    }

    getAllUsers() {
        return [...this.users];
    }

    addUser(userData) {
        const newUser = {
            ...userData,
            id: Math.max(...this.users.map(u => u.id)) + 1
        };
        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }

    updateUser(userId, userData) {
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
            this.users[index] = {
                ...this.users[index],
                ...userData,
                id: userId // Ensure ID doesn't change
            };
            this.saveUsers();
            return true;
        }
        return false;
    }

    deleteUser(userId) {
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1 && this.users[index].username !== 'admin') {
            this.users.splice(index, 1);
            this.saveUsers();
            return true;
        }
        return false;
    }
}

export const authService = new AuthService();