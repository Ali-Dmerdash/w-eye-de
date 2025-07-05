"use client"
import { useState } from "react"
import { createPortal } from "react-dom"
import { useGetMarketDataQuery } from "@/state/api"
import type { MarketModelResponse, PricingComparison as PCType, CompetitivePositioning as CPType } from "@/state/type"
import { Globe, Building2, X, ExternalLink, BarChart3, Maximize2, MapPin } from "lucide-react"
import mapImage from "@/assets/map.jpg"
import { useUser } from "@clerk/nextjs"
import { AlertTriangle } from "lucide-react"

// Helper function to get a safe error message string
function getErrorMessage(error: unknown): string {
  if (!error) {
    return "An unknown error occurred"
  }
  if (typeof error === "object" && error !== null) {
    if ("status" in error) {
      let details = ""
      if (
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
      ) {
        details = error.data.message
      } else if ("error" in error && typeof error.error === "string") {
        details = error.error
      }
      return `Error ${error.status}${details ? ": " + details : ""}`
    }
    if ("message" in error && typeof error.message === "string") {
      return error.message
    }
  }
  try {
    return String(error)
  } catch {
    return "An unknown error occurred"
  }
}

// Professional competitor positions with accurate percentage coordinates for your world map image
const competitorPositions: {
  [key: string]: {
    x: string
    y: string
    fullscreenX?: string
    fullscreenY?: string
    region: string
    country: string
    city: string
  }
} = {
  APPLE: { x: "25%", y: "43%", fullscreenX: "25%", fullscreenY: "37%", region: "North America", country: "United States", city: "Cupertino" },
  XIAOMI: { x: "82%", y: "49%", fullscreenX: "82%", fullscreenY: "38%", region: "Asia Pacific", country: "China", city: "Beijing" },
  SAMSUNG: { x: "72%", y: "55%", fullscreenX: "72%", fullscreenY: "44%", region: "Asia Pacific", country: "South Korea", city: "Seoul" },
}

