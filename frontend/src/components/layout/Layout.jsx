import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAFA' }}>
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content - with left margin to account for fixed sidebar */}
      <main style={{ 
        flex: 1, 
        marginLeft: '260px', 
        padding: '32px',
        minWidth: 0,
        overflow: 'auto'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
