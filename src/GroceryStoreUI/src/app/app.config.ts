/* This file runs before the application starts
 * It enables services that the application needs to run
 * First the Application starts, then Error Handing enables
 * then Routing enables, later http requests enable
 * and lastly the app launches
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// Configurates application-wide services used throughout the Angular app
export const appConfig: ApplicationConfig = {
  providers: [

    // Enables global error handling for uncaught application errors
    provideBrowserGlobalErrorListeners(),

    // Enables navigation using the routes defined in app.routes.ts
    provideRouter(routes),

    // Enables HTTP communication with th ASP.NET Web API
    provideHttpClient()

  ]
};
