import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, logAudit } from '../../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Edit, Trash2, Plus, Save, X, Download } from 'lucide-react';
import { defaultServicesData } from '../../data/servicesData';

interface Service {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  fields: any[];
}

export const ManageServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'services'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const svcs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      setServices(svcs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'services');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({ name: service.name, description: service.description, isActive: service.isActive });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', description: '', isActive: true });
  };

  const handleSave = async (id: string) => {
    try {
      const ref = doc(db, 'services', id);
      await updateDoc(ref, {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        updatedAt: serverTimestamp()
      });
      await logAudit('UPDATE_SERVICE', `Memperbarui layanan: ${formData.name}`);
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `services/${id}`);
      alert('Gagal menyimpan perubahan');
    }
  };

  const handleAdd = async () => {
    try {
      await addDoc(collection(db, 'services'), {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        fields: [
          { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
          { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
          { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
        ],
        createdAt: serverTimestamp()
      });
      await logAudit('CREATE_SERVICE', `Menambahkan layanan baru: ${formData.name}`);
      setIsAdding(false);
      setFormData({ name: '', description: '', isActive: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'services');
      alert('Gagal menambahkan layanan');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus layanan "${name}"?`)) {
      try {
        await deleteDoc(doc(db, 'services', id));
        await logAudit('DELETE_SERVICE', `Menghapus layanan: ${name}`);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
        alert('Gagal menghapus layanan');
      }
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean, name: string) => {
    try {
      await updateDoc(doc(db, 'services', id), { isActive: !currentStatus });
      await logAudit('TOGGLE_SERVICE_STATUS', `Mengubah status layanan ${name} menjadi ${!currentStatus ? 'Aktif' : 'Nonaktif'}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `services/${id}`);
    }
  };

  const handleSeedData = async () => {
    if (!window.confirm('Apakah Anda yakin ingin memuat data layanan default? Ini akan menambahkan banyak layanan sekaligus.')) return;
    
    setIsSeeding(true);
    try {
      for (const service of defaultServicesData) {
        await addDoc(collection(db, 'services'), {
          ...service,
          createdAt: serverTimestamp()
        });
      }
      await logAudit('SEED_SERVICES', 'Memuat data layanan default');
      alert('Berhasil memuat data layanan!');
    } catch (error) {
      console.error("Error seeding data:", error);
      alert('Gagal memuat data layanan.');
    } finally {
      setIsSeeding(false);
    }
  };

  if (loading) return <div className="py-10 text-center text-slate-500">Memuat layanan...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Daftar Layanan</h2>
        <div className="flex gap-2">
          {services.length === 0 && (
            <Button onClick={handleSeedData} disabled={isSeeding} variant="outline" className="border-[#1e6b4d] text-[#1e6b4d] hover:bg-emerald-50">
              <Download className="w-4 h-4 mr-2" /> {isSeeding ? 'Memuat...' : 'Muat Data Default'}
            </Button>
          )}
          {!isAdding && (
            <Button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', description: '', isActive: true }); }} className="bg-[#1e6b4d] hover:bg-[#15523a] text-white">
              <Plus className="w-4 h-4 mr-2" /> Tambah Layanan
            </Button>
          )}
        </div>
      </div>

      {isAdding && (
        <Card className="border-[#1e6b4d] shadow-sm">
          <CardHeader className="bg-emerald-50/50 pb-4">
            <CardTitle className="text-lg text-[#1e6b4d]">Tambah Layanan Baru</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Nama Layanan</label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Masukkan nama layanan..." />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Persyaratan / Deskripsi</label>
              <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Masukkan persyaratan layanan..." rows={5} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleCancel}>Batal</Button>
              <Button onClick={handleAdd} className="bg-[#1e6b4d] hover:bg-[#15523a] text-white">Simpan</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {services.map(service => (
          <Card key={service.id} className="overflow-hidden border-slate-200">
            {editingId === service.id ? (
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Nama Layanan</label>
                  <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Persyaratan / Deskripsi</label>
                  <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={5} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={handleCancel}><X className="w-4 h-4 mr-1" /> Batal</Button>
                  <Button onClick={() => handleSave(service.id)} className="bg-[#1e6b4d] hover:bg-[#15523a] text-white"><Save className="w-4 h-4 mr-1" /> Simpan</Button>
                </div>
              </CardContent>
            ) : (
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-slate-900">{service.name}</h3>
                    <Badge variant={service.isActive ? "success" : "secondary"} className="cursor-pointer" onClick={() => toggleStatus(service.id, service.isActive, service.name)}>
                      {service.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap line-clamp-2">{service.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200">
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(service.id, service.name)} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                    <Trash2 className="w-4 h-4 mr-1" /> Hapus
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        {services.length === 0 && !loading && (
          <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-slate-200">Belum ada layanan. Silakan muat data default atau tambah layanan baru.</div>
        )}
      </div>
    </div>
  );
};
