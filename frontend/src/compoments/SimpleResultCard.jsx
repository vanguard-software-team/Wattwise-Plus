import PropTypes from 'prop-types';
function SimpleResultCard({title,result}) {
    return (
        <div
            className="block pt-10 h-36 bg-gray-50 border-orange-400 border-b-2 rounded-lg  hover:bg-gray-100">
            <h5 className=" mb-2 font-bold lg:text-xl tracking-tight text-gray-900 text-center  ">{title}</h5>
            <p className="font-normal lg:text-xl text-gray-700 text-center">{result}</p>
        </div>
    );
}


SimpleResultCard.propTypes = {
    title: PropTypes.string.isRequired,
    result: PropTypes.string.isRequired,
};
export default SimpleResultCard