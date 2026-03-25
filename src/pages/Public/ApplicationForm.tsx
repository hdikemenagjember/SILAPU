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

      <Card className="border-orange-100 shadow-md">
        <CardHeader className="bg-orange-50 border-b border-orange-100 rounded-t-xl">
          <CardTitle className="text-2xl text-orange-900">{service.name}</CardTitle>
          <CardDescription className="text-orange-700 text-base mt-2">{service.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Default User Info Fields */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-700 border-b pb-2">Data Pemohon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input 
                    name="name"
                    defaultValue={profile?.name || user?.displayName || ''} 
                    onChange={handleChange}
                    disabled={!!user} 
                    className={user ? "bg-gray-100" : ""} 
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
                    className={user ? "bg-gray-100" : ""} 
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
                    required 
                  />
                  <p className="text-xs text-gray-500">Notifikasi akan dikirim ke nomor ini.</p>
                </div>
                <div className="space-y-2">
                  <Label>NIK</Label>
                  <Input 
                    name="nik" 
                    placeholder="16 Digit NIK" 
                    defaultValue={profile?.nik || ''}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Service Fields */}
            {service.fields && service.fields.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Data Persyaratan</h3>
                <div className="grid grid-cols-1 gap-4">
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
                        />
                      ) : field.type === 'file' ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:bg-gray-50 transition-colors">
                          <Input 
                            type="file" 
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            onChange={handleChange}
                            className="cursor-pointer"
                          />
                          <p className="text-xs text-gray-500 mt-2">Format PDF/JPG/PNG maksimal 2MB</p>
                        </div>
                      ) : (
                        <Input 
                          type={field.type} 
                          id={field.name}
                          name={field.name}
                          required={field.required}
                          onChange={handleChange}
                          placeholder={`Masukkan ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t flex justify-end">
              <Button type="submit" disabled={submitting} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-lg py-6 px-8">
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
