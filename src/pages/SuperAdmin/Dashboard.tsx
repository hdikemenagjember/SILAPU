import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, logAudit } from '../../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Settings, Users, Plus, Trash2, Save } from 'lucide-react';

interface ServiceField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'file';
  required: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  fields: ServiceField[];
  isActive: boolean;
}

interface UserProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: 'public' | 'admin' | 'leader' | 'superadmin';
}

export const Dashboard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'users'>('services');
  
  // New Service State
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '', description: '', isActive: true, fields: []
  });

  useEffect(() => {
    const qServices = query(collection(db, 'services'));
    const unsubServices = onSnapshot(qServices, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[]);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'services'));

    const qUsers = query(collection(db, 'users'));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserProfile[]);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'users'));

    return () => {
      unsubServices();
      unsubUsers();
    };
  }, []);

  const handleToggleService = async (serviceId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'services', serviceId), { isActive: !currentStatus });
      await logAudit('TOGGLE_SERVICE', `Mengubah status layanan ${serviceId} menjadi ${!currentStatus}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `services/${serviceId}`);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Yakin ingin menghapus layanan ini?')) return;
    try {
      await deleteDoc(doc(db, 'services', serviceId));
      await logAudit('DELETE_SERVICE', `Menghapus layanan ${serviceId}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `services/${serviceId}`);
    }
  };

  const handleSaveService = async () => {
    if (!newService.name || !newService.description) return alert('Nama dan deskripsi wajib diisi');
    try {
      await addDoc(collection(db, 'services'), {
        ...newService,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      await logAudit('ADD_SERVICE', `Menambah layanan baru: ${newService.name}`);
      setIsAddingService(false);
      setNewService({ name: '', description: '', isActive: true, fields: [] });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'services');
    }
  };

  const seedDefaultServices = async () => {
    if (!confirm('Tambahkan layanan default Bersinar?')) return;
    
    const serviceNames = [
      "Pendaftaran Haji", "Pembatalan Haji", "Pelimpahan Porsi Haji", "Permohonan Cuti Haji",
      "Pengecekan Porsi Haji", "Mutasi Haji", "Penggabungan Mahram", "Pendampingan Lansia",
      "Rekomendasi Pembukaan Kantor Cabang Penyelenggara Perjalanan Ibadah Umroh (PPIU)", 
      "Mutasi Siswa", "Rekomendasi Kegiatan", "Pergantian Kepala Madrasah", 
      "Rekomendasi Pergantian Specimen TTD Kamad/Bendahara Madrasah",
      "Rekomendasi Bantuan Sarana Prasarana Madrasah", "Rekomendasi Ijin Operasional Madrasah",
      "Legalisir Ijazah Madrasah/PKPPS", "Pengesahan Surat Keterangan Pengganti Ijazah/SKHUN",
      "Pengesahan Surat Keterangan Kesalahan Penulisan Ijazah", "Pengesahan Surat Keterangan kerusakan Ijazah",
      "Permohonan Ijin penelitian", "Pernohonan Rohaniwan", "Data Keagamaan dan Pendidikan",
      "Permohonan Narasumber", "Piagam Masjid/musholla", "Muallaf", "Piagam Majelis Taklim",
      "Pendaftaran Nikah", "Pendataran Tanah Wakaf", "Jadwal Sholat", "Pengajuan Izin Operasional Pesantren",
      "Pengajuan Izin Operasional Madrasah Diniyah (Madin)", "Pengajuan Izin Operasional LPQ",
      "IJOP PKPPS", "Rekomendasi Bantuan Sarana Prasarana Pondok Pesantren/Madin/TPQ",
      "Permohonan Ijin Studi ke luar Negeri", "Ijin Tinggal Sementara (ITAS) bagi Warga Negara Asing",
      "Permohonan Pembuatan Akun Siaga dan EMIS PAI", "Pengaduan Masyarakat"
    ];

    const defaultServices = serviceNames.map(name => ({
      name,
      description: `Layanan ${name} pada sistem Bersinar.`,
      isActive: true,
      fields: [
        { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
        { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
        { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
      ] as ServiceField[]
    }));

    try {
      for (const svc of defaultServices) {
        await addDoc(collection(db, 'services'), {
          ...svc,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      await logAudit('SEED_SERVICES', 'Menambahkan layanan default Bersinar');
      alert('Layanan default berhasil ditambahkan!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'services');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      await logAudit('UPDATE_USER_ROLE', `Mengubah role user ${userId} menjadi ${newRole}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const addFieldToNewService = () => {
    setNewService(prev => ({
      ...prev,
      fields: [...(prev.fields || []), { name: '', label: '', type: 'text', required: true }]
    }));
  };

  const updateNewServiceField = (index: number, key: keyof ServiceField, value: any) => {
    const updatedFields = [...(newService.fields || [])];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setNewService(prev => ({ ...prev, fields: updatedFields }));
  };

  const removeNewServiceField = (index: number) => {
    const updatedFields = [...(newService.fields || [])];
    updatedFields.splice(index, 1);
    setNewService(prev => ({ ...prev, fields: updatedFields }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Super Admin Panel</h1>
        <p className="text-slate-500 mt-2 text-lg">Kelola layanan, formulir dinamis, dan hak akses pengguna.</p>
      </div>

      <div className="flex gap-4 border-b border-slate-200 pb-4">
        <Button 
          variant={activeTab === 'services' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('services')}
          className={`rounded-full px-6 ${activeTab === 'services' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200' : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border-slate-200'}`}
        >
          <Settings className="w-4 h-4 mr-2" /> Kelola Layanan
        </Button>
        <Button 
          variant={activeTab === 'users' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('users')}
          className={`rounded-full px-6 ${activeTab === 'users' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200' : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border-slate-200'}`}
        >
          <Users className="w-4 h-4 mr-2" /> Kelola Pengguna
        </Button>
      </div>

      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Daftar Layanan</h2>
            <div className="flex gap-3">
              <Button variant="outline" onClick={seedDefaultServices} className="text-slate-600 border-slate-300 rounded-full hover:bg-slate-50">
                Load Layanan Default
              </Button>
              {!isAddingService && (
                <Button onClick={() => setIsAddingService(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md shadow-emerald-200">
                  <Plus className="w-4 h-4 mr-2" /> Tambah Layanan
                </Button>
              )}
            </div>
          </div>

          {isAddingService && (
            <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-b border-slate-100 px-8 py-6">
                <CardTitle className="text-emerald-800 text-xl font-bold">Tambah Layanan Baru</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Layanan</Label>
                    <Input 
                      value={newService.name} 
                      onChange={e => setNewService({...newService, name: e.target.value})} 
                      placeholder="Contoh: Legalisir Ijazah"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newService.isActive ? 'true' : 'false'}
                      onChange={e => setNewService({...newService, isActive: e.target.value === 'true'})}
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Tidak Aktif</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea 
                    value={newService.description} 
                    onChange={e => setNewService({...newService, description: e.target.value})} 
                    placeholder="Deskripsi singkat layanan..."
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">Formulir Dinamis (Field Persyaratan)</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addFieldToNewService}>
                      <Plus className="w-4 h-4 mr-2" /> Tambah Field
                    </Button>
                  </div>
                  
                  {newService.fields?.map((field, idx) => (
                    <div key={idx} className="flex gap-3 items-start bg-gray-50 p-3 rounded-md mb-3 border">
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs">Nama Field (ID)</Label>
                        <Input 
                          value={field.name} 
                          onChange={e => updateNewServiceField(idx, 'name', e.target.value.replace(/\s+/g, '_').toLowerCase())} 
                          placeholder="contoh: scan_ktp"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs">Label Tampilan</Label>
                        <Input 
                          value={field.label} 
                          onChange={e => updateNewServiceField(idx, 'label', e.target.value)} 
                          placeholder="Contoh: Scan KTP Asli"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs">Tipe Input</Label>
                        <select 
                          className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs"
                          value={field.type}
                          onChange={e => updateNewServiceField(idx, 'type', e.target.value)}
                        >
                          <option value="text">Teks Singkat</option>
                          <option value="textarea">Teks Panjang</option>
                          <option value="number">Angka</option>
                          <option value="file">Upload File (PDF/JPG)</option>
                        </select>
                      </div>
                      <div className="w-20 space-y-2">
                        <Label className="text-xs">Wajib?</Label>
                        <select 
                          className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                          value={field.required ? 'true' : 'false'}
                          onChange={e => updateNewServiceField(idx, 'required', e.target.value === 'true')}
                        >
                          <option value="true">Ya</option>
                          <option value="false">Tidak</option>
                        </select>
                      </div>
                      <Button variant="ghost" size="icon" className="mt-6 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeNewServiceField(idx)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {newService.fields?.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Belum ada field tambahan. Pemohon hanya akan mengisi data dasar (Nama, NIK, No WA).</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <Button variant="outline" onClick={() => setIsAddingService(false)} className="rounded-full border-slate-200 text-slate-600">Batal</Button>
                  <Button onClick={handleSaveService} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md shadow-emerald-200">
                    <Save className="w-4 h-4 mr-2" /> Simpan Layanan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? <p className="text-slate-500">Memuat layanan...</p> : services.map(service => (
              <Card key={service.id} className={`rounded-2xl border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 ${!service.isActive ? 'opacity-60 bg-slate-50' : 'bg-white'}`}>
                <CardHeader className="pb-3 px-6 pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg font-bold text-slate-800 leading-tight">{service.name}</CardTitle>
                    <Badge variant={service.isActive ? 'success' : 'secondary'} className="whitespace-nowrap">
                      {service.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4">
                  <p className="text-sm text-slate-500 line-clamp-2">{service.description}</p>
                  <div className="text-xs text-emerald-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 font-medium">
                    <span className="font-bold text-emerald-800">Fields:</span> {service.fields?.length || 0} custom fields
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 rounded-full border-slate-200 text-slate-700 hover:bg-slate-50"
                      onClick={() => handleToggleService(service.id, service.isActive)}
                    >
                      {service.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="rounded-full px-4"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Daftar Pengguna & Hak Akses</h2>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200/60">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Nama Pengguna</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Role Saat Ini</th>
                    <th className="px-6 py-4 font-semibold">Ubah Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                      <td className="px-6 py-4 text-slate-500">{u.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={u.role === 'superadmin' ? 'destructive' : u.role === 'leader' ? 'warning' : u.role === 'admin' ? 'info' : 'default'} className="rounded-full px-3">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 shadow-sm"
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                          disabled={u.email === 'hdikemenagjember@gmail.com'} // Prevent changing default superadmin
                        >
                          <option value="public">Public (Masyarakat)</option>
                          <option value="admin">Admin (Petugas)</option>
                          <option value="leader">Leader (Pimpinan)</option>
                          <option value="superadmin">Super Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
