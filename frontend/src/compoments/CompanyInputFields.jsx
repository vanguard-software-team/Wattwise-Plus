import { Field, ErrorMessage } from "formik";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";

function CompanyInputFields() {
	return (
		<>
			<p className="pt-4 text-gray-400">Company Information</p>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
				{/* Company Name */}
				<div className="p-2">
					<label
						htmlFor="companyName"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Company Name
					</label>
					<Field
						name="companyName"
						type="text"
						className={inputClass}
						placeholder="Type the company name"
					/>
					<ErrorMessage name="companyName" component="div" />
				</div>
				{/* TIN */}
				<div className="p-2">
					<label
						htmlFor="TIN"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Tax Identification Number
					</label>
					<Field
						name="TIN"
						type="text"
						className={inputClass}
						placeholder="Type the TIN"
					/>
					<ErrorMessage name="TIN" component="div" />
				</div>
				{/* Phone Number */}
				<div className="p-2">
					<label
						htmlFor="phoneNumber"
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
				{/* Number of employees */}
				<div className="p-2">
					<label
						htmlFor="numberOfemployees"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Number of employees
					</label>
					<Field as="select" name="numberOfemployees" className={inputClass}>
						<option disabled value="">
							Choose the number of employees
						</option>
						<option value="1-5">1-5</option>
						<option value="5-15">5-15</option>
						<option value="15-30">15-30</option>
						<option value="30-60">30-60</option>
						<option value="60+">60+</option>
					</Field>
					<ErrorMessage name="numberOfemployees" component="div" />
				</div>
				{/* House exterior frames */}
				<div className="p-2">
					<label
						htmlFor="frames"
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
						htmlFor="heatingType"
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
						htmlFor="haveSolarPanels"
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
						htmlFor="hotWater"
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
						htmlFor="evCarCharger"
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

export default CompanyInputFields;
