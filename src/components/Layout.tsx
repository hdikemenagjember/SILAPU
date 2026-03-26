import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { loginWithGoogle, logout } from '../lib/firebase';
import { Button } from './ui/button';
import { LogIn, LogOut, Menu, UserCircle, FileText } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Login Error Details:", error);
      let errorMsg = error.message || 'Terjadi kesalahan saat login';
      
      if (error.code === 'auth/popup-blocked') {
        errorMsg = 'Browser Anda memblokir popup login. Silakan izinkan popup untuk situs ini atau buka aplikasi di tab baru.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMsg = 'Domain ini belum diizinkan di Firebase Console. Pastikan URL aplikasi sudah ditambahkan di menu Authentication > Settings > Authorized domains.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Jendela login ditutup sebelum proses selesai. Silakan coba lagi.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMsg = 'Gagal terhubung ke server. Periksa koneksi internet Anda.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMsg = 'Permintaan login dibatalkan karena ada permintaan login lain yang sedang berjalan.';
      }
      
      alert(`Login gagal: ${errorMsg}\n\n(Kode Error: ${error.code || 'unknown'})`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <FileText size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
                    Bersinar<span className="text-emerald-500">.</span>
                  </span>
                  <span className="font-bold text-xl tracking-tight text-slate-900 sm:hidden">
                    Bersinar<span className="text-emerald-500">.</span>
                  </span>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 text-sm">
                    <UserCircle className="w-5 h-5 text-slate-400" />
                    <span className="font-medium text-slate-700">{profile?.name || user.displayName}</span>
                    <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider">
                      {profile?.role || 'public'}
                    </span>
                  </div>
                  
                  {profile?.role === 'admin' && (
                    <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors hidden sm:block">Admin Panel</Link>
                  )}
                  {profile?.role === 'leader' && (
                    <Link to="/leader" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors hidden sm:block">Pimpinan Panel</Link>
                  )}
                  {profile?.role === 'superadmin' && (
                    <Link to="/superadmin" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors hidden sm:block">Super Admin</Link>
                  )}
                  
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full">
                    <LogOut className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Keluar</span>
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={handleLogin} className="text-emerald-700 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-300 shadow-sm rounded-full px-5">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login Petugas
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
              <FileText size={16} />
            </div>
            <span className="font-semibold text-slate-800 tracking-tight">Bersinar</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Hak Cipta Dilindungi.</p>
            <p className="text-xs mt-1 text-slate-400">Sistem Layanan Publik Terpadu Modern</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
