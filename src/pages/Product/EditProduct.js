import React, { Component } from 'react';
import * as  Realm  from 'realm-web';
import BSON from 'bson';

import './EditProduct.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';


class ProductEditPage extends Component {
  state = {
    isLoading: true,
    title: '',
    price: '',
    imageUrl: '',
    description: ''
  };

  async componentDidMount() {
    // Will be "edit" or "add"
    if (this.props.match.params.mode === 'edit') {
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
          this.setState({
            isLoading: false,
            title: product.name,
            price: product.price,
            imageUrl: product.image,
            description: product.description
          });
        })
        .catch(err => {
          this.setState({ isLoading: false });
          this.props.onError('Loading product failed. Please try again later');
        });
    } else {
      this.setState({ isLoading: false });
    }
  }

  editProductHandler = async(event) => {
    event.preventDefault();
    if (
      this.state.title.trim() === '' ||
      this.state.price.trim() === '' ||
      this.state.imageUrl.trim() === '' ||
      this.state.description.trim() === ''
    ) {
      return;
    }
    this.setState({ isLoading: true });
    const productData = {
      name: this.state.title,
      price: BSON.Decimal128.fromString(this.state.price.toString()),
      image: this.state.imageUrl,
      description: this.state.description
    };
    
    let request;
    const app = new Realm.App({ id: "myshop-guauv" });
    const mongodb = app.currentUser.mongoClient('mongodb-atlas');
    if (this.props.match.params.mode === 'edit') {
      request = mongodb
        .db('myFirstDatabase')
        .collection('products')
        .updateOne({_id: new BSON.ObjectID(this.props.match.params.id) }, productData);
    } else {
      request = mongodb
        .db('myFirstDatabase')
        .collection('products')
        .insertOne(productData);
    }
    request
      .then(result => {
        console.log(result);
        this.setState({ isLoading: false });
        this.props.history.replace('/products');
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
        this.props.onError(
          'Editing or adding the product failed. Please try again later'
        );
      });
  };

  inputChangeHandler = (event, input) => {
    this.setState({ [input]: event.target.value });
  };

  render() {
    let content = (
      <form className="edit-product__form" onSubmit={this.editProductHandler}>
        <Input
          label="Title"
          config={{ type: 'text', value: this.state.title }}
          onChange={event => this.inputChangeHandler(event, 'title')}
        />
        <Input
          label="Price"
          config={{ type: 'number', value: this.state.price }}
          onChange={event => this.inputChangeHandler(event, 'price')}
        />
        <Input
          label="Image URL"
          config={{ type: 'text', value: this.state.imageUrl }}
          onChange={event => this.inputChangeHandler(event, 'imageUrl')}
        />
        <Input
          label="Description"
          elType="textarea"
          config={{ rows: '5', value: this.state.description }}
          onChange={event => this.inputChangeHandler(event, 'description')}
        />
        <Button type="submit">
          {this.props.match.params.mode === 'add'
            ? 'Create Product'
            : 'Update Product'}
        </Button>
      </form>
    );
    if (this.state.isLoading) {
      content = <p>Is loading...</p>;
    }
    return <main>{content}</main>;
  }
}

export default ProductEditPage;
