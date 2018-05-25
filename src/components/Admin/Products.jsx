import React, { Component } from "react";
import Table from "../common/Table";
import ModalComponent from "../common/Modal";

import { Modal, message } from "antd";
const { confirm } = Modal;

export default class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {
			endpoint: `${this.props.base_url}products`,
			formItem: {
				id: null,
				index: null,
			},
			visible: false,
			columns: [
				{
					title: "Name",
					dataIndex: "Name",
					key: "Name",
				},
				{
					title: "Description",
					dataIndex: "Description",
					key: "Description",
				},
				{
					title: "Price",
					dataIndex: "Price",
					key: "Price",
				},
				{
					title: "Categories_Detail",
					dataIndex: "Categories_Detail.Name",
					key: "Categories_Detail",
				},
				{
					title: "Producer_Detail",
					dataIndex: "Producer_Detail.Name",
					key: "Producer_Detail",
				},
				{
					title: "Quantity",
					dataIndex: "Quantity",
					key: "Quantity",
				},
				{
					title: "Sell_Quantity",
					dataIndex: "Sell_Quantity",
					key: "Sell_Quantity",
				},
				{
					title: "View",
					dataIndex: "View",
					key: "View",
				},
			],
		};
	}

	componentDidMount() {
		this.props.fetchData(`${this.state.endpoint}`);
		this.props.fetchCategories(`${this.props.base_url}categories`);
		this.props.fetchProducers(`${this.props.base_url}producers`);
	}

	handleAdd = () => {
		console.log("handleAdd");
	};

	setFormFields = data => {
		this.formRef.props.form.setFieldsValue({
			Name: data.Name,
			Description: data.Description,
			Price: data.Price,
			Categories_Detail: data.Categories_Detail._id,
			Producer_Detail: data.Producer_Detail._id,
			Quantity: data.Quantity,
			Sell_Quantity: data.Sell_Quantity,
			View: data.View,
		});
	};

	handleMenuClick = (record, e) => {
		const deleteProduct = id => this.props.deleteProduct(id);
		const endpoint = this.state.endpoint;
		const token = localStorage.token;
		if (e.key === "1") {
			this.setState({
				visible: true,
				formItem: {
					id: record._id,
					index: record.key,
				},
			});
			fetch(`${endpoint}/${record._id}`)
				.then(response => response.json())
				.then(data => {
					this.setFormFields(data);
				})
				.catch(err => console.error(err));
		} else if (e.key === "2") {
			confirm({
				title: "Are you sure delete this record?",
				onOk() {
					fetch(`${endpoint}/${record._id}`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					})
						.then(response => response.json())
						.then(data => {
							message.success("Deleted");
						})
						.catch(err => console.error(err));
					deleteProduct(record._id);
				},
			});
		}
	};

	handleEditCancel = e => {
		this.setState({
			visible: false,
		});
	};

	handleEditOK = () => {
		const form = this.formRef.props.form;
		const id = this.state.formItem.id;
		const token = localStorage.token;
		form.validateFields((err, values) => {
			console.log(values);
			if (err) {
				return;
			}
			fetch(`${this.state.endpoint}/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(values),
			})
				.then(response => response.json())
				.then(data => {
					console.log(data);
					this.props.updateProduct(data, this.state.formItem.index);
					message.success("Edited");
				})
				.catch(err => console.error(err));
			form.resetFields();
			this.setState({ visible: false });
		});
	};

	saveFormRef = formRef => {
		this.formRef = formRef;
	};

	render() {
		return (
			<div>
				<Table
					dataSource={this.props.products}
					columns={this.state.columns}
					deleteProduct={this.props.deleteProduct}
					handleAdd={this.handleAdd}
					handleMenuClick={this.handleMenuClick}
					loading={this.props.productsIsLoading}
				/>
				<ModalComponent
					wrappedComponentRef={this.saveFormRef}
					visible={this.state.visible}
					onOk={this.handleEditOK}
					onCancel={this.handleEditCancel}
					titleModal="Update"
					listCategory={this.props.categories}
					listProducer={this.props.producers}
					type={2}
				/>
			</div>
		);
	}
}
