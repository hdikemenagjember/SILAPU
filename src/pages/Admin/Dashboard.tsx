import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, logAudit } from '../../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CheckCircle, XCircle, Clock, FileText, Send, Eye, List, History } from 'lucide-react';
import { ManageServices } from './ManageServices';

interface Application {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  serviceName: string;
  status: string;
  registrationNumber: string;
  createdAt: any;
  data: Record<string, any>;
  history: any[];
}

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'manage'>('history');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    if (activeTab !== 'history') return;
    
    const q = query(collection(db, 'applications'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];
      
      apps.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setApplications(apps);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'applications');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab]);

  const filteredApps = filter === 'all' ? applications : applications.filter(app => app.status === filter);

  const handleUpdateStatus = async (appId: string, newStatus: string, reason?: string) => {
    try {
      const appRef = doc(db, 'applications', appId);
      const app = applications.find(a => a.id === appId);
      if (!app) return;

      const newHistoryEntry = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: reason || `Status diubah menjadi ${newStatus}`
      };

      const updateData: any = {
        status: newStatus,
        updatedAt: serverTimestamp(),
        history: [...(app.history || []), newHistoryEntry]
      };

      if (reason) updateData.rejectionReason = reason;

      await updateDoc(appRef, updateData);
      await logAudit('UPDATE_STATUS', `Mengubah status pengajuan ${app.registrationNumber} menjadi ${newStatus}`);

      // Simulate WhatsApp Notification
      console.log(`[SIMULATED WHATSAPP] To: ${app.userPhone}, Message: Halo ${app.userName}, status pengajuan ${app.serviceName} Anda (${app.registrationNumber}) telah diperbarui menjadi: ${newStatus}.`);

      setSelectedApp(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${appId}`);
      alert('Gagal memperbarui status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="warning">Menunggu Verifikasi</Badge>;
      case 'verified': return <Badge variant="info">Diverifikasi</Badge>;
      case 'processing': return <Badge variant="info">Diproses</Badge>;
      case 'waiting_tte': return <Badge variant="warning">Menunggu TTE</Badge>;
      case 'completed': return <Badge variant="success">Selesai</Badge>;
      case 'rejected': return <Badge variant="destructive">Ditolak/Revisi</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Admin</h1>
          <p className="text-slate-500 mt-2">Kelola dan verifikasi pengajuan layanan masyarakat.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner w-full md:w-auto">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 md:flex-none flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'history' 
                ? 'bg-white text-[#1e6b4d] shadow-sm ring-1 ring-slate-200/50' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <History className="w-4 h-4 mr-2" /> History Layanan
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 md:flex-none flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'manage' 
                ? 'bg-white text-[#1e6b4d] shadow-sm ring-1 ring-slate-200/50' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <List className="w-4 h-4 mr-2" /> Kelola Layanan
          </button>
        </div>
      </div>

      {activeTab === 'manage' ? (
        <ManageServices />
      ) : (
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full scrollbar-hide">
            <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} size="sm" className={filter === 'all' ? 'bg-[#1e6b4d] hover:bg-[#15523a] text-white rounded-full' : 'rounded-full border-slate-200 text-slate-600 hover:text-[#1e6b4d] hover:bg-emerald-50'}>Semua</Button>
            <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')} size="sm" className={filter === 'pending' ? 'bg-[#1e6b4d] hover:bg-[#15523a] text-white rounded-full' : 'rounded-full border-slate-200 text-slate-600 hover:text-[#1e6b4d] hover:bg-emerald-50'}>Baru</Button>
            <Button variant={filter === 'verified' ? 'default' : 'outline'} onClick={() => setFilter('verified')} size="sm" className={filter === 'verified' ? 'bg-[#1e6b4d] hover:bg-[#15523a] text-white rounded-full' : 'rounded-full border-slate-200 text-slate-600 hover:text-[#1e6b4d] hover:bg-emerald-50'}>Diverifikasi</Button>
            <Button variant={filter === 'processing' ? 'default' : 'outline'} onClick={() => setFilter('processing')} size="sm" className={filter === 'processing' ? 'bg-[#1e6b4d] hover:bg-[#15523a] text-white rounded-full' : 'rounded-full border-slate-200 text-slate-600 hover:text-[#1e6b4d] hover:bg-emerald-50'}>Diproses</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of Applications */}
            <div className="lg:col-span-1 space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {loading ? (
                <div className="text-center py-10 text-gray-500">Memuat data...</div>
              ) : filteredApps.length === 0 ? (
                <div className="text-center py-10 text-gray-500 border rounded-lg bg-gray-50">Tidak ada pengajuan.</div>
              ) : (
                filteredApps.map(app => (
                  <Card 
                    key={app.id} 
                    className={`cursor-pointer transition-all duration-200 rounded-2xl border-slate-200 shadow-sm hover:shadow-md hover:border-[#1e6b4d] ${selectedApp?.id === app.id ? 'border-[#1e6b4d] bg-emerald-50/50 shadow-emerald-100' : 'bg-white'}`}
                    onClick={() => setSelectedApp(app)}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-mono font-semibold text-[#1e6b4d] bg-emerald-100/50 px-2 py-1 rounded-md">{app.registrationNumber}</span>
                        {getStatusBadge(app.status)}
                      </div>
                      <h3 className="font-bold text-slate-800 line-clamp-1 text-base">{app.serviceName}</h3>
                      <p className="text-sm text-slate-500 mt-1.5 font-medium">{app.userName}</p>
                      <p className="text-xs text-slate-400 mt-3 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        {app.createdAt ? format(app.createdAt.toDate(), 'dd MMM yyyy, HH:mm', { locale: id }) : '-'}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Application Details */}
            <div className="lg:col-span-2">
              {selectedApp ? (
                <Card className="sticky top-24 bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                  <CardHeader className="bg-slate-50 border-b border-slate-100 px-8 py-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">{selectedApp.serviceName}</CardTitle>
                        <p className="text-sm text-[#1e6b4d] mt-2 font-mono font-semibold bg-emerald-100/50 inline-block px-3 py-1 rounded-md">No. Reg: {selectedApp.registrationNumber}</p>
                      </div>
                      <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    
                    {/* Pemohon Info */}
                    <div>
                      <h4 className="font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                        <FileText className="w-4 h-4 mr-2" /> Data Pemohon
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Nama Lengkap</p>
                          <p className="font-medium">{selectedApp.userName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">No. WhatsApp</p>
                          <p className="font-medium">{selectedApp.userPhone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Persyaratan Info */}
                    <div>
                      <h4 className="font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                        <FileText className="w-4 h-4 mr-2" /> Data Persyaratan
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg border">
                        {Object.entries(selectedApp.data).map(([key, value]) => (
                          <div key={key} className="break-words">
                            <p className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            {typeof value === 'string' && value.startsWith('mock_url_for_') ? (
                              <a href="#" className="text-blue-600 hover:underline flex items-center mt-1">
                                <Eye className="w-3 h-3 mr-1" /> Lihat Dokumen
                              </a>
                            ) : (
                              <p className="font-medium">{value as string}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-slate-900 mb-4">Aksi Admin</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedApp.status === 'pending' && (
                          <>
                            <Button onClick={() => handleUpdateStatus(selectedApp.id, 'verified')} className="bg-[#1e6b4d] hover:bg-[#15523a] text-white rounded-full">
                              <CheckCircle className="w-4 h-4 mr-2" /> Verifikasi Berkas
                            </Button>
                            <Button onClick={() => {
                              const reason = prompt('Masukkan alasan penolakan/revisi:');
                              if (reason) handleUpdateStatus(selectedApp.id, 'rejected', reason);
                            }} variant="destructive" className="rounded-full">
                              <XCircle className="w-4 h-4 mr-2" /> Tolak / Revisi
                            </Button>
                          </>
                        )}
                        
                        {selectedApp.status === 'verified' && (
                          <Button onClick={() => handleUpdateStatus(selectedApp.id, 'processing')} className="bg-[#1e6b4d] hover:bg-[#15523a] text-white rounded-full">
                            <Clock className="w-4 h-4 mr-2" /> Mulai Proses
                          </Button>
                        )}

                        {selectedApp.status === 'processing' && (
                          <Button onClick={() => handleUpdateStatus(selectedApp.id, 'waiting_tte')} className="bg-[#1e6b4d] hover:bg-[#15523a] text-white rounded-full">
                            <Send className="w-4 h-4 mr-2" /> Kirim ke Pimpinan (TTE)
                          </Button>
                        )}

                        {selectedApp.status === 'waiting_tte' && (
                          <div className="text-sm font-medium text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200 w-full flex items-center gap-3">
                            <Clock className="w-5 h-5 text-amber-500" />
                            Menunggu Tanda Tangan Elektronik (TTE) dari Pimpinan.
                          </div>
                        )}

                        {selectedApp.status === 'completed' && (
                          <div className="text-sm font-medium text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-200 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                              <span>Layanan telah selesai. Dokumen hasil telah dikirim ke pemohon.</span>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => alert('Simulasi kirim ulang via WA')} className="rounded-full border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800">Kirim Ulang WA</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-xl bg-gray-50 text-gray-400">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Pilih pengajuan di daftar untuk melihat detail</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

