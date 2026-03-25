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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Pimpinan</h1>
        <p className="text-gray-600 mt-2">Daftar dokumen yang menunggu Tanda Tangan Elektronik (TTE).</p>
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
                className={`cursor-pointer transition-colors hover:border-green-500 ${selectedApp?.id === app.id ? 'border-green-500 bg-green-50' : ''}`}
                onClick={() => {
                  setSelectedApp(app);
                  setNotes('');
                }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-500">{app.registrationNumber}</span>
                    <Badge variant="warning">Menunggu TTE</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-800 line-clamp-1">{app.serviceName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{app.userName}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Application Details & TTE Action */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <Card className="sticky top-24 shadow-lg border-green-200">
              <CardHeader className="bg-green-50 border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-green-900">{selectedApp.serviceName}</CardTitle>
                    <p className="text-sm text-green-700 mt-1 font-mono">No. Reg: {selectedApp.registrationNumber}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Draft Document Preview (Simulated) */}
                <div className="bg-gray-100 p-8 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <FileSignature className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Pratinjau Dokumen Draft</h3>
                  <p className="text-sm text-gray-500 mb-4">Dokumen telah diverifikasi dan diproses oleh Admin. Siap untuk ditandatangani.</p>
                  <Button variant="outline" className="bg-white">
                    <Eye className="w-4 h-4 mr-2" /> Lihat Draft Dokumen
                  </Button>
                </div>

                {/* TTE Actions */}
                <div className="border-t pt-6 space-y-4">
                  <h4 className="font-semibold text-gray-800">Aksi Pimpinan (TTE)</h4>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Catatan (Opsional)</label>
                    <Textarea 
                      placeholder="Tambahkan catatan jika perlu revisi atau ditolak..." 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button onClick={() => handleAction(selectedApp.id, 'approve')} className="bg-green-600 hover:bg-green-700 flex-1 py-6 text-lg">
                      <CheckCircle className="w-5 h-5 mr-2" /> Setujui & TTE
                    </Button>
                    <Button onClick={() => handleAction(selectedApp.id, 'reject')} variant="destructive" className="flex-1 py-6 text-lg">
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
