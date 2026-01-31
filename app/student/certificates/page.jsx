"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { Award, Calendar, ChevronRight, Download, Eye, FileText, Search } from 'lucide-react';

const CertificateSkeleton = () => (
  <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-4 animate-pulse">
    <div className="flex justify-between items-start mb-3">
      <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
      <div className="w-16 h-5 bg-slate-200 rounded-lg"></div>
    </div>
    <div className="w-3/4 h-5 bg-slate-200 rounded-lg mb-2"></div>
    <div className="w-1/2 h-4 bg-slate-100 rounded-lg mb-4"></div>
    <div className="w-full h-8 bg-slate-200 rounded-lg"></div>
  </div>
);

const MyCertificatesPage = () => {
  const { user } = useUser();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/certificates?userId=${user.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      } finally {
        setTimeout(() => setLoading(false), 800); // Slight delay for smoother transition
      }
    };

    fetchCertificates();
  }, [user]);

  const filteredCertificates = certificates.filter(cert =>
    cert.course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-800 text-white pt-10 pb-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-100 border border-white/20">
                <Award className="w-3 h-3" />
                Your Achievements
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                My Certificates
              </h1>
              <p className="text-blue-100/80 max-w-md">
                View and download the professional certificates you have earned throughout your learning journey.
              </p>
            </div>

            <div className="relative group animate-fade-in-slow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 px-10 py-3 rounded-2xl w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 -mt-10 relative z-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <CertificateSkeleton key={i} />)}
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-12 text-center shadow-xl shadow-slate-200/50 animate-fade-in-scale">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No Certificates Found</h2>
            <p className="text-slate-500 max-w-sm mx-auto">
              {searchTerm ? `No certificates match your search for "${searchTerm}"` : "You haven't earned any certificates yet. Keep learning to achieve your goals!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate, index) => (
              <div 
                key={certificate.id} 
                className="group bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 hover:-translate-y-1.5 animate-fade-in-scale"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform duration-500">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="bg-green-50 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-green-100">
                    ISSUED
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-800 mb-1.5 leading-tight group-hover:text-blue-700 transition-colors">
                  {certificate.course.name}
                </h2>
                
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-6">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(certificate.issueDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link 
                    href={`/student/certificates/${certificate.id}`}
                    className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-sm transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Link>
                  <Link 
                    href={`/api/certificates/${certificate.id}/download`}
                    className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm shadow-md shadow-blue-200 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default MyCertificatesPage;
