import React, { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { University } from "@/lib/types";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  location: string;
  program: string;
  tuitionRange: string;
  rating: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, onFilter }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    location: "",
    program: "",
    tuitionRange: "",
    rating: "",
  });
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<{
    locations: string[];
    programs: string[];
  }>({
    locations: ["All Locations"],
    programs: ["All Programs"],
  });

  // Fetch university data and derive filter options
  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://unicorner-back.vercel.app/universities");
        if (!response.ok) throw new Error("Failed to fetch universities");
        const result = await response.json();
        const uniData: University[] = Array.isArray(result.data) ? result.data : [];
        setUniversities(uniData);
        setFilteredUniversities(uniData);

        // Derive and sort filter options from university data
        const uniqueLocations = Array.from(
          new Set(uniData.map((u) => u.location).filter(Boolean) as string[])
        ).sort((a, b) => a.localeCompare(b));
        const uniquePrograms = Array.from(
          new Set(uniData.flatMap((u) => u.programs || []).filter(Boolean) as string[])
        )
          .sort((a, b) => a.localeCompare(b))
          .slice(0, 5); // Limit to 5 programs

        setFilterOptions({
          locations: ["All Locations", ...uniqueLocations],
          programs:
            uniquePrograms.length > 5
              ? ["All Programs", ...uniquePrograms, "Other"]
              : ["All Programs", ...uniquePrograms],
        });

        const tuitionValues = uniData
          .map((u) => parseInt(u.tuitionFees?.undergraduate?.replace(/[^0-9]/g, "") || "0", 10))
          .filter((v) => !isNaN(v));
        const tuitionRanges = ["All Ranges", ...deriveTuitionRanges(tuitionValues)];
        const ratingValues = uniData.map((u) => u.rating).filter((r) => r !== undefined);
        const ratings = ["Any Rating", ...deriveRatingRanges(ratingValues)];
      } catch (err) {
        console.error("SearchFilters - Fetch error:", err);
        setUniversities([]);
        setFilteredUniversities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  // Helper to derive tuition ranges from values
  const deriveTuitionRanges = (values: number[]): string[] => {
    if (values.length === 0) return ["$0 - $2,000", "$2,001 - $5,000", "$5,001 - $10,000", "$10,001+"];
    const max = Math.max(...values);
    const ranges = [];
    if (max <= 2000) return ["$0 - $2,000"];
    ranges.push("$0 - $2,000");
    if (max > 2000) ranges.push("$2,001 - $5,000");
    if (max > 5000) ranges.push("$5,001 - $10,000");
    if (max > 10000) ranges.push("$10,001+");
    return ranges;
  };

  // Helper to derive rating ranges from values
  const deriveRatingRanges = (values: number[]): string[] => {
    const max = Math.max(...values);
    const ranges = [];
    if (max >= 2) ranges.push("2+ Stars");
    if (max >= 3) ranges.push("3+ Stars");
    if (max >= 4) ranges.push("4+ Stars");
    return ranges;
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
    applyFilters({ ...filters }, query);
  };

  // Handle filter selection
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedFilters = {
      ...filters,
      [name]:
        value === "All Locations" || value === "All Programs" || value === "All Ranges" || value === "Any Rating"
          ? ""
          : value,
    };
    setFilters(updatedFilters);
    applyFilters(updatedFilters, searchQuery);
  };

  // Apply filters to university list and close menu
  const applyFilters = (currentFilters: FilterOptions, query: string = "") => {
    let result = [...universities];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (uni) =>
          uni.name.toLowerCase().includes(q) ||
          uni.location.toLowerCase().includes(q) ||
          (uni.programs && uni.programs.some((p) => p.toLowerCase().includes(q)))
      );
    }

    if (currentFilters.location) {
      result = result.filter((uni) => uni.location.toLowerCase() === currentFilters.location.toLowerCase());
    }

    if (currentFilters.program) {
      result = result.filter((uni) =>
        uni.programs && uni.programs.some((p) => p.toLowerCase().includes(currentFilters.program.toLowerCase()))
      );
    }

    if (currentFilters.tuitionRange) {
      result = result.filter((uni) => {
        const fee = parseInt(uni.tuitionFees?.undergraduate?.replace(/[^0-9]/g, "") || "0", 10);
        switch (currentFilters.tuitionRange) {
          case "$0 - $2,000":
            return fee <= 2000;
          case "$2,001 - $5,000":
            return fee > 2000 && fee <= 5000;
          case "$5,001 - $10,000":
            return fee > 5000 && fee <= 10000;
          case "$10,001+":
            return fee > 10000;
          default:
            return true;
        }
      });
    }

    if (currentFilters.rating) {
      const minRating = parseInt(currentFilters.rating.split("+")[0]);
      result = result.filter((uni) => uni.rating >= minRating);
    }

    setFilteredUniversities(result);
    onFilter(currentFilters);
    setShowFilters(false); // Close the filter menu after applying filters
  };

  // Clear all filters and search
  const clearFilters = () => {
    const resetFilters = { location: "", program: "", tuitionRange: "", rating: "" };
    setFilters(resetFilters);
    setSearchQuery("");
    setFilteredUniversities(universities);
    onSearch("");
    onFilter(resetFilters);
    setShowFilters(false); // Close the filter menu after clearing filters
  };

  return (
    <div className="relative mb-8">
      {/* Search Bar with Filter Button */}
      <div className="bg-gray-50 w-full shadow-soft rounded-xl py-4 flex items-center pb-0">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search universities, programs, locations..."
            className="input-field pl-10 w-full py-2"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <button
          className="ml-4 flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} className="text-gray-600 mr-2" />
          <span className="font-medium text-gray-700">Filters</span>
        </button>
      </div>

      {/* Filter Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${
          showFilters ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 p-4 border-l border-gray-200 overflow-y-auto`}
      >
        {/* Filter Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-md">Filters</h3>
          <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowFilters(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Filter Options */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select
              name="location"
              className="select-field w-full"
              value={filters.location}
              onChange={handleFilterChange}
            >
              {filterOptions.locations.map((location) => (
                <option key={location} value={location === "All Locations" ? "" : location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Program</label>
            <select
              name="program"
              className="select-field w-full"
              value={filters.program}
              onChange={handleFilterChange}
            >
              {filterOptions.programs.map((program) => (
                <option key={program} value={program === "All Programs" ? "" : program}>
                  {program}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Apply and Clear Buttons */}
        <div className="mt-4 flex space-x-2">
          <button
            className="flex-1 text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg"
            onClick={() => applyFilters(filters, searchQuery)}
          >
            Apply Filters
          </button>
          <button
            className="flex-1 text-gray-700 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Background Overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default SearchFilters;