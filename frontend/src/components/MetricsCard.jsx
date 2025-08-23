import PropTypes from "prop-types";

function MetricsCard({ title, description, metrics, children }) {
  return (
    <div className='bg-gray-50 pt-5 m-2 rounded-lg'>
      <h5 className='font-bold text-xl tracking-tight text-gray-900 text-center'>
        {title}
      </h5>
      <p className='text-sm pt-2 text-gray-500 text-center'>{description}</p>
      <div className='grid grid-cols-3 gap-4 justify-center rounded-lg border-b-2 border-orange-400'>
        {metrics.map((metric, index) => (
          <div key={index} className='block pt-5 h-240 mb-5'>
            <h5 className='mb-2 font-bold text-lg tracking-tight text-gray-900 text-center'>
              {metric.title}
            </h5>
            <p className='font-bold text-lg text-gray-500 text-center'>
              {metric.description}
            </p>
          </div>
        ))}
      </div>
      {children && <div className='additional-content'>{children}</div>}
    </div>
  );
}

MetricsCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.node.isRequired,
    })
  ).isRequired,
  children: PropTypes.node,
};

export default MetricsCard;
