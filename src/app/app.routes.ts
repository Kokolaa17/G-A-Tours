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
        path : 'finished-tours',
        loadComponent: () => import('./Components/finished-tours-page/finished-tours-page').then(m => m.FinishedToursPage)  
    },
    {
        path : 'gallery',
        loadComponent: () => import('./Components/gallery-page/gallery-page').then(m => m.GalleryPage)  
    },
];