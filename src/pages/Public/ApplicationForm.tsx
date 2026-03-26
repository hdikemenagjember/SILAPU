import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Send, Lock } from 'lucide-react';

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
  const [step, setStep] = useState(1);
  const totalSteps = service?.fields && service.fields.length > 0 ? 2 : 1;

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
    if (!service || !user) return;

    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Generate a simple registration number
      const regNumber = `REG-${new Date().getTime().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

      const applicationData = {
        userId: user.uid,
        userName: profile?.name || user.displayName || formData.name || 'Unknown',
        userEmail: profile?.email || user.email || formData.email || '',
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
      navigate('/dashboard');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'applications');
      setError('Gagal mengirim pengajuan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Memuat formulir...</div>;
  if (error || !service) return <div className="text-center py-12 text-red-600">{error}</div>;

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Button>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#1e6b4d]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Login Diperlukan</h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Untuk mengajukan layanan <strong>{service.name}</strong> dan melacak statusnya nanti, Anda diharuskan login menggunakan akun Google.
          </p>
          <Button asChild className="bg-[#1e6b4d] hover:bg-[#15523a] text-white rounded-full px-8 h-12">
            <Link to="/login">Masuk dengan Google</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
      </Button>

      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 px-8 py-6">
          <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">{service.name}</CardTitle>
          <CardDescription className="text-slate-600 text-sm mt-2 leading-relaxed">{service.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {/* Progress */}
          {totalSteps > 1 && (
            <div className="flex gap-2 mb-8">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? "bg-[#1e6b4d]" : "bg-slate-100"}`} />
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Default User Info Fields */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="font-semibold text-slate-900 text-lg border-b border-slate-100 pb-2">
                  1. Data Pemohon
                </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700">Nama Lengkap</Label>
                  <Input 
                    name="name"
                    defaultValue={profile?.name || user?.displayName || ''} 
                    onChange={handleChange}
                    disabled={!!user} 
                    className={`h-11 rounded-lg border-slate-200 focus:border-[#1e6b4d] focus:ring-[#1e6b4d] ${user ? "bg-slate-50 text-slate-500" : ""}`} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Email</Label>
                  <Input 
                    name="email"
                    type="email"
                    defaultValue={profile?.email || user?.email || ''} 
                    onChange={handleChange}
                    disabled={!!user} 
                    className={`h-11 rounded-lg border-slate-200 focus:border-[#1e6b4d] focus:ring-[#1e6b4d] ${user ? "bg-slate-50 text-slate-500" : ""}`} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Nomor WhatsApp (Aktif)</Label>
                  <Input 
                    name="phone" 
                    placeholder="Contoh: 081234567890" 
                    defaultValue={profile?.phone || ''}
                    onChange={handleChange}
                    className="h-11 rounded-lg border-slate-200 focus:border-[#1e6b4d] focus:ring-[#1e6b4d]"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Notifikasi akan dikirim ke nomor ini.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">NIK</Label>
                  <Input 
                    name="nik" 
                    placeholder="16 Digit NIK" 
                    defaultValue={profile?.nik || ''}
                    onChange={handleChange}
                    className="h-11 rounded-lg border-slate-200 focus:border-[#1e6b4d] focus:ring-[#1e6b4d]"
                    required
                  />
                </div>
              </div>
            </div>
            )}

            {/* Dynamic Service Fields */}
            {step === 2 && service.fields && service.fields.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-semibold text-slate-900 text-lg border-b border-slate-100 pb-2">
                  2. Data Persyaratan
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {service.fields.map((field, idx) => (
                    <div key={idx} className="space-y-2">
                      <Label htmlFor={field.name} className="text-slate-700">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      
                      {field.type === 'textarea' ? (
                        <Textarea 
                          id={field.name}
                          name={field.name}
                          required={field.required}
                          onChange={handleChange}
                          placeholder={`Masukkan ${field.label.toLowerCase()}`}
                          className="min-h-[120px] rounded-lg border-slate-200 focus:border-[#1e6b4d] focus:ring-[#1e6b4d]"
                        />
                      ) : field.type === 'file' ? (
                        <div className="border border-dashed border-slate-300 bg-slate-50 rounded-lg p-6 text-center hover:bg-slate-100 transition-colors">
                          <Input 
                            type="file" 
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            onChange={handleChange}
                            className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white file:text-slate-700 file:border file:border-slate-200 hover:file:bg-slate-50"
                          />
                          <p className="text-xs text-slate-500 mt-3">Format PDF/JPG/PNG maksimal 2MB</p>
                        </div>
                      ) : (
                        <Input 
                          type={field.type} 
                          id={field.name}
                          name={field.name}
                          required={field.required}
                          onChange={handleChange}
                          placeholder={`Masukkan ${field.label.toLowerCase()}`}
                          className="h-11 rounded-lg border-slate-200 focus:border-[#1e6b4d] focus:ring-[#1e6b4d]"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 flex gap-4 justify-end">
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(step - 1)}
                  className="w-full sm:w-auto text-base py-5 px-8 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Kembali
                </Button>
              )}
              <Button type="submit" disabled={submitting} className="w-full sm:w-auto bg-[#1e6b4d] hover:bg-[#15523a] text-white text-base py-5 px-8 rounded-lg">
                {submitting ? 'Mengirim...' : step < totalSteps ? 'Lanjutkan' : (
                  <>
                    <Send className="w-4 h-4 mr-2" /> Kirim Pengajuan
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
