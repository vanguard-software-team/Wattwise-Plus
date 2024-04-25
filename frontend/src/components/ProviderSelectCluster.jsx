import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { getClusterInfo } from '../service/api';


function ProviderDashboardCluster({ onShowClick }) {

	const [clusters, setClusters] = useState([]);

	const fetchClusters = async () => {
		const response = await getClusterInfo();
		setClusters(response);
	}

	useEffect(() => {
		fetchClusters();
	}
		, []);

	return (
		<div className="relative max-h-[40vh] lg:flex justify-center overflow-y-auto sm:rounded-lg mt-6">
			<table className="w-5/6 text-sm text-left rtl:text-right text-gray-500">
				<thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50">
					<tr>
						<th scope="col" className="px-6 py-3">Cluster Name</th>
						<th scope="col" className="px-6 py-3"># of Consumers</th>
						<th scope="col" className="px-6 py-3">Cluster Type</th>
						<th scope="col" className="px-6 py-3">Action</th>
					</tr>
				</thead>
				<tbody>
					{clusters.map((cluster) => (
						<tr key={cluster.id} className="bg-white border-b">
							<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
								{cluster.name}
							</th>
							<td className="px-6 py-4">{cluster.number_of_consumers}</td>
							<td className="px-6 py-4">{cluster.cluster_type}</td>
							<td className="px-6 py-4">
								<button
									className="text-orange-500 hover:underline"
									onClick={() => onShowClick(cluster)}
								>
									Show
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

ProviderDashboardCluster.propTypes = {
	onShowClick: PropTypes.func.isRequired,
};

export default ProviderDashboardCluster;
