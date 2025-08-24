import { useState, useEffect, useRef } from "react";
import ProviderAuthenticatedLayout from "./ProviderAuthenticatedLayout";
import SectionWithTitle from "../../components/SectionWithTitle.jsx";
import ProviderSelectConsumer from "../../components/ProviderSelectConsumer.jsx";
import ProviderSelectCluster from "../../components/ProviderSelectCluster.jsx";
import ProviderInsightsConsumerData from "../../components/ProviderInsightsConsumerData.jsx";
import ProviderInsightsClusterData from "../../components/ProviderInsightsClusterData.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  getConsumerInfoByPSN,
  getUserEmail,
  getAllConsumerPowerSupplyNumbers,
} from "../../service/api.jsx";

const selectClassName =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5";
const customSelectClass =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-300 block w-full ps-10 pe-10 p-2.5 cursor-pointer";
const dropdownClass =
  "absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1";
const dropdownItemClass =
  "px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center";
const dropdownItemSelectedClass =
  "px-4 py-2 text-sm bg-orange-100 text-orange-700 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center";
const tabClassName = "inline-block w-5/6 p-2 text-normal rounded-lg gap-2";
const activeTabClassName =
  "focus:ring-gray-200 bg-white text-orange-500 ring-2 ring-orange-400 ";
const inactiveTabClassName =
  "bg-white hover:text-gray-700 hover:bg-gray-50 ring-2 ring-gray-300 focus:ring-orange-300 cursor-pointer ";
const consumer = "Consumer";
const cluster = "Group of Similar Consumers";

function ProviderInsights() {
  const userEmail = getUserEmail();
  const [selectedOption, setSelectedOption] = useState(consumer);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [numberOfPowerSupply, setNumberOfPowerSupply] = useState(undefined);
  const [verifiedNumberOfPowerSupply, setVerifiedNumberOfPowerSupply] =
    useState(undefined);
  const [clusterInfo, setclusterInfo] = useState(undefined);
  const [consumerInfo, setConsumerInfo] = useState(undefined);
  const [availablePSNs, setAvailablePSNs] = useState([]);
  const dropdownRef = useRef(null);

  const options = [
    { value: consumer, label: consumer, icon: faUser },
    { value: cluster, label: cluster, icon: faUsers },
  ];

  const handleNumberOfPowerSuppliesChange = (number) => {
    setNumberOfPowerSupply(number);
  };

  const handleClusterIDShow = (cluster) => {
    setclusterInfo(cluster);
  };

  const handleOptionChange = (event) => {
    const selected = event.target.value;
    if (selectedOption === selected) {
      return;
    }
    setSelectedOption(selected);
  };

  const handleCustomOptionSelect = (option) => {
    if (selectedOption === option) {
      return;
    }
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchPSNs = async () => {
      try {
        const response = await getAllConsumerPowerSupplyNumbers();
        if (response && response.power_supply_numbers) {
          setAvailablePSNs(response.power_supply_numbers);
        }
      } catch (error) {
        console.error("Failed to fetch power supply numbers:", error);
      }
    };

    fetchPSNs();
  }, []);

  useEffect(() => {
    const fetchConsumerInfo = async () => {
      if (userEmail) {
        try {
          const response = await getConsumerInfoByPSN(numberOfPowerSupply);
          if (response.error) {
            setVerifiedNumberOfPowerSupply(null);
            return;
          }
          setVerifiedNumberOfPowerSupply(response.power_supply_number);
          setConsumerInfo(response);
        } catch (error) {
          setVerifiedNumberOfPowerSupply(null);
        }
      }
    };

    if (numberOfPowerSupply) {
      fetchConsumerInfo();
    }
  }, [numberOfPowerSupply]);

  return (
    <ProviderAuthenticatedLayout>
      <div className='p-1 sm:ml-40 mt-10bg-gray-200 font-ubuntu'>
        <div className='p-2 rounded-lg bg-gray-50 border-b-2 border-orange-400 pb-10 m-2'>
          <div className='grid grid-cols-1 justify-center items-center gap-4 mb-1 pb-4  '>
            <SectionWithTitle
              title={"Insights"}
              description={
                "Here you can inspect insights about your individual consumers or your clusters of consumers. Select the option you want to inspect."
              }
            />
          </div>
          <div className='sm:hidden m-2 relative' ref={dropdownRef}>
            {/* Custom dropdown for mobile */}
            <div className='relative'>
              <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
                <FontAwesomeIcon
                  icon={
                    options.find((opt) => opt.value === selectedOption)?.icon ||
                    faUser
                  }
                  className='w-4 h-4 text-gray-500'
                />
              </div>
              <div className={customSelectClass} onClick={toggleDropdown}>
                {selectedOption}
              </div>
              {/* Dropdown toggle button */}
              <button
                type='button'
                className='absolute inset-y-0 end-0 flex items-center pe-3'
                onClick={toggleDropdown}
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Custom dropdown */}
              {isDropdownOpen && (
                <div className={dropdownClass}>
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className={
                        selectedOption === option.value
                          ? dropdownItemSelectedClass
                          : dropdownItemClass
                      }
                      onClick={() => handleCustomOptionSelect(option.value)}
                    >
                      <FontAwesomeIcon
                        icon={option.icon}
                        className='w-4 h-4 text-gray-400 mr-3'
                      />
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <ul className='hidden text-sm font-medium text-center text-gray-500 rounded-lg sm:flex mt-5'>
            <li className='w-full'>
              <a
                className={`${tabClassName} ${
                  selectedOption === consumer
                    ? activeTabClassName
                    : inactiveTabClassName
                }`}
                onClick={() =>
                  handleOptionChange({ target: { value: consumer } })
                }
              >
                {consumer}
              </a>
            </li>
            <li className='w-full'>
              <a
                className={`${tabClassName} ${
                  selectedOption === cluster
                    ? activeTabClassName
                    : inactiveTabClassName
                }`}
                onClick={() =>
                  handleOptionChange({ target: { value: cluster } })
                }
              >
                {cluster}
              </a>
            </li>
          </ul>

          {/* conditional rendering based on selectedOption */}
          {selectedOption === consumer && (
            <ProviderSelectConsumer
              onSubmit={handleNumberOfPowerSuppliesChange}
              availablePSNs={availablePSNs}
            />
          )}
          {selectedOption === cluster && (
            <ProviderSelectCluster onShowClick={handleClusterIDShow} />
          )}
        </div>
      </div>
      {selectedOption === consumer && (
        <ProviderInsightsConsumerData
          numberOfPowerSupply={verifiedNumberOfPowerSupply}
          consumerInfo={consumerInfo}
        />
      )}
      {selectedOption === cluster && (
        <ProviderInsightsClusterData clusterInfoData={clusterInfo} />
      )}
    </ProviderAuthenticatedLayout>
  );
}

export default ProviderInsights;
