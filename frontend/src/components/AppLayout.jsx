import { useState } from 'react';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <main 
        className="transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: sidebarCollapsed ? '80px' : '288px',
          paddingTop: '24px',
          paddingBottom: '24px'
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;