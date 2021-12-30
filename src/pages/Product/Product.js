import React, { Component } from 'react';
import * as Realm from 'realm-web';
import BSON from 'bson';

import './Product.css';

class ProductPage extends Component {
  state = { isLoading: true, product: null };

  async componentDidMount() {
    const app = new Realm.App({ id: "myshop-guauv" });
    const mongodb = app.currentUser.mongoClient('mongodb-atlas');
    mongodb
      .db('myFirstDatabase')
      .collection('products')
      .find({_id: new BSON.ObjectId(this.props.match.params.id)})
      .then(productResponse => {
        const product = productResponse[0];
        product._id = product._id.toString();
        product.price = product.price.toString();
        this.setState({ isLoading: false, product: product });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        this.props.onError('Loading product failed. Please try again later');
      });
    }

  render() {
    let content = <p>Is loading...</p>;

    if (!this.state.isLoading && this.state.product) {
      content = (
        <main className="product-page">
          <h1>{this.state.product.name}</h1>
          <h2>{this.state.product.price}</h2>
          <div
            className="product-page__image"
            style={{
              backgroundImage: "url('" + this.state.product.image + "')"
            }}
          />
          <p>{this.state.product.description}</p>
        </main>
      );
    }
    if (!this.state.isLoading && !this.state.product) {
      content = (
        <main>
          <p>Found no product. Try again later.</p>
        </main>
      );
    }
    return content;
  }
}

export default ProductPage;
