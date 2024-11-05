import { Application } from '@nativescript/core';
import { databaseService } from './services/database.service';
import { authService } from './services/auth.service';

// Initialize services
global.databaseService = databaseService;
global.authService = authService;

Application.run({ moduleName: 'login-page' });