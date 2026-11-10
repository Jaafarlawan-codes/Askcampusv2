import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Globe2, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  X,
  Sparkles,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { StudentProfile } from '../types';
import { SUPPORTED_COUNTRIES, CountryConfig, getCountryByName } from '../data/campusLocations';
import { triggerConfetti } from '../utils/helpers';

interface OnboardingModalProps {
  currentUser: StudentProfile;
  onSave: (updatedUser: StudentProfile) => void;
  onClose?: () => void;
  isInitialSetup?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  currentUser,
  onSave,
  onClose,
  isInitialSetup = false,
}) => {
  // Determine default country
  const defaultCountry = SUPPORTED_COUNTRIES.find(
    (c) => c.name.toLowerCase() === (currentUser.country || '').toLowerCase()
  ) || SUPPORTED_COUNTRIES[0]; // Nigeria or US

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(defaultCountry.code);
  const activeCountry = SUPPORTED_COUNTRIES.find((c) => c.code === selectedCountryCode) || SUPPORTED_COUNTRIES[0];

  const [selectedState, setSelectedState] = useState<string>(currentUser.state || activeCountry.states[0] || '');
  const [customState, setCustomState] = useState<string>('');
  const [isOtherState, setIsOtherState] = useState<boolean>(false);

  const [selectedSchool, setSelectedSchool] = useState<string>(currentUser.school || activeCountry.popularSchools[0] || '');
  const [customSchool, setCustomSchool] = useState<string>('');
  const [isOtherSchool, setIsOtherSchool] = useState<boolean>(false);

  const [customCurrencySymbol, setCustomCurrencySymbol] = useState<string>(activeCountry.currencySymbol);
  const [major, setMajor] = useState<string>(currentUser.major || '');
  const [graduationYear, setGraduationYear] = useState<string>(currentUser.graduationYear || '2027');

  // When country changes, reset state and school defaults
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    const country = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode) || SUPPORTED_COUNTRIES[0];
    setSelectedState(country.states[0] || '');
    setIsOtherState(false);
    setSelectedSchool(country.popularSchools[0] || '');
    setIsOtherSchool(false);
    setCustomCurrencySymbol(country.currencySymbol);
  };

  const finalState = isOtherState ? customState.trim() : selectedState;
  const finalSchool = isOtherSchool ? customSchool.trim() : selectedSchool;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalSchool || !finalState) return;

    const updatedProfile: StudentProfile = {
      ...currentUser,
      country: activeCountry.name,
      state: finalState,
      school: finalSchool,
      college: finalSchool, // maintain compatibility with college field
      currencyCode: activeCountry.currencyCode,
      currencySymbol: customCurrencySymbol || activeCountry.currencySymbol,
      major: major.trim() || 'Undergraduate',
      graduationYear: graduationYear.trim() || '2027',
    };

    triggerConfetti();
    onSave(updatedProfile);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold mb-1.5 border border-blue-200/60">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Step 2: Campus Profile Setup</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {currentUser.name ? `Welcome, ${currentUser.name.split(' ')[0]}!` : 'Select Your Campus'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set up your country, school, and course to connect with colleagues and see local prices.
            </p>
          </div>

          {!isInitialSetup && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* 1. Country Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Your Country</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUPPORTED_COUNTRIES.map((c) => {
                const isSelected = selectedCountryCode === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountryChange(c.code)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-xl shrink-0">{c.flag}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate text-slate-900">
                        {c.name}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 block">
                        {c.currencySymbol} ({c.currencyCode})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. State / Region Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>2. State or Province</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>

            {!isOtherState ? (
              <div className="space-y-2">
                <select
                  value={selectedState}
                  onChange={(e) => {
                    if (e.target.value === '__other__') {
                      setIsOtherState(true);
                      setSelectedState('');
                    } else {
                      setSelectedState(e.target.value);
                    }
                  }}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {activeCountry.states.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                  <option value="__other__">+ Enter custom state / region...</option>
                </select>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customState}
                  onChange={(e) => setCustomState(e.target.value)}
                  placeholder="Enter state, province or territory"
                  required
                  autoFocus
                  className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setIsOtherState(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
                >
                  Choose list
                </button>
              </div>
            )}
          </div>

          {/* 3. School / University Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>3. School / University (College)</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>

            {!isOtherSchool ? (
              <div className="space-y-2">
                <select
                  value={selectedSchool}
                  onChange={(e) => {
                    if (e.target.value === '__other__') {
                      setIsOtherSchool(true);
                      setSelectedSchool('');
                    } else {
                      setSelectedSchool(e.target.value);
                    }
                  }}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {activeCountry.popularSchools.map((sch) => (
                    <option key={sch} value={sch}>
                      {sch}
                    </option>
                  ))}
                  <option value="__other__">+ Type your own institution / school...</option>
                </select>

                <p className="text-[11px] text-slate-500">
                  Can't find your campus? Select <strong>+ Type your own institution</strong> to enter any school name.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSchool}
                    onChange={(e) => setCustomSchool(e.target.value)}
                    placeholder="e.g. University of Lagos, OAU, UNIBEN, Stanford..."
                    required
                    autoFocus
                    className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setIsOtherSchool(false)}
                    className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
                  >
                    Select list
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Course / Major & Graduation Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>4. Course / Major</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Computer Science, Medicine, Accounting..."
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Graduation Year</span>
              </label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {['2025', '2026', '2027', '2028', '2029', '2030', 'Alumni / Postgrad'].map((yr) => (
                  <option key={yr} value={yr}>
                    Class of {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Localized Experience Summary Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/60 border border-blue-200/80">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Your Personalized Campus Experience</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Colleagues & Peers
                </span>
                <span className="font-extrabold text-slate-900 truncate block mt-0.5">
                  {finalSchool || 'Selected School'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Marketplace Currency
                </span>
                <span className="font-extrabold text-blue-700 block mt-0.5">
                  {activeCountry.currencyName}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!finalSchool || !finalState}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Confirm & Enter My Campus</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
