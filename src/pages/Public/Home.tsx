import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, loginWithGoogle } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { MessageCircle, FileText, CheckCircle, Smartphone, Search, ArrowRight, UserCircle, History } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), where('isActive', '==', true));
        const querySnapshot = await getDocs(q);
        const fetchedServices = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        setServices(fetchedServices);
      } catch (error) {
        console.error("Error fetching services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error("Login Error:", error);
      alert("Gagal masuk dengan Google. Silakan coba lagi.");
    } finally {
      setLoginLoading(false);
    }
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-20 pb-10">
      {/* Modern Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-white border-b border-slate-100 px-6 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          
          <div className="flex-1 text-left">
            <Badge variant="outline" className="mb-6 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-[#1e6b4d] border-[#1e6b4d]/20 bg-white">
              Layanan Publik Digital
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.2]">
              Ajukan Layanan Kemenag Jember <br className="hidden md:block" />
              <span className="text-[#1e6b4d]">
                Lebih Mudah & Cepat
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              Ajukan berbagai layanan administrasi secara online tanpa perlu antre di kantor. Cepat, transparan, dan dapat dipantau dari mana saja.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button 
                className="rounded-lg px-6 h-12 bg-[#1e6b4d] hover:bg-[#15523a] text-white text-base font-medium" 
                onClick={() => {
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Mulai Layanan
              </Button>
              <a 
                href="https://wa.me/628113656262?text=Halo%20Admin%20Kemenag%20Jember,%20saya%20ingin%20bertanya" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg px-6 h-12 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-base font-medium transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2 text-emerald-600" /> Chat WhatsApp
              </a>
            </div>
          </div>

          <div className="flex-1 relative hidden md:block">
            <div className="relative w-full aspect-[4/3] max-w-[500px] mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center overflow-hidden">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Lambang_Kementerian_Agama.svg/1200px-Lambang_Kementerian_Agama.svg.png" alt="Logo Kemenag" className="w-32 h-32 object-contain mb-6 opacity-90" referrerPolicy="no-referrer" />
              <h3 className="text-xl font-semibold text-slate-800 mb-1">Pusat Layanan Terpadu</h3>
              <p className="text-slate-500 text-center">Kementerian Agama Kab. Jember</p>
            </div>
          </div>

        </div>
      </section>

      {/* Login Prompt for Public Users (if not logged in) */}
      {!user && (
        <section className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#1e6b4d] to-emerald-800 rounded-3xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
            {/* Decorative background circles */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-6 backdrop-blur-sm">
                  <History className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Pantau Riwayat Layanan Anda</h2>
                <p className="text-emerald-50 text-base md:text-lg max-w-xl leading-relaxed">
                  Masuk dengan akun Google Anda untuk menyimpan riwayat pengajuan, melacak status secara real-time, dan mempermudah pengisian formulir di masa mendatang.
                </p>
              </div>
              <div className="shrink-0 w-full md:w-auto">
                <Button 
                  onClick={handleGoogleLogin} 
                  disabled={loginLoading}
                  className="w-full md:w-auto h-14 px-8 rounded-xl bg-white text-[#1e6b4d] hover:bg-slate-50 text-base font-semibold shadow-sm flex items-center justify-center gap-3 transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {loginLoading ? 'Memproses...' : 'Masuk dengan Google'}
                </Button>
                <p className="text-emerald-100/80 text-xs text-center mt-3">
                  Aman, cepat, dan tidak perlu mengingat password baru.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How it works - Clean & Minimal */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4">Cara Menggunakan Layanan</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Proses yang dirancang untuk memudahkan Anda dari awal hingga dokumen selesai.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-[1px] bg-slate-200 z-0"></div>

          {[
            { icon: MessageCircle, title: "1. Hubungi WhatsApp", desc: "Konsultasikan kebutuhan layanan Anda melalui admin WhatsApp kami." },
            { icon: FileText, title: "2. Isi Formulir", desc: "Lengkapi data diri dan unggah dokumen persyaratan yang diminta." },
            { icon: CheckCircle, title: "3. Terima Hasil", desc: "Dokumen yang sudah selesai akan dikirimkan kembali kepada Anda." }
          ].map((step, idx) => (
            <div key={idx} className="relative z-10 text-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#1e6b4d] mb-5">
                <step.icon size={28} strokeWidth={2} />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Available Services - Glassmorphic Cards */}
      <section id="services-section" className="py-16 max-w-7xl mx-auto px-4 bg-slate-50/50 rounded-3xl mb-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">Layanan Tersedia</h2>
            <p className="text-slate-600">Pilih layanan yang ingin Anda ajukan hari ini.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              type="text" 
              placeholder="Cari layanan..." 
              className="pl-10 rounded-lg border-slate-200 bg-white focus-visible:ring-[#1e6b4d]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Memuat layanan...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Layanan tidak ditemukan</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchTerm ? 'Coba gunakan kata kunci lain atau periksa ejaan Anda.' : 'Belum ada layanan yang tersedia saat ini.'}
            </p>
            {searchTerm && (
              <Button variant="outline" className="mt-6 rounded-lg" onClick={() => setSearchTerm('')}>
                Hapus Pencarian
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <Card 
                key={service.id} 
                className="group flex flex-col h-full bg-white border border-slate-200 hover:border-[#1e6b4d]/40 hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => navigate(`/layanan/${service.id}`)}
              >
                <CardHeader className="p-6 pb-4">
                  <div className="w-12 h-12 bg-emerald-50/80 text-[#1e6b4d] rounded-lg flex items-center justify-center mb-4 border border-emerald-100/50">
                    <FileText size={24} strokeWidth={2} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-900 leading-snug group-hover:text-[#1e6b4d] transition-colors">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                  <CardDescription className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6">
                    {service.description}
                  </CardDescription>
                  
                  <div className="mt-auto flex items-center text-sm font-medium text-[#1e6b4d]">
                    Lihat Persyaratan <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
