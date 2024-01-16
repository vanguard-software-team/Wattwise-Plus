import { useState } from "react";
import ProviderAuthenticatedLayout from "./ProviderAuthenticatedLayout";
import SectionWithTitle from "../../compoments/SectionWithTitle.jsx";
import ProviderSelectConsumer from "../../compoments/ProviderSelectConsumer.jsx";
import ProviderSelectCluster from "../../compoments/ProviderSelectCluster.jsx";
import ProviderInsightsConsumerData from "../../compoments/ProviderInsightsConsumerData.jsx";
import ProviderInsightsClusterData from "../../compoments/ProviderInsightsClusterData.jsx";

const selectClassName =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5";
const tabClassName =
	"inline-block w-5/6 p-2 text-normal rounded-lg gap-2";
const activeTabClassName = "focus:ring-gray-200 bg-white text-orange-500 ring-2 ring-orange-400 ";
const inactiveTabClassName =
	"bg-white hover:text-gray-700 hover:bg-gray-50 ring-2 ring-gray-300 focus:ring-orange-300 cursor-pointer ";
const consumer = "Consumer";
const cluster = "Cluster";

function ProviderInsights() {
  const [selectedOption, setSelectedOption] = useState(consumer);
  const [numberOfPowerSupply, setNumberOfPowerSupply] = useState(undefined);
  const [clusterID, setclusterID] = useState(undefined);

  const handleNumberOfPowerSuppliesChange = (number) => {
    setNumberOfPowerSupply(number);
  };

  const handleClusterIDShow = (number) => {
    setclusterID(number);
  };

  const handleOptionChange = (event) => {
    const selected = event.target.value;
    if (selectedOption === selected) {
      return;
    }
    setSelectedOption(selected);
    console.log(selected);
  };

  return (
    <ProviderAuthenticatedLayout>
      <div className="p-1 sm:ml-40 mt-10bg-gray-200 font-robotoflex">
        <div className="p-2 rounded-lg bg-gray-50 border-b-2 border-orange-400 pb-10 m-2">
          <div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 pb-4  ">
            <SectionWithTitle
              title={"Insights"}
              description={
                "Here you can inspect insights about your individual consumers or your clusters of consumers. Select the option you want to inspect."
              }
            />
          </div>
          <div className="sm:hidden m-2 ">
            <select
              value={selectedOption}
              onChange={handleOptionChange}
              className={selectClassName}
            >
              <option value={consumer}>{consumer}</option>
              <option value={cluster}>{cluster}</option>
            </select>
          </div>
          <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg sm:flex mt-5">
            <li className="w-full">
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
            <li className="w-full">
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
          {selectedOption === consumer && <ProviderSelectConsumer onSubmit={handleNumberOfPowerSuppliesChange} />}
          {selectedOption === cluster && <ProviderSelectCluster onShowClick={handleClusterIDShow}/>}

        </div>

      </div>
      {selectedOption === consumer && <ProviderInsightsConsumerData numberOfPowerSupply={numberOfPowerSupply} />}
        {selectedOption === cluster && <ProviderInsightsClusterData clusterID={clusterID} />}
    </ProviderAuthenticatedLayout>
  );
}

export default ProviderInsights;
