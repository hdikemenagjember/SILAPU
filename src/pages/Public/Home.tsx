import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { MessageCircle, FileText, CheckCircle, Smartphone } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), where('isActive', '==', true));
        const querySnapshot = await getDocs(q);
        const fetchedServices = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        setServices(fetchedServices);
      } catch (error) {
        console.error("Error fetching services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12 bg-orange-50 rounded-3xl px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-orange-900 tracking-tight">
          Layanan Publik Terpadu <br className="hidden md:block" />
          Bersinar
        </h1>
        <p className="text-lg text-orange-700 max-w-2xl mx-auto">
          Ajukan layanan administrasi dengan mudah melalui WhatsApp dan Website tanpa perlu datang ke kantor.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg" onClick={() => {
            document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Mulai Pengajuan
          </Button>
          <Button size="lg" variant="outline" className="text-orange-700 border-orange-600 hover:bg-orange-50 text-lg" asChild>
            <a href="https://wa.me/628113656262?text=Halo%20Bersinar,%20saya%20ingin%20mengajukan%20layanan" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              Hubungi via WhatsApp
            </a>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Cara Pengajuan Layanan</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
              <MessageCircle size={32} />
            </div>
            <h3 className="font-semibold text-lg">1. Chat WhatsApp</h3>
            <p className="text-gray-600 text-sm">Kirim pesan ke nomor resmi kami untuk mendapatkan link layanan.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
              <FileText size={32} />
            </div>
            <h3 className="font-semibold text-lg">2. Isi Formulir</h3>
            <p className="text-gray-600 text-sm">Isi data diri dan unggah persyaratan melalui website ini.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
              <CheckCircle size={32} />
            </div>
            <h3 className="font-semibold text-lg">3. Verifikasi & TTE</h3>
            <p className="text-gray-600 text-sm">Petugas memverifikasi dan Pimpinan menandatangani secara elektronik.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
              <Smartphone size={32} />
            </div>
            <h3 className="font-semibold text-lg">4. Terima Dokumen</h3>
            <p className="text-gray-600 text-sm">Dokumen hasil akan dikirimkan langsung ke WhatsApp Anda.</p>
          </div>
        </div>
      </section>

      {/* Available Services */}
      <section id="services-section" className="py-8">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Daftar Layanan Tersedia</h2>
        {loading ? (
          <div className="text-center py-10">Memuat layanan...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Belum ada layanan yang tersedia saat ini.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow border-orange-100">
                <CardHeader>
                  <CardTitle className="text-orange-800">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => navigate(`/apply/${service.id}`)}>
                    Ajukan Sekarang
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
