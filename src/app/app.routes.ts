import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./Components/home-page/home-page').then(m => m.HomePage)  
    },
    {
        path : 'tours',
        loadComponent: () => import('./Components/finished-tours-page/finished-tours-page').then(m => m.FinishedToursPage)  
    },
    {
        path : 'gallery',
        loadComponent: () => import('./Components/gallery-page/gallery-page').then(m => m.GalleryPage)  
    },
    {
        path : 'register',
        loadComponent: () => import('./Components/register-page/register-page').then(m => m.RegisterPage)  
    },
    {
        path : 'admin',
        loadComponent: () => import('./Components/admin-panel/admin-panel').then(m => m.AdminPanel)
    }
];