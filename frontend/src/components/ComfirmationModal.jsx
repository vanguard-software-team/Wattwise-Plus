import PropTypes from "prop-types";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 font-cairo bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-60 mx-auto p-4 border-4 w-96 shadow-lg rounded-lg bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-normal leading-6 font-medium text-gray-900">{message}</h3>
          <div className="mt-2 px-7 py-3">
            <button
              className="bg-gray-500 text-white active:bg-gray-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              onClick={onConfirm}
            >
              Confirm
            </button>
            <button
              className="bg-orange-400 text-white active:bg-orange-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired,
	message: PropTypes.string.isRequired,
};

export default ConfirmationModal;
