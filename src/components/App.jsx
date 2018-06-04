import React, { Component, Fragment } from "react";
import NormalNavigation from "./common/Navigation/NormalNavigation";
import RouteProduct from "../routes/products";

import { Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb, message, Row, Col, Checkbox } from "antd";

const { Content, Footer } = Layout;

const breadcrumbNameMap = {
	"/product": "Product List",
};

let location, pathSnippets, extraBreadcrumbItems, breadcrumbItems;

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isDark: false,
		};
	}
	componentDidMount() {
		this.props.fetchProducts(`${this.props.base_url}products`);
		this.props.fetchCategories(`${this.props.base_url}categories`);
		this.props.fetchProducers(`${this.props.base_url}producers`);
	}

	handleMenuClick = e => {
		switch (e.key) {
			case "1":
				message.info(`Clicked ${e.item.props.children}`);
				break;
			case "3":
				this.props.logoutUser();
				message.success("Logout success");
				break;
			default:
				console.log(`Clicked ${e.item.props.children}`);
				break;
		}
	};

	menu = (
		<Menu onClick={this.handleMenuClick}>
			<Menu.Item key="1">About</Menu.Item>
			<Menu.Item key="2">
				<Link to="/admin">Dashboard</Link>
			</Menu.Item>
			<Menu.Item key="3">Logout</Menu.Item>
		</Menu>
	);

	UNSAFE_componentWillUpdate(props) {
		location = props.history.location;

		pathSnippets = location.pathname.split("/").filter(i => i);

		extraBreadcrumbItems = pathSnippets.map((_, index) => {
			const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
			if (index === pathSnippets.length - 1) {
				return (
					<Breadcrumb.Item key={url}>
						{pathSnippets[index] === "product"
							? "Product List"
							: pathSnippets[index]}
					</Breadcrumb.Item>
				);
			}
			return (
				<Breadcrumb.Item key={url}>
					<Link to={url}>{breadcrumbNameMap[url]}</Link>
				</Breadcrumb.Item>
			);
		});
		breadcrumbItems = [
			<Breadcrumb.Item key="home">
				{extraBreadcrumbItems.length === 0 ? (
					"Home"
				) : (
					<Link to="/">Home</Link>
				)}
			</Breadcrumb.Item>,
			...extraBreadcrumbItems,
		];
	}

	render() {
		let products = this.props.products;
		let checkboxOption = this.props.categories.map(element => {
			return {
				label: element.Name,
				value: element._id,
			};
		});
		const checkboxStyle = {
			display: "block",
			height: "30px",
			lineHeight: "30px",
			marginLeft: "8px",
		};
		return (
			<Fragment>
				<Layout>
					<NormalNavigation
						menu={this.menu}
						handleMenuClick={this.handleMenuClick}
						isAuthenticated={this.props.isAuthenticated}
						isDark={this.state.isDark}
						carts={this.props.carts}
						deleteCart={this.props.deleteCart}
					/>
					<Row
						style={{
							padding: "0 20px",
							marginTop: 64,
						}}
					>
						<Col
							style={{
								padding: "20px 20px 0px 0px",
							}}
							span={4}
						>
							<Layout
								style={{
									background: "#fff",
								}}
							>
								<Content>
									<h3
										style={{
											margin: "8px 0 5px 8px",
											fontWeight: "bold",
										}}
									>
										Category
									</h3>
									{checkboxOption.map(element => (
										<Checkbox
											style={checkboxStyle}
											key={element.value}
										>
											{element.label}
										</Checkbox>
									))}
								</Content>
							</Layout>
						</Col>
						<Col span={20}>
							<Layout>
								<Content>
									<Breadcrumb style={{ margin: "16px 0" }}>
										{breadcrumbItems}
									</Breadcrumb>

									<div
										style={{
											background: "#fff",
											padding: 24,
											minHeight: 380,
										}}
									>
										<RouteProduct products={products} />
									</div>
								</Content>
							</Layout>
						</Col>
					</Row>

					<Footer style={{ textAlign: "center" }}>
						Ant Design ©2016 Created by Ant UED
					</Footer>
				</Layout>
			</Fragment>
		);
	}
}
