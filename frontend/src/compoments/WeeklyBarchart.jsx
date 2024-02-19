import { PureComponent } from "react";
import { BarChart, Bar, Cell, ResponsiveContainer } from "recharts";
import PropTypes from "prop-types";

export default class WeeklyBarchart extends PureComponent {
    static propTypes = {
        data: PropTypes.array.isRequired,
    };

    state = {
        activeIndex: 6,
    };

    handleMouseEnter = (data, index) => {
        this.setState({
            activeIndex: index,
        });
    };

	render() {
		const { activeIndex } = this.state;
		const { data } = this.props;
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
