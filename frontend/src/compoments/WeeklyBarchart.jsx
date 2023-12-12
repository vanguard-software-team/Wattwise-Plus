import { PureComponent } from "react";
import { BarChart, Bar, Cell, ResponsiveContainer } from "recharts";

export default class WeeklyBarchart extends PureComponent {
	state = {
		data: [
			{
				name: "Page A",
				uv: 4000,
				pv: 2400,
				amt: 2400,
			},
			{
				name: "Page B",
				uv: 3000,
				pv: 1398,
				amt: 2210,
			},
			{
				name: "Page C",
				uv: 2000,
				pv: 9800,
				amt: 2290,
			},
			{
				name: "Page D",
				uv: 2780,
				pv: 3908,
				amt: 2000,
			},
			{
				name: "Page E",
				uv: 1890,
				pv: 4800,
				amt: 2181,
			},
			{
				name: "Page F",
				uv: 2390,
				pv: 3800,
				amt: 2500,
			},
			{
				name: "Page G",
				uv: 3490,
				pv: 4300,
				amt: 2100,
			},
		],
		activeIndex: 6,
	};

	handleMouseEnter = (data, index) => {
		this.setState({
			activeIndex: index,
		});
	};

	render() {
		const { activeIndex, data } = this.state;
		const activeItem = data[activeIndex];

		return (
			<div style={{ width: "100%" }} className=" z-10 mr-5">
				<div className="flex justify-end items-end">
					<ResponsiveContainer width="45%" height={60}>
						<BarChart width={160} height={40} data={data}>
							<Bar dataKey="uv" onMouseEnter={this.handleMouseEnter}>
								{data.map((entry, index) => (
									<Cell
										cursor="pointer"
										fill={index === activeIndex ? "#fc8c03" : "#d1d0cf"}
										key={`cell-${index}`}
									/>
								))}
							</Bar>
						</BarChart>
						<p className="content text-sm text-center">{`${activeItem.name}: ${activeItem.uv}`}</p>
					</ResponsiveContainer>
				</div>
			</div>
		);
	}
}
