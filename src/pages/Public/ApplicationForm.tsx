import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Send } from 'lucide-react';

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
}

export const ApplicationForm = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      try {
        const docRef = doc(db, 'services', serviceId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setService({ id: docSnap.id, ...docSnap.data() } as Service);
        } else {
          setError('Layanan tidak ditemukan.');
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `services/${serviceId}`);
        setError('Gagal memuat layanan.');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      // In a real app, we would upload this to Firebase Storage.
      // For this prototype, we'll just store the file name or a mock URL.
      setFormData(prev => ({ ...prev, [name]: file ? `mock_url_for_${file.name}` : '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setSubmitting(true);
    setError('');

    try {
      // Generate a simple registration number
      const regNumber = `REG-${new Date().getTime().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

      const applicationData = {
        userId: user?.uid || 'anonymous',
        userName: profile?.name || user?.displayName || formData.name || 'Unknown',
        userEmail: profile?.email || user?.email || formData.email || '',
        userPhone: profile?.phone || formData.phone || '',
        userNik: profile?.nik || formData.nik || '',
        serviceId: service.id,
        serviceName: service.name,
        status: 'pending',
        data: formData,
        registrationNumber: regNumber,
        history: [{
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'Pengajuan dibuat'
        }],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'applications'), applicationData);
      
      // Simulate WhatsApp Notification
      console.log(`[SIMULATED WHATSAPP] To: ${applicationData.userPhone}, Message: Halo ${applicationData.userName}, pengajuan ${service.name} Anda berhasil diterima dengan nomor registrasi ${regNumber}. Kami akan segera memprosesnya.`);
      
      alert(`Pengajuan berhasil dikirim!\nNomor Registrasi Anda: ${regNumber}\nSimpan nomor ini untuk mengecek status pengajuan Anda.`);
      navigate('/');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'applications');
      setError('Gagal mengirim pengajuan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Memuat formulir...</div>;
  if (error || !service) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
      </Button>

      <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-b border-slate-100 px-8 py-8">
          <CardTitle className="text-3xl font-bold text-slate-800 tracking-tight">{service.name}</CardTitle>
          <CardDescription className="text-slate-600 text-base mt-2 leading-relaxed">{service.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Default User Info Fields */}
            <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">1</div>
                Data Pemohon
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input 
                    name="name"
                    defaultValue={profile?.name || user?.displayName || ''} 
                    onChange={handleChange}
                    disabled={!!user} 
                    className={`h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 ${user ? "bg-slate-100 text-slate-500" : ""}`} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    name="email"
                    type="email"
                    defaultValue={profile?.email || user?.email || ''} 
                    onChange={handleChange}
                    disabled={!!user} 
                    className={`h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 ${user ? "bg-slate-100 text-slate-500" : ""}`} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nomor WhatsApp (Aktif)</Label>
                  <Input 
                    name="phone" 
                    placeholder="Contoh: 081234567890" 
                    defaultValue={profile?.phone || ''}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Notifikasi akan dikirim ke nomor ini.</p>
                </div>
                <div className="space-y-2">
                  <Label>NIK</Label>
                  <Input 
                    name="nik" 
                    placeholder="16 Digit NIK" 
                    defaultValue={profile?.nik || ''}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Service Fields */}
            {service.fields && service.fields.length > 0 && (
              <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mt-8">
                <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">2</div>
                  Data Persyaratan
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {service.fields.map((field, idx) => (
                    <div key={idx} className="space-y-2">
                      <Label htmlFor={field.name}>
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      
                      {field.type === 'textarea' ? (
                        <Textarea 
                          id={field.name}
                          name={field.name}
                          required={field.required}
                          onChange={handleChange}
                          placeholder={`Masukkan ${field.label.toLowerCase()}`}
                          className="min-h-[120px] rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      ) : field.type === 'file' ? (
                        <div className="border-2 border-dashed border-slate-200 bg-white rounded-xl p-6 text-center hover:bg-emerald-50/50 hover:border-emerald-300 transition-colors group">
                          <Input 
                            type="file" 
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            onChange={handleChange}
                            className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                          />
                          <p className="text-xs text-slate-400 mt-3 font-medium">Format PDF/JPG/PNG maksimal 2MB</p>
                        </div>
                      ) : (
                        <Input 
                          type={field.type} 
                          id={field.name}
                          name={field.name}
                          required={field.required}
                          onChange={handleChange}
                          placeholder={`Masukkan ${field.label.toLowerCase()}`}
                          className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-8 flex justify-end">
              <Button type="submit" disabled={submitting} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6 px-10 rounded-full shadow-lg shadow-emerald-200 transition-transform hover:scale-105">
                {submitting ? 'Mengirim...' : (
                  <>
                    <Send className="w-5 h-5 mr-2" /> Kirim Pengajuan
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
