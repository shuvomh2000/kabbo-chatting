import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css"
import App from './App';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './components/Reducer'

const store = createStore(rootReducer)
ReactDOM.render(
  <Provider store= {store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals