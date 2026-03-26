import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Button } from '../../components/ui/button';
import { ArrowLeft, ArrowRight, Clock, CheckSquare, Phone, FileText, CheckCircle2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  fields?: any[];
}

export const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;
      try {
        const docRef = doc(db, 'services', serviceId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setService({ id: docSnap.id, ...docSnap.data() } as Service);
        }
      } catch (error) {
        console.error("Error fetching service details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-16 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
          <FileText size={24} />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Layanan Tidak Ditemukan</h3>
        <p className="text-slate-500 mb-6">Maaf, layanan yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Button asChild className="bg-[#1e6b4d] hover:bg-[#15523a] text-white rounded-full px-6">
          <Link to="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    );
  }

  // Helper to format the description text into a nice list if it contains numbered items
  const formatDescription = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    // Check if the first line is a title (doesn't start with a number or dash)
    const hasTitle = lines.length > 0 && !/^[0-9a-zA-Z-]+\./.test(lines[0].trim());
    
    const title = hasTitle ? lines[0] : 'Persyaratan Layanan';
    const items = hasTitle ? lines.slice(1) : lines;

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3">{title}</h3>
        <ul className="space-y-3">
          {items.map((item, index) => {
            // Clean up the item text (remove leading numbers/bullets if any, we'll use custom icons)
            const cleanItem = item.replace(/^[0-9a-zA-Z-]+\.\s*/, '').trim();
            if (!cleanItem) return null;
            
            return (
              <li key={index} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{cleanItem}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="container py-10 max-w-4xl mx-auto px-4">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#1e6b4d] font-medium mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Layanan
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-white p-8 md:p-10 border-b border-slate-100">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-emerald-100 shrink-0">
              <FileText className="w-8 h-8 text-[#1e6b4d]" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-2">
                {service.name}
              </h1>
              <p className="text-slate-500 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-500" /> Layanan Aktif
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Requirements List */}
            <div className="lg:col-span-2">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                {formatDescription(service.description)}
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#1e6b4d]" /> Informasi Proses
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Estimasi Waktu</p>
                    <p className="text-sm text-slate-800 font-medium">1-3 Hari Kerja</p>
                    <p className="text-xs text-slate-500 mt-1">Tergantung kelengkapan dokumen</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Biaya Layanan</p>
                    <p className="text-sm text-emerald-600 font-semibold bg-emerald-50 inline-block px-2 py-1 rounded">Gratis (Rp 0)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full rounded-xl h-12 bg-[#1e6b4d] hover:bg-[#15523a] text-white font-medium shadow-sm group"
                  onClick={() => navigate(`/apply/${service.id}`)}
                >
                  Ajukan Permohonan <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl h-12 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
                  onClick={() => window.open('https://wa.me/628113656262?text=Halo%20Admin%20Kemenag%20Jember,%20saya%20ingin%20bertanya%20tentang%20layanan%20' + encodeURIComponent(service.name), '_blank')}
                >
                  <Phone className="mr-2 w-4 h-4 text-emerald-600" /> Tanya via WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
