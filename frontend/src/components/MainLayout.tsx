import React from 'react';
import AppSidebar from './AppSidebar';

// MainLayout arranges the sidebar and main content using flexbox
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-screen">
    {/* Sidebar on the left */}
            <AppSidebar />
    {/* Main content area on the right */}
    <main className="flex-1 overflow-auto p-6">
      {children}
                </main>
            </div>
  );

export default MainLayout;
