import React, { Component } from 'react';
import * as  Realm  from 'realm-web';
import BSON from 'bson';

import Products from '../../components/Products/Products';

class ProductsPage extends Component {
  state = { isLoading: true, products: [] };
  componentDidMount() {
    this.fetchData();
  }

  productDeleteHandler = async(productId) => {
    const app = new Realm.App({ id: "myshop-guauv" });
    const mongodb = app.currentUser.mongoClient('mongodb-atlas');
    mongodb
      .db('myFirstDatabase')
      .collection('products')
      .deleteOne({_id: new BSON.ObjectId(productId)})
        .then(result => {
          console.log(result);
          this.fetchData();
        })
        .catch(err => {
          this.props.onError(
          'Deleting the product failed. Please try again later'
        );
        console.log(err);
      });
  };

  fetchData = async () => {
    const app = new Realm.App({ id: "myshop-guauv" });
    const mongodb = app.currentUser.mongoClient('mongodb-atlas');
    mongodb
      .db('myFirstDatabase')
      .collection('products')
      .find()
      .then(products => {
        const transformedProducts = products.map(product => {
          product._id = product._id.toString();
          product.price = product.price.toString();
          return product;
        });
        console.log(products);
        this.setState({ isLoading: false, products: products });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        this.props.onError(
          'Fetching the products failed. Please try again later.'
        );
        console.log(err);
      });
  };

  render() {
    let content = <p>Loading products...</p>;

    if (!this.state.isLoading && this.state.products.length > 0) {
      content = (
        <Products
          products={this.state.products}
          onDeleteProduct={this.productDeleteHandler}
        />
      );
    }
    if (!this.state.isLoading && this.state.products.length === 0) {
      content = <p>Found no products. Try again later.</p>;
    }
    return <main>{content}</main>;
  }
}

export default ProductsPage;
