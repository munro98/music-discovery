import React , { Component } from 'react';
import HomePage from './components/HomePage';
import Profile from './components/Profile';
import { Route, Routes} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store from './store';



class App extends Component {


  render () {
  console.log("asd" + this.props.youtube_api);

    return (
      <Provider store={store}>
        <HomePage youtube_api={this.props.youtube_api} lastfm_api={this.props.lastfm_api}/>
      </Provider>
    );
}
}

export default App;
