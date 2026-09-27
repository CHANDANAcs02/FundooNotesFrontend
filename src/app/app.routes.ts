import { Routes } from '@angular/router';

import { Login } from './features/auth/pages/login/login';
import { Signup } from './features/auth/pages/signup/signup';

import { Notes } from './features/notes/pages/notes/notes';
import { Archive } from './features/notes/pages/archive/archive';
import { Trash } from './features/notes/pages/trash/trash';
import { Reminders } from './features/notes/pages/reminders/reminders';
import { LabelNotes } from './features/notes/pages/label-notes/label-notes';

export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },

  {
    path: 'signup',
    component: Signup
  },

  {
    path: 'notes',
    component: Notes
  },

  {
    path: 'notes/reminders',
    component: Reminders
  },

  {
    path: 'notes/archive',
    component: Archive
  },

  {
    path: 'notes/trash',
    component: Trash
  },
  {
    path: 'notes/labels',
    redirectTo: 'notes',
    pathMatch: 'full'
  },

  {
    path: 'notes/label/:label',
    component: LabelNotes
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];