export default function MarketMap() {
  const { data: marketDataArray, isLoading, error: queryError } = useGetMarketDataQuery()
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { user, isLoaded } = useUser();
  const filesUploaded = user?.unsafeMetadata?.filesUploaded;

  const marketData: MarketModelResponse | undefined = marketDataArray?.[0]
  const pricingData: PCType | undefined | null = marketData?.pricing_comparison
  const competitiveData: CPType | undefined | null = marketData?.competitive_positioning

  const pricing: Record<string, string> | undefined = pricingData?.competitors
  const scores: Record<string, (string | number)[]> | undefined = competitiveData?.scores

  const competitors = [...new Set([...(pricing ? Object.keys(pricing) : []), ...(scores ? Object.keys(scores) : [])])]

  const locations = competitors
    .map((name) => name.toUpperCase())
    .filter((name) => competitorPositions[name])
    .map((name) => ({
      name,
      ...competitorPositions[name],
      data: {
        price: pricing?.[name] || pricing?.[name.toLowerCase()] || "N/A",
        scores: scores?.[name] || scores?.[name.toLowerCase()] || [],
      },
    }))

  const selectedData = selectedLocation ? locations.find((loc) => loc.name === selectedLocation)?.data : null
  const selectedLocationData = selectedLocation ? competitorPositions[selectedLocation] : null

  if (isLoaded && filesUploaded === false) {
    return (
      <div className="bg-white h-full dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center min-h-[200px]">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
        <span className="text-gray-500 dark:text-gray-400 text-center font-medium">
          No data to display — file upload was bypassed.
        </span>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading market data...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (queryError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 h-full flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">Error: {getErrorMessage(queryError)}</p>
        </div>
      </div>
    )
  }

  const containerClass = isFullscreen
    ? "fixed inset-0 z-[60] bg-white dark:bg-gray-800"
    : "bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 h-full"

  const renderContent = () => (
    <div className={`${containerClass} flex flex-col`}>
      {/* Header */}
      <div className="p-6 border-b border-purple-100 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Global Market Presence</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Interactive competitor distribution map</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="hidden md:inline">{locations.length} competitors</span>
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded text-xs font-medium">
                Q4 2024
              </span>
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isFullscreen ? <X className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-grow relative overflow-hidden">

        <div className="absolute inset-0">
          <img
            src={mapImage.src}
            alt="World Map"
            className="w-[6000px] object-fill"

          />
          {/* Overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-indigo-900/10"></div>
        </div>

        {/* Competitor Markers */}
        <div className="absolute inset-0">
          {locations.map((location) => {
            const isHovered = hoveredLocation === location.name
            const isSelected = selectedLocation === location.name

            return (
              <div
                key={location.name}
                className="absolute z-10 cursor-pointer transition-all duration-300"
                                      style={{
                        top: isFullscreen ? (competitorPositions[location.name]?.fullscreenY || location.y) : location.y,
                        left: isFullscreen ? (competitorPositions[location.name]?.fullscreenX || location.x) : location.x,
                        transform: "translate(-50%, -50%)",
                      }}
                onClick={() => setSelectedLocation(location.name)}
                onMouseEnter={() => setHoveredLocation(location.name)}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                {/* Pulse Animation for Active States */}
                {(isHovered || isSelected) && (
                  <div className="absolute inset-0 animate-ping">
                    <div className="w-8 h-8 bg-purple-400 rounded-full opacity-20"></div>
                  </div>
                )}

                {/* Outer Ring for Enhanced Visibility */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${isSelected
                      ? "w-8 h-8 bg-yellow-400 opacity-30"
                      : isHovered
                        ? "w-7 h-7 bg-purple-400 opacity-25"
                        : "w-0 h-0"
                    }`}
                  style={{ transform: "translate(-50%, -50%)", left: "50%", top: "50%" }}
                ></div>

                {/* Main Marker */}
                <div
                  className={`relative rounded-full transition-all duration-300 shadow-lg border-2 border-white dark:border-gray-800 ${isSelected
                      ? "w-5 h-5 bg-yellow-500 ring-2 ring-yellow-300 dark:ring-yellow-700"
                      : isHovered
                        ? "w-5 h-5 bg-purple-500 ring-2 ring-purple-300 dark:ring-purple-700 scale-110"
                        : "w-4 h-4 bg-purple-600 hover:bg-purple-500"
                    }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Company Label on Hover */}
                {isHovered && !isSelected && (
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-20">
                    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm font-medium shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                      <div className="font-semibold">
                        {location.name.charAt(0) + location.name.slice(1).toLowerCase()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {location.city}, {location.country}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        

        {/* Hover Tooltip */}
        {hoveredLocation && !selectedLocation && (
                     <div className={`absolute ${!isFullscreen && parseInt(competitorPositions[hoveredLocation]?.x || "0") < 52 ? "right-4" : "left-4"} top-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px] z-30`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {hoveredLocation.charAt(0) + hoveredLocation.slice(1).toLowerCase()}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {competitorPositions[hoveredLocation]?.city}, {competitorPositions[hoveredLocation]?.country}
                </p>
              </div>
            </div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Region:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {competitorPositions[hoveredLocation]?.region}
                </span>
              </div>
              {locations.find((loc) => loc.name === hoveredLocation)?.data && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Price:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      $
                      {locations.find((loc) => loc.name === hoveredLocation)?.data.price?.match(/\d+(\.\d+)?/)?.[0] ??
                        "N/A"}
                    </span>
                  </div>
                  {locations.find((loc) => loc.name === hoveredLocation)?.data.scores?.length > 1 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Market Share:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {locations.find((loc) => loc.name === hoveredLocation)?.data.scores[1]}
                      </span>
                    </div>
                  )}
                </>
              )}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Click for detailed analysis
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Regional Statistics */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Regional Distribution
            </h3>
            <div className="space-y-3 text-xs">
              {["North America", "Europe", "Asia Pacific"].map((region) => {
                const count = locations.filter((loc) => loc.region === region).length
                const percentage = Math.round((count / locations.length) * 100)
                return (
                  <div key={region} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">{region}:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        {isFullscreen && (
          <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Legend</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full border border-white"></div>
                <span className="text-gray-600 dark:text-gray-300">Competitor Location</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full ring-1 ring-purple-300"></div>
                <span className="text-gray-600 dark:text-gray-300">Hovered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full ring-1 ring-yellow-300"></div>
                <span className="text-gray-600 dark:text-gray-300">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-purple-400 opacity-50" style={{ borderStyle: "dashed" }}></div>
                <span className="text-gray-600 dark:text-gray-300">Regional Connections</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Professional Modal for Detailed Analysis */}
      {selectedLocation && selectedData && selectedLocationData && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[600] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-purple-100 dark:border-gray-700 w-full max-w-lg relative overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedLocation.charAt(0) + selectedLocation.slice(1).toLowerCase()}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedLocationData.city}, {selectedLocationData.country} • {selectedLocationData.region}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30">
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Price Point</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    ${selectedData.price?.match(/\d+(\.\d+)?/)?.[0] ?? "N/A"}
                  </div>
                </div>
                {selectedData.scores?.length > 1 && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Market Share</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{selectedData.scores[1]}</div>
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Performance Metrics</h4>

                {selectedData.scores?.length > 2 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Customer Satisfaction</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedData.scores[2]}
                      </span>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 w-full h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${typeof selectedData.scores[2] === "string"
                              ? Number.parseInt(selectedData.scores[2]) || 50
                              : selectedData.scores[2] || 50
                            }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {selectedData.scores?.length > 3 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Innovation Index</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedData.scores[3]}
                      </span>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 w-full h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${typeof selectedData.scores[3] === "string"
                              ? Number.parseInt(selectedData.scores[3]) || 50
                              : selectedData.scores[3] || 50
                            }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <BarChart3 className="w-4 h-4" />
                    <span>Competitive Intelligence</span>
                  </div>
                  <button className="flex items-center gap-2 text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <span>View Full Analysis</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Professional Controls */}
      <div className="p-4 border-t border-purple-100 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-gray-500 dark:text-gray-400">🖱️ Click markers for details • 🔍 Hover to preview</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 dark:text-gray-400">Professional World Map</span>
            <span className="text-gray-500 dark:text-gray-400">Last updated: Q4 2024</span>
          </div>
        </div>
      </div>
    </div>
  )

  return isFullscreen && typeof document !== 'undefined'
    ? createPortal(renderContent(), document.body)
    : renderContent()
}
