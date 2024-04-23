import { Field, useField, ErrorMessage, useFormikContext } from "formik";
import BirthdateDatePicker from "./BirthdateDatePicker";
import { useEffect, useState } from "react";
import { getUserEmail, getConsumerInfo } from "../service/api";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";

function IndividualInputFields() {
    const { setFieldValue, setValues } = useFormikContext();
    const [birthDateField, , birthDateHelpers] = useField("birthDate");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        setUserEmail(getUserEmail());
    }, []);

    useEffect(() => {
        const fetchConsumerInfo = async () => {
            if (userEmail) {
                const response = await getConsumerInfo(userEmail);
                if (response) {
                    console.log("Fetched data:", response);
                    // Here you map the API response to your field names and formats
                    const mappedValues = {
                        email: response.email,
                        fullName: response.full_name || '', // Assuming it's okay to default to an empty string
                        birthDate: response.birthdate, // Adjust format if necessary
                        phoneNumber: response.contact_phone || '',
                        houseType: response.building_type.toString(),
                        squareMeters: response.square_meters.toString(),
                        floor: response.floor.toString(),
                        houseBuilt: response.building_built.toString(),
                        frames: response.frames.toString(),
                        heatingType: response.heating_type.toString(),
                        haveSolarPanels: !!response.have_solar_panels,
                        hotWater: response.hot_water.toString(),
                        evCarCharger: !!response.ev_car_charger,
                        numberOfoccupants: response.number_of_occupants.toString(),
                        typeOfoccupants: response.type_of_occupants.toString(),
                        ageElectricityManager: response.age_electricity_manager.toString(),
                    };
                    setValues(mappedValues); // Set all values at once using Formik's setValues
                }
            }
        };
        fetchConsumerInfo();
    }, [userEmail, setValues]);

	return (
		<>
			<p className="pt-4 text-gray-400">Personal Information</p>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
				{/* Full Name */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Full Name
					</label>
					<Field
						name="fullName"
						type="text"
						className={inputClass}
						placeholder="Type your full name"
					/>
					<ErrorMessage name="fullName" component="div" />
				</div>

				{/* Birthdate */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Birthdate
					</label>
					<BirthdateDatePicker
						{...birthDateField}
						defaultDate={birthDateField.value}
						onDateChange={(value) => birthDateHelpers.setValue(value)}
					/>
					<ErrorMessage name="birthDate" component="div" />
				</div>

				{/* Phone Number */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Contact Phone
					</label>
					<Field
						name="phoneNumber"
						type="text"
						className={inputClass}
						placeholder="Type your phone"
					/>
					<ErrorMessage name="phoneNumber" component="div" />
				</div>

				{/* House Type */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						House Type
					</label>
					<Field as="select" name="houseType" className={inputClass}>
						<option disabled value="">
							Choose the house type
						</option>
						<option value="Apartment">Apartment</option>
						<option value="Detached house">Detached house</option>
					</Field>
					<ErrorMessage name="houseType" component="div" />
				</div>
				{/* Square Meters */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Square Meters (&#13217;)
					</label>
					<Field as="select" name="squareMeters" className={inputClass}>
						<option disabled value="">
							Choose the square meters
						</option>
						<option value="5-30">5-30</option>
						<option value="31-65">31-65</option>
						<option value="66-90">66-90</option>
						<option value="90-120">90-120</option>
						<option value="120+">120+</option>
					</Field>
					<ErrorMessage name="squareMeters" component="div" />
				</div>
				{/* Floor */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						What floor do you live on
					</label>
					<Field as="select" name="floor" className={inputClass}>
						<option disabled value="">
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
					</Field>
					<ErrorMessage name="floor" component="div" />
				</div>
				{/* House Built */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						When was your house built
					</label>
					<Field as="select" name="houseBuilt" className={inputClass}>
						<option disabled value="">
							Choose when was your house built
						</option>
						<option value="Before 1980">Before 1980</option>
						<option value="1980-2000">1980-2000</option>
						<option value="2001-2010">2001-2010</option>
						<option value="After 2010">After 2010</option>
						<option value="Dont know">Dont know</option>
					</Field>
					<ErrorMessage name="houseBuilt" component="div" />
				</div>
				{/* Number of occupants */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Number of occupants
					</label>
					<Field as="select" name="numberOfoccupants" className={inputClass}>
						<option disabled value="">
							Choose the number of occupants
						</option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5+">5+</option>
					</Field>
					<ErrorMessage name="numberOfoccupants" component="div" />
				</div>
				{/* Type of occupants */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Type of occupants
					</label>
					<Field as="select" name="typeOfoccupants" className={inputClass}>
						<option disabled value="">
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
					</Field>
					<ErrorMessage name="numberOfoccupants" component="div" />
				</div>
				{/* Age of electricity manager */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Age of person managing home electricity
					</label>
					<Field
						as="select"
						name="ageElectricityManager"
						className={inputClass}
					>
						<option disabled value="">
							Choose the age of person managing home electricity
						</option>
						<option value="18-24">18-24</option>
						<option value="25-34">25-34</option>
						<option value="35-44">35-44</option>
						<option value="45-54">45-54</option>
						<option value="55-64">55-64</option>
						<option value="65+">65+</option>
					</Field>
					<ErrorMessage name="ageElectricityManager" component="div" />
				</div>
				{/* House exterior frames */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Type of house exterior frames
					</label>
					<Field as="select" name="frames" className={inputClass}>
						<option disabled value="">
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
					</Field>
					<ErrorMessage name="frames" component="div" />
				</div>
				{/* Ηeating Τype */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Heating System
					</label>
					<Field as="select" name="heatingType" className={inputClass}>
						<option disabled value="">
							Choose the heating type
						</option>
						<option value="Autonomous oil boiler">Autonomous oil boiler</option>
						<option value="Central oil boiler">Central oil boiler</option>
						<option value="Independent natural gas boiler">
							Independent natural gas boiler
						</option>
						<option value="Central gas boiler">Central gas boiler</option>
						<option value="Central heat pump">Central heat pump</option>
						<option value="Autonomous heat pump">Autonomous heat pump</option>
						<option value="Boiler with pellets or other type of biomass">
							Boiler with pellets or other type of biomass
						</option>
						<option value="Thermal accumulators">Thermal accumulators</option>
						<option value="Air conditioner">Air conditioner</option>
						<option value="Stove">Stove</option>
						<option value="I don't use/don't know">I dont use/dont know</option>
					</Field>
					<ErrorMessage name="heatingType" component="div" />
				</div>
				{/* Solar Panels */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Do you have solar panels
					</label>
					<Field as="select" name="haveSolarPanels" className={inputClass}>
						<option value="" disabled>
							Do you have solar panels
						</option>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</Field>
					<ErrorMessage name="haveSolarPanels" component="div" />
				</div>
				{/* Hot Water */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						What do you use to have hot water
					</label>
					<Field as="select" name="hotWater" className={inputClass}>
						<option disabled value="">
							Choose hot water method
						</option>
						<option value="Electric water heater">Electric water heater</option>
						<option value="Oil boiler">Oil boiler</option>
						<option value="Gas boiler">Gas boiler</option>
						<option value="Heat pump">Heat pump</option>
						<option value="Solar collector with electrical resistance">
							Solar collector with electrical resistance
						</option>
						<option value="Solar collector with electric resistance and heat pump">
							Solar collector with electric resistance and heat pump
						</option>
						<option value="Solar collector with electric resistance and boiler">
							Solar collector with electric resistance and boiler
						</option>
						<option value="Electric resistance and boiler">
							Electric resistance and boiler
						</option>
						<option value="I don't use/don't know">I dont use/dont know</option>
					</Field>
					<ErrorMessage name="hotWater" component="div" />
				</div>
				{/* EV charger */}
				<div className="p-2">
					<label
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Do you have EV car charger
					</label>
					<Field as="select" name="evCarCharger" className={inputClass}>
						<option disabled value="">
							Do you have EV car charger
						</option>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</Field>
					<ErrorMessage name="evCarCharger" component="div" />
				</div>
			</div>
		</>
	);
}

export default IndividualInputFields;
