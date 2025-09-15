'use client';

import React, { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';

const QRCodeScanner = ({ onScan, onError }) => {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
          scannerRef.current?.stop();
        },
        {
          onDecodeError: () => {
            // Ignore frequent decode errors to avoid spam
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current.start().catch(err => {
        onError(err);
      });
    }

    return () => {
      scannerRef.current?.destroy();
    };
  }, [onScan, onError]);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square rounded-xl overflow-hidden shadow-lg">
      <video ref={videoRef} className="w-full h-full object-cover" />
      <div className="absolute inset-0 border-8 border-white/50 rounded-xl pointer-events-none" />
    </div>
  );
};

export default QRCodeScanner;
