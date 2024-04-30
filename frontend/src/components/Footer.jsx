import DatalabLogo from "../assets/images/logos/datalab_logo.png";

function Footer() {
	const datalabUrl = "https://datalab.csd.auth.gr/";

	return (
		<section className="bg-orange-300 active bottom-0 w-full">
			<div className="py-3 mx-auto max-w-screen-xl px-4 ">
				<div className="grid grid-cols-1 gap-8 text-gray-500">
					<a href={datalabUrl} className="flex justify-center items-center">
						<img src={DatalabLogo} className="h-10" alt="DataLab logo"></img>
					</a>
				</div>
			</div>
		</section>
	);
}

export default Footer;
