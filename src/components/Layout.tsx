import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { loginWithGoogle, logout } from '../lib/firebase';
import { Button } from './ui/button';
import { LogIn, LogOut, Menu, UserCircle } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-green-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-green-700 font-bold text-xl">K</span>
                </div>
                <span className="font-bold text-lg hidden sm:block">Layanan Publik Kemenag Jember</span>
                <span className="font-bold text-lg sm:hidden">Kemenag Jember</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 text-sm">
                    <UserCircle className="w-5 h-5" />
                    <span>{profile?.name || user.displayName}</span>
                    <span className="bg-green-800 px-2 py-0.5 rounded-full text-xs uppercase tracking-wider">
                      {profile?.role || 'public'}
                    </span>
                  </div>
                  
                  {profile?.role === 'admin' && (
                    <Link to="/admin" className="text-sm hover:underline hidden sm:block">Admin Panel</Link>
                  )}
                  {profile?.role === 'leader' && (
                    <Link to="/leader" className="text-sm hover:underline hidden sm:block">Pimpinan Panel</Link>
                  )}
                  {profile?.role === 'superadmin' && (
                    <Link to="/superadmin" className="text-sm hover:underline hidden sm:block">Super Admin</Link>
                  )}
                  
                  <Button variant="outline" size="sm" onClick={handleLogout} className="text-green-700 border-white hover:bg-green-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={handleLogin} className="text-green-700 border-white hover:bg-green-50">
                  <LogIn className="w-4 h-4 mr-2" />
                  Masuk / Daftar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Kantor Kementerian Agama Kabupaten Jember.</p>
          <p className="text-sm mt-2 text-gray-400">Sistem Layanan Publik Terpadu Terintegrasi WhatsApp</p>
        </div>
      </footer>
    </div>
  );
};
