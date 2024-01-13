import { useState } from "react";
import ProviderAuthenticatedLayout from "./ProviderAuthenticatedLayout";
import SectionTitleDescription from "../../compoments/SectionTitleDescription.jsx";
import ProviderDashboardConsumer from "../../compoments/ProviderDashboardConsumer.jsx";
import ProviderDashboardCluster from "../../compoments/ProviderDashboardCluster.jsx";

const selectClassName =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5";
const tabClassName =
	"inline-block w-full p-4 border-r border-gray-200 text-normal";
const activeTabClassName = "focus:ring-gray-200 bg-orange-100";
const inactiveTabClassName =
	"bg-white hover:text-gray-700 hover:bg-gray-50 focus:ring-orange-300 cursor-pointer";
const consumer = "Consumer";
const cluster = "Cluster";

function ProviderDashboard() {
  const [selectedOption, setSelectedOption] = useState(consumer);

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
      <div className="p-1 sm:ml-40 bg-gray-200 font-robotoflex">
        <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
          <div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 pb-4 ">
            <SectionTitleDescription
              title={"Welcome"}
              description={
                "Here you can inspect insights about your individual consumers or your cluster of consumers as a whole. Select the option you want to inspect below."
              }
            />
          </div>
          <div className="sm:hidden">
            <select
              value={selectedOption}
              onChange={handleOptionChange}
              className={selectClassName}
            >
              <option value={consumer}>{consumer}</option>
              <option value={cluster}>{cluster}</option>
            </select>
          </div>
          <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex">
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
          {selectedOption === consumer && <ProviderDashboardConsumer />}
          {selectedOption === cluster && <ProviderDashboardCluster />}

        </div>
      </div>
    </ProviderAuthenticatedLayout>
  );
}

export default ProviderDashboard;
