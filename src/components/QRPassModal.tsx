import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, ShieldCheck, QrCode, Building2, Calendar, UserCheck, AlertTriangle } from 'lucide-react';
import { Booking } from '../types';

interface QRPassModalProps {
  booking: Booking | null;
  onClose: () => void;
  onOpenScannerForThis: (booking: Booking) => void;
}

export const QRPassModal: React.FC<QRPassModalProps> = ({
  booking,
  onClose,
  onOpenScannerForThis,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!booking || !booking.qrToken || !canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      booking.qrToken,
      {
        width: 220,
        margin: 2,
        color: {
          dark: '#102A43',
          light: '#FFFFFF',
        },
      },
      (error) => {
        if (error) console.error('Error rendering QR Code:', error);
      }
    );
  }, [booking]);

  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#102A43] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm tracking-wide">Authorized Handover QR Pass</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Body */}
        <div className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-white border-2 border-slate-200 rounded-xl shadow-xs inline-block">
              <canvas ref={canvasRef} className="rounded" />
            </div>
          </div>

          <div>
            <div className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-md inline-block border border-teal-200 tracking-wider">
              {booking.qrToken || 'TOKEN-ACTIVE-VERIFIED'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Single-use Cryptographic Token</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
            <div>
              <span className="text-slate-400 block text-[10px]">Resource</span>
              <strong className="text-slate-900 font-bold">{booking.resourceName}</strong>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px]">Seeker Institution</span>
                <span className="text-slate-800 font-medium">{booking.seekerInstitutionName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Authorized Doctor</span>
                <span className="text-slate-800 font-medium">{booking.assignedPhysicianName}</span>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-200">
              <span className="text-slate-400 block text-[10px]">Reserved Schedule</span>
              <span className="tabular-nums text-slate-800 font-semibold">
                {booking.startDate} to {booking.endDate} ({booking.durationDays} Days)
              </span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-800 text-left flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Present this QR Pass to the Biomedical Safety Officer at Apollo Hospital depot for physical baseline verification and check-in release.
            </span>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenScannerForThis(booking);
              }}
              className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
            >
              Simulate Manager Scan
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
