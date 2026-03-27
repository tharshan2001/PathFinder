import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="flex pt-[60px]">
        <Sidebar />
        <main className="flex-1 ml-[240px] p-6 min-h-[calc(100vh-60px)]">
          <div className="container mx-auto max-w-[900px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
