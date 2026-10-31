import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  PlusCircle,
  Tag,
  Stethoscope,
  Microscope,
  Info,
} from 'lucide-react';
import { Resource, UserProfile } from '../types';

interface MarketplaceProps {
  resources: Resource[];
  currentUser: UserProfile;
  onSelectResource: (resource: Resource) => void;
  onBookResource: (resource: Resource) => void;
  onOpenAddResource: () => void;
  onOpenMediMatch: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  resources,
  currentUser,
  onSelectResource,
  onBookResource,
  onOpenAddResource,
  onOpenMediMatch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'EQUIPMENT' | 'FACILITY'>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [freeOnly, setFreeOnly] = useState<boolean>(false);

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // Search
      const matchesSearch =
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.ownerInstitutionName.toLowerCase().includes(searchTerm.toLowerCase());

      // Category
      const matchesCategory = categoryFilter === 'ALL' || res.category === categoryFilter;

      // City
      const matchesCity = cityFilter === 'ALL' || res.city.toLowerCase() === cityFilter.toLowerCase();

      // Availability
      const matchesAvail = !availableOnly || (res.available && !res.isMaintenanceBlocked);

      // Free sharing
      const matchesFree = !freeOnly || res.isFreeSharing;

      return matchesSearch && matchesCategory && matchesCity && matchesAvail && matchesFree;
    });
  }, [resources, searchTerm, categoryFilter, cityFilter, availableOnly, freeOnly]);

  const cities = Array.from(new Set(resources.map((r) => r.city)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">Healthcare Resource Exchange</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified institutional medical equipment and diagnostic research facilities available for sharing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenMediMatch}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            MediMatch AI Search
          </button>

          {(currentUser.role === 'RESOURCE_OWNER' || currentUser.role === 'PLATFORM_ADMIN') && (
            <button
              onClick={onOpenAddResource}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
              List New Resource
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by equipment name, specialty (e.g. ECG, Ultrasound), institution or keyword..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* City selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">All Locations</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Badges & Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Segmented Category Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                categoryFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types ({resources.length})
            </button>
            <button
              onClick={() => setCategoryFilter('EQUIPMENT')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                categoryFilter === 'EQUIPMENT'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Medical Equipment
            </button>
            <button
              onClick={() => setCategoryFilter('FACILITY')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                categoryFilter === 'FACILITY'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Facilities & Labs
            </button>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-4 text-slate-600">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded-sm text-teal-600 focus:ring-teal-500"
              />
              <span>Available only</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                className="rounded-sm text-teal-600 focus:ring-teal-500"
              />
              <span>Free sharing only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Grid of Resources */}
      {filteredResources.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <Info className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No resources match your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, changing the location, or unchecking filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('ALL');
              setCityFilter('ALL');
              setAvailableOnly(false);
              setFreeOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-md transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const isBlocked = res.isMaintenanceBlocked || !res.available;
            return (
              <div
                key={res.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={res.imageUrl}
                      alt={res.name}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />

                    {/* Category unboxed tag */}
                    <div className="absolute top-3 left-3 bg-[#102A43]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                      {res.category}
                    </div>

                    {/* Cost / Free badge */}
                    <div className="absolute top-3 right-3">
                      {res.isFreeSharing ? (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                          Free Sharing
                        </span>
                      ) : (
                        <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                          ₹{res.costPerDay}/day
                        </span>
                      )}
                    </div>

                    {/* Status overlay if blocked */}
                    {isBlocked && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 text-center">
                        <div className="bg-white/95 text-red-800 text-xs font-semibold p-2.5 rounded-md shadow-lg border border-red-200 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                          <span>Currently Reserved / Safety Review</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="text-[11px] font-semibold text-teal-700 tracking-wide uppercase">
                        {res.subcategory}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug mt-0.5">
                        {res.name}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>

                    {/* Key metadata list */}
                    <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700 truncate">{res.ownerInstitutionName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{res.location}, {res.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-slate-600">
                          Calibration valid: <strong className="tabular-nums text-slate-800">{res.calibrationExpiryDate}</strong>
                        </span>
                      </div>
                      {res.requiresSupervision && (
                        <div className="text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Mandatory clinical supervisor required</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectResource(res)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors"
                  >
                    View Specs
                  </button>

                  <button
                    onClick={() => onBookResource(res)}
                    disabled={isBlocked}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1 ${
                      isBlocked
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                    }`}
                  >
                    Request Booking
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
