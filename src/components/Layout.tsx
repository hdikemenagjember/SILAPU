import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../lib/firebase';
import { Button } from './ui/button';
import { LogOut, UserCircle, MapPin, Phone, Mail, Clock, Lock, ShieldCheck } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Lambang_Kementerian_Agama.svg/1200px-Lambang_Kementerian_Agama.svg.png" alt="Logo Kemenag" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight text-[#1e6b4d] leading-tight">
                    Kemenag Jember
                  </span>
                  <span className="text-xs text-slate-500 font-medium leading-tight">
                    Layanan Publik Digital
                  </span>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center gap-8">
              <nav className="hidden md:flex items-center gap-8">
                <Link to="/" className={`text-sm font-semibold transition-colors ${location.pathname === '/' ? 'text-[#1e6b4d]' : 'text-slate-600 hover:text-[#1e6b4d]'}`}>
                  Beranda
                </Link>
                <Link to="/" onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-semibold text-slate-600 hover:text-[#1e6b4d] transition-colors">
                  Layanan
                </Link>
                <Link to="/lacak" className={`text-sm font-semibold transition-colors ${location.pathname === '/lacak' ? 'text-[#1e6b4d]' : 'text-slate-600 hover:text-[#1e6b4d]'}`}>
                  Lacak Permohonan
                </Link>
              </nav>

              <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-sm">
                      <UserCircle className="w-5 h-5 text-slate-400" />
                      <span className="font-medium text-slate-700">{profile?.name || user.displayName}</span>
                      <span className="bg-emerald-50 text-[#1e6b4d] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                        {profile?.role || 'public'}
                      </span>
                    </div>
                    
                    {(profile?.role === 'admin' || profile?.role === 'superadmin') && (
                      <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-[#1e6b4d] transition-colors hidden sm:block">Admin Panel</Link>
                    )}
                    {(profile?.role === 'leader' || profile?.role === 'superadmin') && (
                      <Link to="/leader" className="text-sm font-medium text-slate-600 hover:text-[#1e6b4d] transition-colors hidden sm:block">Pimpinan Panel</Link>
                    )}
                    {profile?.role === 'superadmin' && (
                      <Link to="/superadmin" className="text-sm font-medium text-slate-600 hover:text-[#1e6b4d] transition-colors hidden sm:block">Super Admin</Link>
                    )}
                    {profile?.role === 'public' && (
                      <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-[#1e6b4d] transition-colors hidden sm:block">Dashboard</Link>
                    )}
                    
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <LogOut className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Keluar</span>
                    </Button>
                  </div>
                ) : (
                  <Button asChild variant="outline" className="rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#1e6b4d]">
                    <Link to="/login">Masuk</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-[#1e6b4d] text-white pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Column 1: Info */}
            <div className="space-y-6 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Lambang_Kementerian_Agama.svg/1200px-Lambang_Kementerian_Agama.svg.png" alt="Logo Kemenag" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Kantor Kemenag</h3>
                  <h3 className="font-bold text-lg leading-tight">Kabupaten Jember</h3>
                </div>
              </div>
              <div className="bg-emerald-800/50 p-4 rounded-xl border border-emerald-700/50 inline-block">
                <p className="text-sm font-bold text-emerald-100 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> BERSINAR
                </p>
                <p className="text-xs text-emerald-200">Bersih Melayani, Santun, Inovatif, Akuntabel dan Ramah</p>
              </div>
              <div className="space-y-3 text-emerald-50 text-sm">
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-emerald-300" />
                  <span>Jl. KH. Wahid Hasyim No. 12, Jember, Jawa Timur 68137</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-5 h-5 shrink-0 text-emerald-300" />
                  <span>(0331) 485123</span>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="w-5 h-5 shrink-0 text-emerald-300" />
                  <span>kemenagjember@kemenag.go.id</span>
                </p>
                <p className="flex items-start gap-3">
                  <Clock className="w-5 h-5 shrink-0 mt-0.5 text-emerald-300" />
                  <span>Senin - Jumat<br/>08:00 - 15:00 WIB</span>
                </p>
              </div>
            </div>

            {/* Column 2: Layanan */}
            <div>
              <h3 className="font-bold text-lg mb-6 border-b border-emerald-600/50 pb-2 inline-block">Layanan Kami</h3>
              <ul className="space-y-3 text-emerald-50 text-sm">
                <li><Link to="/" className="hover:text-white hover:underline underline-offset-4 transition-colors">Layanan Haji & Umrah</Link></li>
                <li><Link to="/" className="hover:text-white hover:underline underline-offset-4 transition-colors">Layanan Pendidikan Madrasah</Link></li>
                <li><Link to="/" className="hover:text-white hover:underline underline-offset-4 transition-colors">Layanan Bimas Islam</Link></li>
                <li><Link to="/" className="hover:text-white hover:underline underline-offset-4 transition-colors">Layanan PD Pontren</Link></li>
                <li><Link to="/" className="hover:text-white hover:underline underline-offset-4 transition-colors">Layanan PAI</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h3 className="font-bold text-lg mb-6 border-b border-emerald-600/50 pb-2 inline-block">Hubungi via WhatsApp</h3>
              <p className="text-emerald-50 text-sm mb-6 leading-relaxed">
                Punya pertanyaan terkait layanan kami? Jangan ragu untuk menghubungi tim admin kami melalui WhatsApp.
              </p>
              <a 
                href="https://wa.me/628113656262?text=Halo%20Admin%20Kemenag%20Jember,%20saya%20ingin%20bertanya" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                Chat WhatsApp
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-emerald-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-emerald-200 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Kementerian Agama Kabupaten Jember. Hak Cipta Dilindungi.
            </p>
            {!user && (
              <Link to="/login" className="inline-flex items-center justify-center text-emerald-200 hover:text-white hover:bg-emerald-800/50 rounded-lg px-3 py-1.5 text-xs transition-colors">
                <Lock className="w-3 h-3 mr-1.5" />
                Login Admin
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
