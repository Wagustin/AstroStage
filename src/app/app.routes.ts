import { Routes } from '@angular/router';
import { Hero } from './components/hero/hero';
import { Simulator } from './components/simulator/simulator';
import { Features } from './components/features/features';
import { Waitlist } from './components/waitlist/waitlist';

export const routes: Routes = [
  { path: '', component: Hero },
  { path: 'experiencia', component: Simulator },
  { path: 'tecnologia', component: Features },
  { path: 'alquiler', component: Waitlist },
  { path: 'nosotros', component: Waitlist },
  { path: '**', redirectTo: '' }
];
