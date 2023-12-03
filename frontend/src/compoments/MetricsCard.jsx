import PropTypes from "prop-types";

function MetricsCard({ title, metrics, children }) {
  return (
    <div className="bg-gray-50 pt-5 m-2 rounded-lg">
      <h5 className="font-bold text-lg tracking-tight text-gray-900 text-center">{title}</h5>
      <div className="grid grid-cols-3 gap-4 justify-center">
        {metrics.map((metric, index) => (
          <div key={index} className="block pt-5 h-240 mb-5">
            <h5 className="mb-2 font-bold text-lg tracking-tight text-gray-900 text-center">{metric.title}</h5>
            <p className="font-normal text-gray-700 text-center">{metric.description}</p>
          </div>
        ))}
      </div>
      {children && (
        <div className="additional-content">{children}</div>
      )}
    </div>
  );
}

MetricsCard.propTypes = {
  title: PropTypes.string.isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired,
  children: PropTypes.node
};

export default MetricsCard;
