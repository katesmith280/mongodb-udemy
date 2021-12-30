import React, { Component } from 'react';
import * as Realm from 'realm-web';

import './ConfirmAccount.css';

class AuthPage extends Component {
  async componentDidMount() {
    const queryUrl = window.location.search;
    const queryParams = new URLSearchParams(queryUrl);
    const token = queryParams.get('token');
    const tokenId = queryParams.get('tokenId');
    const app = new Realm.App({ id: "myshop-guauv" })
    await app.emailPasswordAuth.confirmUser(token, tokenId)
      .then(() => {
        console.log('redirect to home.')
        this.props.history.replace('/');
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <main className="confirm-account-page">
        <p>Confirming Account...</p>
      </main>
    );
  }
}
export default AuthPage;
