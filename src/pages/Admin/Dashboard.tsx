import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, logAudit } from '../../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CheckCircle, XCircle, Clock, FileText, Send, Eye } from 'lucide-react';

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
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
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
  }, []);

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Kelola dan verifikasi pengajuan layanan masyarakat.</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} size="sm">Semua</Button>
          <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')} size="sm">Baru</Button>
          <Button variant={filter === 'verified' ? 'default' : 'outline'} onClick={() => setFilter('verified')} size="sm">Diverifikasi</Button>
          <Button variant={filter === 'processing' ? 'default' : 'outline'} onClick={() => setFilter('processing')} size="sm">Diproses</Button>
        </div>
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
                className={`cursor-pointer transition-colors hover:border-orange-500 ${selectedApp?.id === app.id ? 'border-orange-500 bg-orange-50' : ''}`}
                onClick={() => setSelectedApp(app)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-500">{app.registrationNumber}</span>
                    {getStatusBadge(app.status)}
                  </div>
                  <h3 className="font-semibold text-gray-800 line-clamp-1">{app.serviceName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{app.userName}</p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
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
            <Card className="sticky top-24 shadow-lg border-orange-200">
              <CardHeader className="bg-orange-50 border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-orange-900">{selectedApp.serviceName}</CardTitle>
                    <p className="text-sm text-orange-700 mt-1 font-mono">No. Reg: {selectedApp.registrationNumber}</p>
                  </div>
                  {getStatusBadge(selectedApp.status)}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
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
                  <h4 className="font-semibold text-gray-800 mb-4">Aksi Admin</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedApp.status === 'pending' && (
                      <>
                        <Button onClick={() => handleUpdateStatus(selectedApp.id, 'verified')} className="bg-blue-600 hover:bg-blue-700">
                          <CheckCircle className="w-4 h-4 mr-2" /> Verifikasi Berkas
                        </Button>
                        <Button onClick={() => {
                          const reason = prompt('Masukkan alasan penolakan/revisi:');
                          if (reason) handleUpdateStatus(selectedApp.id, 'rejected', reason);
                        }} variant="destructive">
                          <XCircle className="w-4 h-4 mr-2" /> Tolak / Revisi
                        </Button>
                      </>
                    )}
                    
                    {selectedApp.status === 'verified' && (
                      <Button onClick={() => handleUpdateStatus(selectedApp.id, 'processing')} className="bg-indigo-600 hover:bg-indigo-700">
                        <Clock className="w-4 h-4 mr-2" /> Mulai Proses
                      </Button>
                    )}

                    {selectedApp.status === 'processing' && (
                      <Button onClick={() => handleUpdateStatus(selectedApp.id, 'waiting_tte')} className="bg-purple-600 hover:bg-purple-700">
                        <Send className="w-4 h-4 mr-2" /> Kirim ke Pimpinan (TTE)
                      </Button>
                    )}

                    {selectedApp.status === 'waiting_tte' && (
                      <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded border border-orange-200 w-full">
                        Menunggu Tanda Tangan Elektronik (TTE) dari Pimpinan.
                      </div>
                    )}

                    {selectedApp.status === 'completed' && (
                      <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded border border-orange-200 w-full flex justify-between items-center">
                        <span>Layanan telah selesai. Dokumen hasil telah dikirim ke pemohon.</span>
                        <Button size="sm" variant="outline" onClick={() => alert('Simulasi kirim ulang via WA')}>Kirim Ulang WA</Button>
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
  );
};
