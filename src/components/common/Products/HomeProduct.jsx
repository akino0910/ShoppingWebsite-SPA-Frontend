import React, { Component, Fragment } from "react";
import Card from "../card";
import { List } from "antd";

export default class HomeProduct extends Component {
	render() {
		return (
			<List
				pagination={{
					showQuickJumper: true,
					onChange: page => {
						console.log(page);
					},
					pageSize: 8,
				}}
				grid={{
					gutter: 16,
					xs: 1,
					sm: 2,
					md: 4,
					lg: 4,
					xl: 4,
					xxl: 4,
				}}
				dataSource={this.props.products}
				renderItem={card => (
					<List.Item>
						<Card match={this.props.match} infoCard={card} />
					</List.Item>
				)}
			/>
		);
	}
}