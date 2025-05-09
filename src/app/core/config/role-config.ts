export const ROLE_PATHS= {
    ADMIN: {
      allowedPaths: [
      '/admin/*',
      '/dashboard/*',
      '/chat/chat',
      '/dashboard/hrmdashboards/employees/*'
      ],
      defaultRedirect: '/admin/general-settings'
    },
    MANAGER: {
      allowedPaths: [
        '/dashboard/hrmdashboards/dashboard',
        '/dashboard/project-dashboard/project-list',
        '/chat/chat',
        '/dashboard/task-dashboard',
        '/dashboard/client-dashboard'
      ],
      defaultRedirect: '/dashboard/hrmdashboards/dashboard'
    },
    PARTNER: {
      allowedPaths: [
        '/dashboard/employee-dashboard',
        '/chat/chat',
        '/dashboard/hrmdashboards/employees'
      ],
      defaultRedirect: '/dashboard/employee-dashboard/dashboard'
    },
    DEFAULT: {
        allowedPaths: ['/auth/login', '/auth/register'],
        defaultRedirect: '/auth/login',
        menuAccess: []
      }
  };



