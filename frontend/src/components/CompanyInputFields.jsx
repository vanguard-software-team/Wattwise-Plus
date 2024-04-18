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
				{/* Company Building Type */}
				<div className="p-2">
					<label
						htmlFor="companyBuildingType"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Company Building
					</label>
					<Field as="select" name="companyBuildingType" className={inputClass}>
						<option disabled value="">
							Choose the company&apos;s  bulding
						</option>
						<option value="Apartment">Apartment</option>
						<option value="Detached building">Detached building</option>
					</Field>
					<ErrorMessage name="companyBuildingType" component="div" />
				</div>
				{/* Square Meters */}
				<div className="p-2">
					<label
						htmlFor="squareMeters"
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
						htmlFor="floor"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						What is the floor of the company&apos;s  bulding
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
						htmlFor="companyBuilt"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						When was the company&apos;s  bulding built
					</label>
					<Field as="select" name="companyBuilt" className={inputClass}>
						<option disabled value="">
							Choose when was the company&apos;s  bulding built
						</option>
						<option value="Before 1980">Before 1980</option>
						<option value="1980-2000">1980-2000</option>
						<option value="2001-2010">2001-2010</option>
						<option value="After 2010">After 2010</option>
						<option value="Dont know">Dont know</option>
					</Field>
					<ErrorMessage name="companyBuilt" component="div" />
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
						<option value="1-10">1-10 (Very small business)</option>
						<option value="11-50">11-50 (Small business)</option>
						<option value="51-250">51-250 (Medium business)</option>
						<option value="250+">250+ (Large business)</option>
					</Field>
					<ErrorMessage name="numberOfemployees" component="div" />
				</div>
				{/* House exterior frames */}
				<div className="p-2">
					<label
						htmlFor="frames"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Type of bulding&apos;s exterior frames
					</label>
					<Field as="select" name="frames" className={inputClass}>
						<option disabled value="">
							Choose the type of frames
						</option>
						<option value="Wooden or metal with single glazing">
							Wooden or metal with single glazing
						</option>
						<option value="Aluminum or synthetic with double glazing">
							Aluminum or synthetic with double glazing
						</option>
						<option value="Aluminum or synthetic with thermal break and double glazing">
							Aluminum or synthetic with thermal break and double glazing
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
