// Dashboard Configuration
export interface DashboardConfig {
  apiUrl: string;
  authEndpoint: string;
  uploadEndpoint: string;
}

export const dashboardConfig: DashboardConfig = {
  apiUrl: process.env.VITE_API_URL || 'http://localhost:3001/api',
  authEndpoint: '/auth',
  uploadEndpoint: '/upload',
};