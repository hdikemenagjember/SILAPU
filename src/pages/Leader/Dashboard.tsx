import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, logAudit } from '../../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CheckCircle, XCircle, FileSignature, Eye } from 'lucide-react';

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
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'applications'),
      where('status', '==', 'waiting_tte')
    );

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

  const handleAction = async (appId: string, action: 'approve' | 'reject') => {
    try {
      const appRef = doc(db, 'applications', appId);
      const app = applications.find(a => a.id === appId);
      if (!app) return;

      const newStatus = action === 'approve' ? 'completed' : 'rejected';
      const newHistoryEntry = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: notes || (action === 'approve' ? 'TTE Selesai' : 'Ditolak/Revisi oleh Pimpinan')
      };

      const updateData: any = {
        status: newStatus,
        updatedAt: serverTimestamp(),
        history: [...(app.history || []), newHistoryEntry],
        leaderNotes: notes
      };

      if (action === 'approve') {
        // Simulate PDF generation and URL assignment
        updateData.resultDocumentUrl = `https://example.com/docs/${app.registrationNumber}.pdf`;
      } else {
        updateData.rejectionReason = notes || 'Ditolak oleh pimpinan';
      }

      await updateDoc(appRef, updateData);
      await logAudit('LEADER_ACTION', `${action === 'approve' ? 'Menyetujui (TTE)' : 'Menolak'} pengajuan ${app.registrationNumber}`);

      // Simulate WhatsApp Notification
      const waMessage = action === 'approve' 
        ? `Halo ${app.userName}, pengajuan ${app.serviceName} Anda (${app.registrationNumber}) telah selesai dan ditandatangani. Unduh dokumen: ${updateData.resultDocumentUrl}`
        : `Halo ${app.userName}, pengajuan ${app.serviceName} Anda (${app.registrationNumber}) memerlukan revisi/ditolak. Catatan: ${notes}`;
      
      console.log(`[SIMULATED WHATSAPP] To: ${app.userPhone}, Message: ${waMessage}`);

      setSelectedApp(null);
      setNotes('');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${appId}`);
      alert('Gagal memproses aksi');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Pimpinan</h1>
        <p className="text-slate-500 mt-2">Daftar dokumen yang menunggu Tanda Tangan Elektronik (TTE).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List of Applications */}
        <div className="lg:col-span-1 space-y-4 max-h-[800px] overflow-y-auto pr-2">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Memuat data...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-10 text-gray-500 border rounded-lg bg-gray-50">Tidak ada dokumen menunggu TTE.</div>
          ) : (
            applications.map(app => (
              <Card 
                key={app.id} 
                className={`cursor-pointer transition-all duration-200 rounded-2xl border-slate-200 shadow-sm hover:shadow-md hover:border-[#1e6b4d] ${selectedApp?.id === app.id ? 'border-[#1e6b4d] bg-emerald-50/50 shadow-emerald-100' : 'bg-white'}`}
                onClick={() => {
                  setSelectedApp(app);
                  setNotes('');
                }}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono font-semibold text-[#1e6b4d] bg-emerald-100/50 px-2 py-1 rounded-md">{app.registrationNumber}</span>
                    <Badge variant="warning">Menunggu TTE</Badge>
                  </div>
                  <h3 className="font-bold text-slate-800 line-clamp-1 text-base">{app.serviceName}</h3>
                  <p className="text-sm text-slate-500 mt-1.5 font-medium">{app.userName}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Application Details & TTE Action */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <Card className="sticky top-24 bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 px-8 py-6">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">{selectedApp.serviceName}</CardTitle>
                    <p className="text-sm text-[#1e6b4d] mt-2 font-mono font-semibold bg-emerald-100/50 inline-block px-3 py-1 rounded-md">No. Reg: {selectedApp.registrationNumber}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                
                {/* Draft Document Preview (Simulated) */}
                <div className="bg-slate-50/50 p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center hover:bg-emerald-50/30 transition-colors">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-sm">
                    <FileSignature size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Pratinjau Dokumen Draft</h3>
                  <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">Dokumen telah diverifikasi dan diproses oleh Admin. Siap untuk ditandatangani secara elektronik (TTE).</p>
                  <Button variant="outline" className="bg-white rounded-full border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 px-6 h-12">
                    <Eye className="w-4 h-4 mr-2" /> Lihat Draft Dokumen
                  </Button>
                </div>

                {/* TTE Actions */}
                <div className="border-t border-slate-100 pt-8 space-y-6">
                  <h4 className="font-semibold text-slate-900 text-lg">Aksi Pimpinan (TTE)</h4>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Catatan Revisi / Penolakan (Opsional)</label>
                    <Textarea 
                      placeholder="Tambahkan catatan jika perlu revisi atau ditolak..." 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px] rounded-xl border-slate-300 focus:border-[#1e6b4d] focus:ring-[#1e6b4d]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button onClick={() => handleAction(selectedApp.id, 'approve')} className="bg-[#1e6b4d] hover:bg-[#15523a] text-white flex-1 py-6 text-lg rounded-full shadow-lg shadow-emerald-200 transition-transform hover:scale-105">
                      <CheckCircle className="w-5 h-5 mr-2" /> Setujui & TTE
                    </Button>
                    <Button onClick={() => handleAction(selectedApp.id, 'reject')} variant="destructive" className="flex-1 py-6 text-lg rounded-full shadow-lg shadow-red-200 transition-transform hover:scale-105">
                      <XCircle className="w-5 h-5 mr-2" /> Kembalikan / Tolak
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed rounded-xl bg-gray-50 text-gray-400">
              <div className="text-center">
                <FileSignature className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Pilih dokumen untuk melakukan TTE</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
