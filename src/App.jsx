import { useState } from "react";
import { Search, MapPin, Building2, Mail, Moon, Sun, Pin } from "lucide-react";

const ModernPostalLookup = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [zip, setZip] = useState("");
  const [area, setArea] = useState("");
  const [zipPostOffices, setZipPostOffices] = useState([]);
  const [areaPostOffices, setAreaPostOffices] = useState([]);
  const [zipError, setZipError] = useState("");
  const [areaError, setAreaError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSearch, setActiveSearch] = useState("zip");
  const [country, setCountry] = useState("");

  const handleSearch = async (type) => {
    setIsLoading(true);
    try {
      const query = type === "zip" ? zip : area;
      const endpoint = type === "zip" ? "pincode" : "postoffice";
      const response = await fetch(
        `https://api.postalpincode.in/${endpoint}/${query}`
      );
      const data = await response.json();
      const offices = data[0]?.PostOffice;

      console.log(offices)
      if (offices) {
        if (type === "zip") {
          setZipPostOffices(offices);
          setZipError("");
        } else {
          setAreaPostOffices(offices);
          setAreaError("");
        }
      } else {
        if (type === "zip") {
          setZipPostOffices([]);
          setZipError("No results found");
        } else {
          setAreaPostOffices([]);
          setAreaError("No results found");
        }
      }
    } catch (error) {
      if (type === "zip") {
        setZipError("An error occurred");
      } else {
        setAreaError("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { icon: <MapPin className="w-4 h-4" />, label: "PIN Search", type: "zip" },
    { icon: <Building2 className="w-4 h-4" />, label: "Area Search", type: "area" },
  ];

  const handleCategoryClick = (type) => {
    setActiveSearch(type);
    setZipPostOffices([]);
    setAreaPostOffices([]);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-slate-100'}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Pin className="w-6 h-6 text-blue-600" />
            <span className="text-xl text-black font-bold dark:text-white">FindPin  <a href="https://nouvous.com" target="_blank"><span className="text-xs align-super text-blue-200 font-medium hover:underline underline-offset-2">by nouvous</span></a> </span>
          </div>
          <div className="flex items-center space-x-6">
            <button className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 inline-block text-transparent bg-clip-text">
            Discover Postal / Zip Codes
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xl mb-8 max-w-2xl mx-auto">
            A modern platform for finding postal codes and area information,
            updated regularly for the community.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl ${activeSearch === category.type ? 'bg-blue-500 text-white' : 'text-white bg-gray-800'} shadow-sm hover:shadow-md transition-all cursor-pointer`}
              onClick={() => {
                category.type && handleCategoryClick(category.type)
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 dark:text-white">
                  {category.icon}
                </div>
                <span className="font-medium">{category.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Country Select */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2 dark:text-white">Select Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Choose a country...</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="IN">India</option>
          </select>
        </div>

        {/* Search Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* PIN Code Search */}
          <div className={`bg-white/80 bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 shadow-lg transition-all duration-300 ${activeSearch === "zip" ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-1 text-white">Search by PIN Code</h2>
              <p className="text-gray-500 text-gray-400 text-sm">Find areas by PIN code</p>
            </div>
            <div className="relative">
              <input
                type="number"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Enter PIN code..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={() => handleSearch('zip')}
                disabled={isLoading}
                className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            {zipError && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl">
                {zipError}
              </div>
            )}
          </div>

          {/* Area Search */}
          <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 shadow-lg transition-all duration-300 ${activeSearch === "area" ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-1 dark:text-white">Search by Area</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Find PIN codes by area name</p>
            </div>
            <div className="relative">
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Enter area name..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={() => handleSearch('area')}
                disabled={isLoading}
                className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            {areaError && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl">
                {areaError}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div>
          {activeSearch === "zip" && zipPostOffices.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Post Offices Found:</h2>
              <ul className="space-y-2">
                {zipPostOffices.map((office,i) => (
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
          )}

          {activeSearch === "area" && areaPostOffices.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Post Offices Found:</h2>
              <ul className="space-y-2">
                {areaPostOffices.map((office,i) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernPostalLookup;