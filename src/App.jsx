import { useState, useCallback, memo } from "react";
import { Search, MapPin, Building2, Pin } from "lucide-react";

const CategoryButton = memo(({ category, isActive, onClick }) => (
  <div
    className={`p-4 rounded-xl ${isActive ? 'bg-blue-500 text-white' : 'text-white bg-gray-800'} shadow-sm hover:shadow-md transition-all cursor-pointer`}
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      <div className="p-2 rounded-lg bg-blue-900 dark:text-white">
        {category.icon}
      </div>
      <span className="font-medium">{category.label}</span>
    </div>
  </div>
));

const SearchInput = memo(({ type, activeSearch, value, onChange, onSearch, placeholder, isLoading, error }) => (
  <div className={`bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 shadow-lg transition-all duration-300 ${type === activeSearch ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-1 text-white">{type === "zip" ? "Search by PIN Code" : "Search by Area"}</h2>
      <p className="text-gray-400 text-sm">{type === "zip" ? "Find areas by PIN code" : "Find PIN codes by area name"}</p>
    </div>
    <div className="relative">
      <input
        type={type === "zip" ? "number" : "text"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border  border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <button
        onClick={onSearch}
        disabled={isLoading}
        className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Search className="w-4 h-4" />
      </button>
    </div>
    {error && (
      <div className="mt-4 p-3 bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl">
        {error}
      </div>
    )}
  </div>
));

const ModernPostalLookup = () => {
  const [zip, setZip] = useState("");
  const [area, setArea] = useState("");
  const [zipPostOffices, setZipPostOffices] = useState([]);
  const [areaPostOffices, setAreaPostOffices] = useState([]);
  const [zipError, setZipError] = useState("");
  const [areaError, setAreaError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSearch, setActiveSearch] = useState("zip");

  const handleSearch = async (type) => {
    setIsLoading(true);
    const query = type === "zip" ? zip.trim() : area.trim();
    if (!query) {
      setIsLoading(false);
      type === "zip" ? setZipError("Please enter a valid PIN code") : setAreaError("Please enter a valid area name");
      return;
    }

    try {
      const endpoint = type === "zip" ? "pincode" : "postoffice";
      const response = await fetch(`https://api.postalpincode.in/${endpoint}/${query}`);
      const data = await response.json();
      const offices = data[0]?.PostOffice;

      if (offices) {
        type === "zip" ? setZipPostOffices(offices) : setAreaPostOffices(offices);
        type === "zip" ? setZipError("") : setAreaError("");
      } else {
        type === "zip" ? setZipPostOffices([]) : setAreaPostOffices([]);
        type === "zip" ? setZipError("No results found") : setAreaError("No results found");
      }
    } catch (error) {
      type === "zip" ? setZipError("An error occurred") : setAreaError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { icon: <MapPin className="w-4 h-4" />, label: "PIN Search", type: "zip" },
    { icon: <Building2 className="w-4 h-4" />, label: "Area Search", type: "area" },
  ];

  // Clear results when switching search type
  const handleCategoryChange = (type) => {
    setActiveSearch(type);
    setZipPostOffices([]);
    setAreaPostOffices([]);
    setZipError("");
    setAreaError("");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <nav className="flex justify-between items-center mb-32">
          <div className="flex items-center space-x-2">
            <Pin className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-white">
              FindPin {" "}
              <a href="https://nouvous.com" target="_blank">
                <span className="text-xs align-super text-blue-200 font-medium hover:underline underline-offset-2">by nouvous</span>
              </a>
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <button className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">Donate Now</button>
          </div>
        </nav>


        <div className="text-center  mb-16 relative">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-500 inline-block text-transparent bg-clip-text">
            Discover Indian Zip Codes
          </h1>
          <p className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto">
            A modern platform for finding postal codes and area information,
            updated regularly for the community.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {categories.map((category, index) => (
            <CategoryButton
              key={index}
              category={category}
              isActive={activeSearch === category.type}
              onClick={() => handleCategoryChange(category.type)}
            />
          ))}
        </div>

        {/* Search Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <SearchInput
            type="zip"
            activeSearch={activeSearch}
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            onSearch={() => handleSearch("zip")}
            placeholder="Enter PIN code..."
            isLoading={isLoading}
            error={zipError}
          />
          <SearchInput
            type="area"
            activeSearch={activeSearch}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            onSearch={() => handleSearch("area")}
            placeholder="Enter area name..."
            isLoading={isLoading}
            error={areaError}
          />
        </div>

        {/* Results Section */}
        <div>
          {activeSearch === "zip" && zipPostOffices.length > 0 && (
            <ResultList title="Post Offices Found:" items={zipPostOffices} />
          )}
          {activeSearch === "area" && areaPostOffices.length > 0 && (
            <ResultList title="Post Offices Found:" items={areaPostOffices} />
          )}
        </div>
      </div>
    </div>
  );
};

const ResultList = memo(({ title, items }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4 dark:text-white">{title}</h2>
    <ul className="space-y-2">
      {items.map((office, i) => (
        <li key={i} className="bg-gray-100 text-white dark:bg-gray-700 p-3 rounded-lg">
          <div>Pin Code of Area: {office.Name}</div>
          <div>Branch Type: {office.BranchType}</div>
          <div>Delivery Status: {office.DeliveryStatus}</div>
          <div>PinCode: {office.Pincode}</div>
          <div>State: {office.State}</div>
        </li>
      ))}
    </ul>
  </div>
));

export default ModernPostalLookup;