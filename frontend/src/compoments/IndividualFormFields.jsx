import BirthdateDatePicker from "./BirthdateDatePicker";
import PropTypes from "prop-types";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";

function IndividualFormFields({ formData, handleInputChange }) {
	return (
		<>
			<p className="pt-4 pr-2 text-gray-400">Personal Information</p>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
				<div>
					<label
						htmlFor="fullname"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Full Name
					</label>
					<input
						type="text"
						id="fullName"
						name="fullName"
						value={formData.fullName}
						onChange={handleInputChange}
						className={inputClass}
						required
					/>
				</div>
				<div>
					<label
						htmlFor="email"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Birthdate
					</label>
					<BirthdateDatePicker
						id="birthDate"
						name="birthDate"
						defaultDate={formData.birthDate}
						onDateChange={handleInputChange}
					/>
				</div>
				<div>
					<label
						htmlFor="age"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Contact Phone
					</label>
					<input
						type="number"
						id="phoneNumber"
						name="phoneNumber"
						value={formData.phoneNumber}
						onChange={handleInputChange}
						className={inputClass}
					/>
				</div>
			</div>
			<p className="pt-4 pr-2 text-gray-400">Details</p>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
				<div>
					<label
						htmlFor="numberOfoccupants"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Number of occupants
					</label>
					<select
						id="numberOfoccupants"
						name="numberOfoccupants"
						className={inputClass}
						value={formData.numberOfoccupants}
					>
						<option disabled selected>
							Choose the number of occupants
						</option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5+">5+</option>
					</select>
				</div>
				<div>
					<label
						htmlFor="typeOfoccupants"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						In your house live
					</label>
					<select
						id="typeOfoccupants"
						name="typeOfoccupants"
						className={inputClass}
						value={formData.typeOfoccupants}
					>
						<option disabled selected>
							Choose the type of occupants
						</option>
						<option value="One or more adults and at least one child up to 17 years old">
							One or more adults and at least one child up to 17 years old
						</option>
						<option value="Adults aged 18 to 29 only">
							Adults aged 18 to 29 only
						</option>
						<option value="Adults aged 30 to 54 only">
							Adults aged 30 to 54 only
						</option>
						<option value="Adults aged 55 to 65 only">
							Adults aged 55 to 65 only
						</option>
						<option value="Adults aged 65+ only">Adults aged 65+ only</option>
					</select>
				</div>
				<div>
					<label
						htmlFor="houseType"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						House type
					</label>
					<select
						id="houseType"
						name="houseType"
						className={inputClass}
						value={formData.houseType}
					>
						<option disabled selected>
							Choose the house type
						</option>
						<option value="Apartment">Apartment </option>
						<option value="Detached house">Detached house</option>
					</select>
				</div>
				<div>
					<label
						htmlFor="squareMeters"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Square Meters (&#13217;)
					</label>
					<select
						id="squareMeters"
						name="squareMeters"
						className={inputClass}
						value={formData.squareMeters}
					>
						<option disabled selected>
							Choose the square meters
						</option>
						<option value="5-30">5-30</option>
						<option value="31-65">31-65</option>
						<option value="66-90">66-90</option>
						<option value="90-120">90-120</option>
						<option value="120+">120+</option>
					</select>
				</div>
				<div>
					<label
						htmlFor="ageElectricityManager"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Age of person managing home electricity
					</label>
					<select
						id="ageElectricityManager"
						name="ageElectricityManager"
						className={inputClass}
						value={formData.ageElectricityManager}
					>
						<option disabled selected>
							Choose the age of person managing home electricity
						</option>
						<option value="18-24">18-24</option>
						<option value="25-34">25-34</option>
						<option value="35-44">35-44</option>
						<option value="45-54">45-54</option>
						<option value="55-64">55-64</option>
						<option value="65+">65+</option>
					</select>
				</div>
				<div>
					<label
						htmlFor="floor"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						What floor do you live on
					</label>
					<select
						id="floor"
						name="floor"
						className={inputClass}
						value={formData.floor}
					>
						<option disabled selected>
							Choose the floor
						</option>
						<option value="Ground floor">Ground floor</option>
						<option value="1st floor (building without pilot)">
							1st floor (building without pilot)
						</option>
						<option value="1st floor (with pilot)">
							1st floor (building with pilot)
						</option>
						<option value="On an intermediate floor">
							On an intermediate floor
						</option>
						<option value="On the top floor">On the top floor</option>
					</select>
				</div>
				<div>
					<label
						htmlFor="houseBuilt"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						When was your house built
					</label>
					<select
						id="houseBuilt"
						name="houseBuilt"
						className={inputClass}
						value={formData.houseBuilt}
					>
						<option disabled selected>
							Choose when was your house built
						</option>
						<option value="Before 1980">Before 1980</option>
						<option value="1980-2000">1980-2000</option>
						<option value="2001-2010">2001-2010</option>
						<option value="After 2010">After 2010</option>
						<option value="Dont know">Dont know</option>
					</select>
				</div>
				<div>
					<label
						htmlFor="frames"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Type of house exterior frames
					</label>
					<select
						id="frames"
						name="frames"
						className={inputClass}
						value={formData.frames}
					>
						<option disabled selected>
							Choose the type of frames
						</option>
						<option value="Wooden or metal with single glazing">
							Wooden or metal with single glazing
						</option>
						<option value="Αluminum or synthetic with double glazing">
							Αluminum or synthetic with double glazing
						</option>
						<option value="Αluminum or synthetic with thermal break and double glazing">
							Αluminum or synthetic with thermal break and double glazing
						</option>
						<option value="Dont know">Dont know</option>
					</select>
				</div>
				<div>
					<label
						htmlFor="heatingType"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Main winter heating system
					</label>
					<select
						id="heatingType"
						name="heatingType"
						className={inputClass}
						value={formData.heatingType}
					>
						<option disabled selected>
							Choose the heating type
						</option>
					</select>
				</div>
				<div>
					<label
						htmlFor="haveSolarPanels"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Do you have solar panels
					</label>
					<select
						id="haveSolarPanels"
						name="haveSolarPanels"
						className={inputClass}
						value={formData.haveSolarPanels}
					>
						<option disabled selected>
							Do you have solar panels
						</option>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</select>
				</div>
				<div>
					<label
						htmlFor="hotWater"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						What do you use to have hot water
					</label>
					<select
						id="hotWater"
						name="hotWater"
						className={inputClass}
						value={formData.hotWater}
					>
						<option disabled selected>
							Choose hot water method
						</option>
					</select>
				</div>
				<div>
					<label
						htmlFor="evCarCharger"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Do you have EV car charger
					</label>
					<select
						id="evCarCharger"
						name="evCarCharger"
						className={inputClass}
						value={formData.evCarCharger}
					>
						<option disabled selected>
							Do you have EV car charger
						</option>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</select>
				</div>
			</div>
		</>
	);
}

IndividualFormFields.propTypes = {
	handleInputChange: PropTypes.func,
	formData: PropTypes.shape({
		fullName: PropTypes.string,
		birthDate: PropTypes.instanceOf(Date),
		phoneNumber: PropTypes.string,
		numberOfoccupants: PropTypes.string,
		houseType: PropTypes.string,
		squareMeters: PropTypes.string,
		typeOfoccupants: PropTypes.string,
		ageElectricityManager: PropTypes.string,
		floor: PropTypes.string,
		houseBuilt: PropTypes.string,
		frames: PropTypes.string,
		heatingType: PropTypes.string,
		haveSolarPanels: PropTypes.bool,
		hotWater: PropTypes.string,
		evCarCharger: PropTypes.bool,
	}),
};

export default IndividualFormFields;
