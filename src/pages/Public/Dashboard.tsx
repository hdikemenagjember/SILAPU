import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FileText, Download, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Application {
  id: string;
  serviceName: string;
  status: string;
  registrationNumber: string;
  createdAt: any;
  resultDocumentUrl?: string;
  rejectionReason?: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'applications'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];
      
      // Sort client-side since we didn't create a composite index yet
      apps.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      
      setApplications(apps);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'applications');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" /> Menunggu Verifikasi</Badge>;
      case 'verified': return <Badge variant="info"><CheckCircle className="w-3 h-3 mr-1" /> Diverifikasi</Badge>;
      case 'processing': return <Badge variant="info"><Clock className="w-3 h-3 mr-1" /> Diproses</Badge>;
      case 'waiting_tte': return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" /> Menunggu TTE Pimpinan</Badge>;
      case 'completed': return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" /> Selesai</Badge>;
      case 'rejected': return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Ditolak / Revisi</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Saya</h1>
          <p className="text-gray-600 mt-2">Pantau status pengajuan layanan Anda di sini.</p>
        </div>
        <Button asChild className="bg-orange-600 hover:bg-orange-700">
          <Link to="/">Ajukan Layanan Baru</Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Memuat data pengajuan...</div>
      ) : applications.length === 0 ? (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-500">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada pengajuan</h3>
            <p className="text-gray-500 mb-6 max-w-md">Anda belum pernah mengajukan layanan. Silakan kembali ke halaman utama untuk melihat daftar layanan yang tersedia.</p>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link to="/">Lihat Layanan</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications.map(app => (
            <Card key={app.id} className="overflow-hidden">
              <div className="bg-orange-50 px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm text-orange-800 font-medium mb-1">No. Registrasi: {app.registrationNumber}</p>
                  <h3 className="text-lg font-bold text-gray-900">{app.serviceName}</h3>
                </div>
                <div>{getStatusBadge(app.status)}</div>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Pengajuan</p>
                      <p className="font-medium">
                        {app.createdAt ? format(app.createdAt.toDate(), 'dd MMMM yyyy, HH:mm', { locale: id }) : '-'}
                      </p>
                    </div>
                    
                    {app.status === 'rejected' && app.rejectionReason && (
                      <div className="bg-red-50 p-4 rounded-md border border-red-100">
                        <p className="text-sm text-red-800 font-semibold mb-1">Alasan Penolakan / Revisi:</p>
                        <p className="text-sm text-red-700">{app.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-end gap-3 min-w-[200px]">
                    <Button variant="outline" className="w-full" onClick={() => alert('Fitur tracking detail sedang dalam pengembangan.')}>
                      Lacak Detail
                    </Button>
                    {app.status === 'completed' && app.resultDocumentUrl && (
                      <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                        <a href={app.resultDocumentUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Unduh Dokumen
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
