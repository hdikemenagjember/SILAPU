import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { MessageCircle, FileText, CheckCircle, Smartphone, Search, ArrowRight } from 'lucide-react';

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

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-20 pb-10">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm px-6 py-20 lg:py-32 text-center">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
          <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-teal-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-sky-100/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <Badge variant="success" className="mb-8 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide uppercase">
            Sistem Layanan Publik Terpadu
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
            Lebih Cepat, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Lebih Transparan.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Ajukan berbagai layanan administrasi secara online tanpa perlu antre di kantor. Pantau status pengajuan Anda secara real-time.
          </p>

          {/* Integrated Search Bar in Hero */}
          <div className="max-w-2xl mx-auto relative group mb-8">
            <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-xl transition-all group-hover:bg-emerald-500/10"></div>
            <div className="relative flex items-center bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-full shadow-lg shadow-slate-200/50 p-2 transition-all hover:border-emerald-300/50 hover:bg-white">
              <Search className="text-emerald-600 w-6 h-6 ml-4" />
              <Input 
                type="text" 
                placeholder="Cari layanan (misal: Haji, Ijazah, Nikah)..." 
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg px-4 h-14 w-full placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button className="rounded-full px-8 h-14 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-transform hover:scale-105" onClick={() => {
                document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Cari
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
            <span>Atau butuh bantuan langsung?</span>
            <a href="https://wa.me/628113656262?text=Halo%20Bersinar,%20saya%20ingin%20mengajukan%20layanan" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline underline-offset-4">
              <MessageCircle className="w-4 h-4" /> Chat WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* How it works - Clean & Minimal */}
      <section className="py-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Cara Pengajuan Layanan</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Proses yang dirancang untuk memudahkan Anda dari awal hingga dokumen selesai.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-[1px] bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 z-0"></div>

          {[
            { icon: Search, title: "1. Cari Layanan", desc: "Temukan layanan yang Anda butuhkan melalui kolom pencarian." },
            { icon: FileText, title: "2. Isi Formulir", desc: "Lengkapi data diri dan unggah dokumen persyaratan yang diminta." },
            { icon: CheckCircle, title: "3. Verifikasi", desc: "Petugas akan memverifikasi dan memproses dokumen Anda." },
            { icon: Smartphone, title: "4. Selesai", desc: "Terima dokumen hasil langsung melalui WhatsApp atau unduh." }
          ].map((step, idx) => (
            <div key={idx} className="relative z-10 text-center group">
              <div className="w-20 h-20 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center mx-auto text-emerald-600 mb-6 group-hover:-translate-y-2 group-hover:shadow-md group-hover:border-emerald-200 transition-all duration-300 rotate-3 group-hover:rotate-0">
                <step.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-lg text-slate-800 mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Available Services - Glassmorphic Cards */}
      <section id="services-section" className="py-10 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Daftar Layanan</h2>
            <p className="text-slate-500">Pilih layanan yang ingin Anda ajukan hari ini.</p>
          </div>
          {searchTerm && (
            <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-normal">
              Menampilkan hasil untuk: <span className="font-semibold ml-1">"{searchTerm}"</span>
            </Badge>
          )}
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Memuat layanan...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Layanan tidak ditemukan</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchTerm ? 'Coba gunakan kata kunci lain atau periksa ejaan Anda.' : 'Belum ada layanan yang tersedia saat ini.'}
            </p>
            {searchTerm && (
              <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSearchTerm('')}>
                Hapus Pencarian
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <Card key={service.id} className="group bg-white/60 backdrop-blur-sm border-slate-200/60 hover:border-emerald-300/50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col h-full rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <FileText size={20} strokeWidth={1.5} />
                  </div>
                  <CardTitle className="text-xl text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between pt-0">
                  <CardDescription className="text-slate-500 mb-8 line-clamp-3 leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <Button 
                    variant="ghost"
                    className="w-full justify-between bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-100 hover:border-emerald-200 rounded-xl py-6 group/btn" 
                    onClick={() => navigate(`/apply/${service.id}`)}
                  >
                    <span className="font-semibold">Ajukan Sekarang</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
