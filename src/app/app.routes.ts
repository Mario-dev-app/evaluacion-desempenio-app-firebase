import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'goals-review',
    loadComponent: () => import('./pages/goals-review/goals-review.page').then( m => m.GoalsReviewPage)
  },
  {
    path: 'approvals-review',
    loadComponent: () => import('./pages/approvals-review/approvals-review.page').then( m => m.ApprovalsReviewPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'config',
    loadComponent: () => import('./pages/config/config.page').then( m => m.ConfigPage)
  },
  {
    path: 'survey',
    loadComponent: () => import('./pages/survey/survey.page').then( m => m.SurveyPage)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then( m => m.AdminPage)
  },
  {
    path: 'approvers',
    loadComponent: () => import('./pages/approvers/approvers.page').then( m => m.ApproversPage)
  },
  {
    path: 'survey-list',
    loadComponent: () => import('./pages/survey-list/survey-list.page').then( m => m.SurveyListPage)
  },  {
    path: 'download-results',
    loadComponent: () => import('./pages/download-results/download-results.page').then( m => m.DownloadResultsPage)
  }

];
