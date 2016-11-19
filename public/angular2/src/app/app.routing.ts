import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home';
import { AboutComponent } from './components/about';
import { SearchResultComponent } from './components/search-result';
import { PageNotFoundComponent } from './components/page-not-found';

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'search-result', component: SearchResultComponent },
	{ path: 'about', component: AboutComponent },
	// {
	//   path: 'detail', loadChildren: () => System.import('./+detail').then((comp: any) => {
	//     return comp.default;
	//   })
	//   ,
	// },
	{ path: '**', component: PageNotFoundComponent },
];

export const routing = RouterModule.forRoot(APP_ROUTES, { useHash: true });