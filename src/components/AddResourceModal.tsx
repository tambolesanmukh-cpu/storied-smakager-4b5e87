import React, { useState } from 'react';
import { X, PlusCircle, Building2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ResourceCategory, ResourceCondition, UserProfile } from '../types';
import { api } from '../services/api';

interface AddResourceModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  currentUser,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('EQUIPMENT');
  const [subcategory, setSubcategory] = useState('Cardiology Diagnostics');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/equipment_ecg_machine_1793367675254.jpg');
  const [location, setLocation] = useState('Central Biomedical Hub');
  const [city, setCity] = useState('Bengaluru');
  const [floorWing, setFloorWing] = useState('Depot Level 2, Bay 3');
  const [maxDays, setMaxDays] = useState(5);
  const [costPerDay, setCostPerDay] = useState(0);
  const [requiresSupervision, setRequiresSupervision] = useState(true);
  const [supervisionDetails, setSupervisionDetails] = useState('Certified Nurse or Biomedical Technician required during operation.');
  const [manufacturer, setManufacturer] = useState('GE Healthcare');
  const [modelNumber, setModelNumber] = useState('MAC 2000 Pro');
  const [serialNumber, setSerialNumber] = useState(`SN-${Date.now().toString().slice(-6)}`);
  const [calibrationExpiry, setCalibrationExpiry] = useState('2027-04-01');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createResource({
        name,
        category,
        subcategory,
        description,
        imageUrl,
        location,
        city,
        floorWing,
        maxDurationDays: Number(maxDays),
        costPerDay: Number(costPerDay),
        requiresSupervision,
        supervisionDetails,
        manufacturer,
        modelNumber,
        serialNumber,
        calibrationExpiryDate: calibrationExpiry,
        condition: 'EXCELLENT',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 my-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-[#102A43]">List Medical Resource</h2>
            <p className="text-xs text-slate-500">
              Register medical equipment or healthcare facility under institutional governance.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Resource Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Philips Ultrasound System or BSL-2 Molecular Lab"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden"
              >
                <option value="EQUIPMENT">Medical Equipment</option>
                <option value="FACILITY">Healthcare Facility / Lab</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subcategory / Specialty</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Cardiology Diagnostics, Pathology"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Clinical Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide technical capabilities, included probes, software licenses, or room setup..."
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Preset Clinical Image Choice */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Resource Photography Asset</label>
            <select
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono text-[11px]"
            >
              <option value="/src/assets/images/equipment_ecg_machine_1793367675254.jpg">
                ECG Electrocardiograph Machine (Product Photo)
              </option>
              <option value="/src/assets/images/equipment_ultrasound_1793367674396.jpg">
                Ultrasound Imaging Station (Product Photo)
              </option>
              <option value="/src/assets/images/facility_research_lab_1793367674390.jpg">
                Advanced Molecular Research Lab (Facility View)
              </option>
              <option value="/src/assets/images/medishare_hero_network_1793367674101.jpg">
                Hospital Telemetry & ICU Depot Hub
              </option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Location / Wing</label>
              <input
                type="text"
                value={floorWing}
                onChange={(e) => setFloorWing(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Max Duration (Days)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={maxDays}
                onChange={(e) => setMaxDays(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Cost / Day (₹0 = Free)</label>
              <input
                type="number"
                min={0}
                value={costPerDay}
                onChange={(e) => setCostPerDay(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md tabular-nums"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Serial Number</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Calibration Expiry</label>
              <input
                type="date"
                value={calibrationExpiry}
                onChange={(e) => setCalibrationExpiry(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresSupervision}
                onChange={(e) => setRequiresSupervision(e.target.checked)}
                className="rounded-sm text-teal-600 focus:ring-teal-500"
              />
              <span>Mandate on-site clinical or technical supervision</span>
            </label>

            {requiresSupervision && (
              <input
                type="text"
                value={supervisionDetails}
                onChange={(e) => setSupervisionDetails(e.target.value)}
                placeholder="Specify credential requirements (e.g. Registered Sonologist or BSL-2 trained officer)"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs"
              />
            )}
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-md shadow-xs"
            >
              {submitting ? 'Registering Resource...' : 'Register Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
