import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

class LoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }
  }

  _onLogin = () => {
    LoginManager.logInWithPermissions(['public_profile','email'])
      .then(result => {
        if (result.error) {
          console.log(`Error: ${result.error}`);
        } else {
          if (result.isCancelled) {
            console.log(`Login is cancelled`);
          } else {
            console.log(`Login successfull`);
            AccessToken.getCurrentAccessToken()
              .then(data => {
                const { accessToken } = data;
                console.log('Token: ', accessToken);
                let graphReq = new GraphRequest('/me', {
                  accessToken,
                  parameters: {
                    fields: {
                      string: 'name,email,birthday,gender,picture.type(large)'
                    }
                  }
                }, (err, result) => {
                  if (err) {
                    console.log(`Get FB Info eror: ${JSON.stringify(err)}`);
                  } else {
                    console.log('INFO: ', result)
                  }
                });

                // do graph request
                let graphRequestManager = new GraphRequestManager();
                graphRequestManager.addRequest(graphReq).start();


              }).catch(err => console.log(`Get Token error: ${err}`))
            this.setState({ loggedIn: true });
          }
        }
      })
  }

  _onLogout = () => {
    LoginManager.logOut();
    this.setState({ loggedIn: false });
    console.log('Logout');
  }

  render() {
    return (
      <Button
        title={!this.state.loggedIn ? 'Login with Facebook' : 'Logout'}
        onPress={!this.state.loggedIn ? this._onLogin : this._onLogout}
      />
    );
  }
}

export default class App extends Component {

  render() {
    return (
      <View>
        <LoginButton />
      </View>
    );
  }
};