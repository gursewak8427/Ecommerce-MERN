import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import Keys from './config/config.json'
import { isAuth } from './helpers/auth'

import NavBar from './sources/user/common/NavBar'
import SideBar from './sources/user/common/SideBar'
import Footer from './sources/user/common/Footer'
import Home from './sources/user/Home'
import Cart from './sources/user/Cart'
import Signup from './sources/user/common/Signup';
import Orders from './sources/user/Orders';
import Payment from './sources/user/payments/Payment';
import ProductDetail from './sources/user/ProductDetail';


// Vendor
import VHome from './sources/vendor/VHome'
import VNavbar from './sources/vendor/common/VNavbar'
import VSidebar from './sources/vendor/common/VSidebar'
import VLogin from './sources/vendor/VLogin'
import VProfile from './sources/vendor/VProfile'
import VProduct from './sources/vendor/VProduct';
import VAttributes from './sources/vendor/productComponents/VAttributes';
import VManage from './sources/vendor/VManage';
import VOrders from './sources/vendor/VOrders';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path='/vendor/login' exact render={props => <VLogin {...props} />} />
          <Route path='/vendor'>
              <VNavbar />
              <VSidebar />
              <Route path='/vendor' exact render={props => <VHome {...props} />} />
              <Route path='/vendor/profile' exact render={props => <VProfile {...props} />} />
              <Route path='/vendor/product' exact render={props => <VProduct {...props} />} />
              <Route path='/vendor/product/:id' exact render={props => <VProduct {...props} />} />
              <Route path='/vendor/attr' exact render={props => <VAttributes {...props} />} />
              <Route path='/vendor/manage' exact render={props => <VManage {...props} />} />
              <Route path='/vendor/orders' exact render={props => <VOrders {...props} />} />
          </Route>
          <Route path='/'> 
              <NavBar />
              <Signup />
              <SideBar />
              <Route path='/' exact render={props => <Home {...props} />} />
              <Route path='/cart' exact render={props => <Cart {...props} />} />
              <Route path='/orders' exact render={props => <Orders {...props} />} />
              <Route path='/payment/:orderId' exact render={props => <Payment {...props} />} />
              <Route path='/item/info/:productId/' exact render={props => <ProductDetail {...props} />} />
              <Footer />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
