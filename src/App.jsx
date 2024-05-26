import { useState } from "react";
import axios from "axios";

function App() {
  const [zip, setZip] = useState("");
  const [area, setArea] = useState("");
  const [zipPostOffices, setZipPostOffices] = useState([]);
  const [areaPostOffices, setAreaPostOffices] = useState([]);
  const [zipError, setZipError] = useState("");
  const [areaError, setAreaError] = useState("");

  const handleZip = (e) => {
    setZip(e.target.value);
  };

  const handleArea = (e) => {
    setArea(e.target.value);
  };

  const handleSearchZip = async () => {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${zip}`
      );
      let blocks = response.data[0].PostOffice;
      if (blocks) {
        setZipPostOffices(blocks);
        setZipError(""); // Clear error if data is found
      } else {
        setZipPostOffices([]);
        setZipError("Pincode does not exist.");
      }
    } catch (error) {
      setZipPostOffices([]);
      setZipError("Pincode does not exist.");
    }
  };

  const handleSearchArea = async () => {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/postoffice/${area}`
      );
      let blocks = response.data[0].PostOffice;
      if (blocks) {
        setAreaPostOffices(blocks);
        setAreaError(""); // Clear error if data is found
      } else {
        setAreaPostOffices([]);
        setAreaError("Area does not exist.");
      }
    } catch (error) {
      setAreaPostOffices([]);
      setAreaError("Area does not exist.");
    }
  };

  return (
    <>
      <div className=" min-h-screen lg:h-screen p-10 ">
        <div className="mb-28 lg:mb-8">
          {" "}
          <h1 className="text-center mb-2 text-6xl font-extrabold text-blue-400">
            FINDPIN
          </h1>
          <p className="text-center mb-11 text-blue-800 italic font-medium">
            Find pincode & area easily.
          </p>
        </div>

        <div className="flex flex-col  lg:flex-row justify-evenly items-center lg:items-start">
          <div>
            <div className="text-center mb-5">
              <h1 className="mb-5 text-2xl text-blue-500 font-bold">
                ENTER PIN CODE
              </h1>
              <input
                type="number"
                value={zip}
                onChange={handleZip}
                className="px-2 py-2 rounded border"
              />
              <button
                onClick={handleSearchZip}
                className="bg-blue-500 border text-white ml-2 px-3 py-2 rounded-md font-semibold"
              >
                Search
              </button>
            </div>
            {zipError && (
              <div className="bg-red-500 text-white p-2 rounded mb-3">
                {zipError}
              </div>
            )}
            {zipPostOffices.length > 0 && (
              <div className="bg-blue-50  p-5 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-3">
                  Area of Pin Code:{" "}
                  <span className="bg-blue-200 px-2">{zip}</span>
                </h2>
                <ul className="max-h-[30rem] overflow-auto">
                  {zipPostOffices.map((office, index) => (
                    <li key={index} className="border-b py-2">
                      <p>
                        <strong>Name:</strong> {office.Name}
                      </p>
                      <p>
                        <strong>Branch Type:</strong> {office.BranchType}
                      </p>
                      <p>
                        <strong>Delivery Status:</strong>{" "}
                        {office.DeliveryStatus}
                      </p>
                      <p>
                        <strong>District:</strong>{" "}
                        <span className="bg-blue-200 px-1">
                          {office.District}
                        </span>
                      </p>
                      <p>
                        <strong>State:</strong> {office.State}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="h-[1px] relative w-[90vw] my-16 lg:h-[70vh] lg:mt-14 lg:w-[1px] bg-slate-300">
            <div className="bg-blue-50 text-blue-300 p-4 rounded-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
              OR
            </div>
          </div>
          <div>
            <div className="text-center mb-5">
              <h1 className="mb-5 text-2xl font-bold text-blue-500">
                ENTER AREA NAME
              </h1>
              <input
                type="text"
                value={area}
                onChange={handleArea}
                className="px-2 py-2 rounded border"
              />
              <button
                onClick={handleSearchArea}
                className="bg-blue-500 border text-white ml-2 px-3 py-2 rounded-md font-semibold"
              >
                Search
              </button>
            </div>
            {areaError && (
              <div className="bg-red-500 text-white p-2 rounded mb-3">
                {areaError}
              </div>
            )}
            {areaPostOffices.length > 0 && (
              <div className="bg-blue-50 p-5 rounded  shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-3">
                  Pin Code of Area:{" "}
                  <span className="bg-blue-200 px-2">{area}</span>
                </h2>
                <ul className="max-h-[30rem] overflow-auto">
                  {areaPostOffices.map((office, index) => (
                    <li key={index} className="border-b py-2">
                      <p>
                        <strong>Name:</strong> {office.Name}
                      </p>
                      <p>
                        <strong>Branch Type:</strong> {office.BranchType}
                      </p>
                      <p>
                        <strong>Delivery Status:</strong>{" "}
                        {office.DeliveryStatus}
                      </p>
                      <p>
                        <strong>PinCode:</strong>{" "}
                        <span className="bg-blue-200 px-1">
                          {office.Pincode}
                        </span>
                      </p>
                      <p>
                        <strong>State:</strong> {office.State}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer>
        <div className="bg-blue-100 w-full">
          <p className="text-center font-medium text-blue-600 p-5">
            Made by{" "}
            <a
              href="https://www.nouvous.com"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-bold"
            >
              Nouvous
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
