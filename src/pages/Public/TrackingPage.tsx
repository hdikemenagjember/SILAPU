import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Search, FileText, Clock, CheckCircle, XCircle, AlertCircle, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export const TrackingPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialReg = searchParams.get('reg') || '';
  
  const [regNumber, setRegNumber] = useState(initialReg);
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<any | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialReg && user) {
      handleSearch(new Event('submit') as any, initialReg);
    }
  }, [initialReg, user]);

  const handleSearch = async (e: React.FormEvent, overrideReg?: string) => {
    e.preventDefault();
    if (!user) {
      setError('Silakan login terlebih dahulu untuk melacak permohonan.');
      return;
    }

    const searchReg = overrideReg || regNumber;
    if (!searchReg.trim()) return;

    setLoading(true);
    setError('');
    setApplication(null);

    try {
      const q = query(collection(db, 'applications'), where('registrationNumber', '==', searchReg.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        // Ensure the user owns this application or is an admin
        if (data.userId !== user.uid) {
           setError('Anda tidak memiliki akses untuk melihat permohonan ini.');
        } else {
           setApplication({ id: doc.id, ...data });
        }
      } else {
        setError('Pengajuan dengan nomor registrasi tersebut tidak ditemukan.');
      }
    } catch (err: any) {
      console.error("Error fetching application", err);
      if (err.message?.includes('Missing or insufficient permissions')) {
        setError('Anda tidak memiliki akses untuk melihat permohonan ini.');
      } else {
        setError('Terjadi kesalahan saat mencari data. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-12 max-w-3xl mx-auto text-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#1e6b4d]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Login Diperlukan</h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Untuk menjaga kerahasiaan dan keamanan data, Anda diharuskan login menggunakan akun Google untuk melacak status permohonan layanan Anda.
          </p>
          <Button asChild className="bg-[#1e6b4d] hover:bg-[#15523a] text-white rounded-full px-8 h-12">
            <Link to="/login">Masuk dengan Google</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-6 h-6 text-amber-500" />;
      case 'approved': return <CheckCircle className="w-6 h-6 text-emerald-500" />;
      case 'rejected': return <XCircle className="w-6 h-6 text-red-500" />;
      default: return <AlertCircle className="w-6 h-6 text-slate-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Verifikasi';
      case 'approved': return 'Disetujui';
      case 'rejected': return 'Ditolak';
      default: return 'Status Tidak Diketahui';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="container py-12 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">Lacak Permohonan</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Masukkan nomor registrasi untuk melihat status permohonan Anda.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input 
              type="text" 
              placeholder="Masukkan Nomor Registrasi" 
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              className="h-11 rounded-lg border-slate-300 focus:border-[#1e6b4d] focus:ring-[#1e6b4d] text-base"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="h-11 px-8 rounded-lg bg-[#1e6b4d] hover:bg-[#15523a] text-white text-base font-medium">
            <Search className="w-5 h-5 mr-2" />
            {loading ? 'Mencari...' : 'Lacak'}
          </Button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-center text-sm">
            {error}
          </div>
        )}
      </div>

      {application && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Info Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Nomor Registrasi</p>
              <p className="text-lg font-semibold text-slate-900">{application.registrationNumber}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-slate-500 mb-1">Layanan</p>
              <p className="text-lg font-semibold text-slate-900">{application.serviceName}</p>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-8">Status Permohonan</h3>
            
            <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-0 before:h-full before:w-0.5 before:bg-slate-200">
              
              {/* Step 1: Diterima (Always true if application exists) */}
              <div className="relative">
                <div className="absolute -left-11 mt-1 w-6 h-6 rounded-full bg-[#1e6b4d] flex items-center justify-center z-10 ring-4 ring-white">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Diterima</h4>
                  <p className="text-sm text-slate-500 mt-1">Permohonan Anda telah diterima oleh sistem.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {application.createdAt ? format(application.createdAt.toDate(), 'dd MMM yyyy, HH:mm', { locale: idLocale }) : '-'}
                  </p>
                </div>
              </div>

              {/* Step 2: Diproses / Verifikasi */}
              <div className="relative">
                <div className={`absolute -left-11 mt-1 w-6 h-6 rounded-full flex items-center justify-center z-10 ring-4 ring-white ${['verified', 'processing', 'waiting_tte', 'completed', 'rejected'].includes(application.status) ? 'bg-[#1e6b4d]' : application.status === 'pending' ? 'bg-amber-500' : 'bg-slate-200'}`}>
                  {['verified', 'processing', 'waiting_tte', 'completed', 'rejected'].includes(application.status) ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : application.status === 'pending' ? (
                    <Clock className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  )}
                </div>
                <div>
                  <h4 className={`font-bold text-base ${['verified', 'processing', 'waiting_tte', 'completed', 'rejected', 'pending'].includes(application.status) ? 'text-slate-900' : 'text-slate-400'}`}>Diproses / Verifikasi</h4>
                  <p className="text-sm text-slate-500 mt-1">Dokumen sedang diperiksa oleh petugas.</p>
                  {/* Show history note if available for this step */}
                  {application.history?.find((h:any) => h.status === 'pending')?.note && (
                    <p className="text-sm text-amber-600 mt-2 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      Catatan: {application.history.find((h:any) => h.status === 'pending').note}
                    </p>
                  )}
                </div>
              </div>

              {/* Step 3: Selesai */}
              <div className="relative">
                <div className={`absolute -left-11 mt-1 w-6 h-6 rounded-full flex items-center justify-center z-10 ring-4 ring-white ${application.status === 'completed' ? 'bg-[#1e6b4d]' : application.status === 'rejected' ? 'bg-red-500' : 'bg-slate-200'}`}>
                  {application.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : application.status === 'rejected' ? (
                    <XCircle className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  )}
                </div>
                <div>
                  <h4 className={`font-bold text-base ${['completed', 'rejected'].includes(application.status) ? 'text-slate-900' : 'text-slate-400'}`}>
                    {application.status === 'rejected' ? 'Ditolak' : 'Selesai'}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    {application.status === 'completed' 
                      ? 'Permohonan selesai diproses. Dokumen dapat diambil atau diunduh.' 
                      : application.status === 'rejected'
                      ? 'Permohonan ditolak. Silakan periksa catatan dari petugas.'
                      : 'Menunggu proses selesai.'}
                  </p>
                  {/* Show history note for final step */}
                  {application.history?.find((h:any) => h.status === application.status)?.note && ['completed', 'rejected'].includes(application.status) && (
                    <p className={`text-sm mt-2 p-3 rounded-lg border ${application.status === 'completed' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-red-700 bg-red-50 border-red-100'}`}>
                      Catatan: {application.history.find((h:any) => h.status === application.status).note}
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
