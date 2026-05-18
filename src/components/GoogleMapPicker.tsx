"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, X, Navigation, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import spotsData from "@/data/spots.json";

interface GoogleMapPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (locationName: string) => void;
}

export function GoogleMapPicker({ open, onClose, onSelect }: GoogleMapPickerProps) {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  const filteredSpots = useMemo(() => {
    if (!searchQuery.trim()) return spotsData.slice(0, 5);
    return (spotsData as any[]).filter(
      (spot) =>
        Object.values(spot.name).some((v: any) =>
          v.toLowerCase().includes(searchQuery.toLowerCase()),
        ) ||
        Object.values(spot.region).some((v: any) =>
          v.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
  }, [searchQuery]);

  const selectedSpot = useMemo(
    () => spotsData.find((s) => s.id === selectedSpotId) || spotsData[0],
    [selectedSpotId],
  );

  const lang = (i18n.language || "ko") as any;
  const selectedName = (selectedSpot as any).name[lang] ?? (selectedSpot as any).name.ko;
  const selectedAddr = (selectedSpot as any).address[lang] ?? (selectedSpot as any).address.ko;

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${encodeURIComponent(selectedName + " " + selectedAddr)}&zoom=15`;

  // Note: Since we don't have a real API key for the iframe, we'll use a more general embed or a mock UI
  const mockMapUrl = `https://maps.google.com/maps?q=${selectedSpot.coords.lat},${selectedSpot.coords.lng}&z=15&output=embed`;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl gap-0 bg-white border-none shadow-2xl h-[80vh]">
        <DialogHeader className="px-4 py-3 border-b border-gray-100 flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/39/Google_Maps_icon_%282020%29.svg"
              className="h-5 w-5"
              alt="Google Maps"
            />
            {t("community.modal.mapTitle")}
          </DialogTitle>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </DialogHeader>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Left: Search & List */}
          <div className="w-full md:w-[350px] border-r border-gray-100 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("community.modal.mapPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredSpots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setSelectedSpotId(spot.id)}
                  className={`w-full p-4 flex items-start gap-3 border-b border-gray-50 transition-colors hover:bg-blue-50/50 ${
                    selectedSpotId === spot.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="mt-0.5 p-2 bg-gray-100 rounded-full text-gray-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-bold text-gray-900">
                      {(spot as any).name[lang] ?? (spot as any).name.ko}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5">
                      {(spot as any).address[lang] ?? (spot as any).address.ko}
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold mt-1 uppercase tracking-wider">
                      {(spot as any).region[lang] ?? (spot as any).region.ko}
                    </span>
                  </div>
                  {selectedSpotId === spot.id && (
                    <Check className="ml-auto h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 bg-gray-50 mt-auto">
              <Button
                onClick={() => {
                  onSelect(selectedName);
                  onClose();
                }}
                disabled={!selectedSpotId}
                className="w-full bg-[#4285F4] hover:bg-[#357ae8] text-white rounded-xl font-bold h-11"
              >
                {t("community.modal.mapConfirm")}
              </Button>
            </div>
          </div>

          {/* Right: Map View */}
          <div className="flex-1 bg-gray-100 relative">
            <iframe
              title="Google Map Picker"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={mockMapUrl}
              allowFullScreen
            ></iframe>

            {/* Center Marker Overlay (Visual Only) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none drop-shadow-xl animate-bounce">
              <div className="relative">
                <MapPin className="h-10 w-10 text-red-600 fill-red-600" />
                <div className="absolute top-0 left-0 h-10 w-10 flex items-center justify-center">
                  <div className="h-3 w-3 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
