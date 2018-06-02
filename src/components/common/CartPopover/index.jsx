import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { List, Avatar, Button } from "antd";

export default class CardPopover extends Component {
	render() {
		const carts = this.props.carts;
		const Subtotal = carts.reduce((accumulator, currentValue) => {
			return accumulator + currentValue.Price;
		}, 0);
		return (
			<div className="mini-cart">
				<List
					footer={
						<React.Fragment>
							<b>Subtotal: </b>
							<span style={{ float: "right" }}>
								{Subtotal.formatVND()}
							</span>
							<div style={{ paddingTop: "12px" }}>
								<Button
									type="primary"
									style={{ width: "100%" }}
								>
									CHECKOUT
								</Button>
							</div>
						</React.Fragment>
					}
					itemLayout="horizontal"
					dataSource={carts}
					renderItem={item => (
						<List.Item>
							<List.Item.Meta
								avatar={
									<Avatar
										shape="square"
										size="large"
										src={item.Image}
									/>
								}
								title={
									<Link to={`/product/${item._id}`}>
										{item.Name}
									</Link>
								}
								description={`Quantity: ${item.quantity}`}
							/>
						</List.Item>
					)}
				/>
			</div>
		);
	}
}

CardPopover.propTypes = {
	carts: PropTypes.array.isRequired,
};
