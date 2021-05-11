import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';

// User Components
import NavBar from './sources/user/common/NavBar.jsx'
import SideBar from './sources/user/common/SideBar.jsx'
import Footer from './sources/user/common/Footer.jsx'
import Home from './sources/user/Home.jsx'
import Cart from './sources/user/Cart.jsx'
import Signup from './sources/user/common/Signup.jsx'
import Orders from './sources/user/Orders.jsx'
import Payment from './sources/user/payments/Payment.jsx'
import ProductDetail from './sources/user/ProductDetail.jsx'
import Category from './sources/user/Category.jsx'
import Profile from './sources/user/Profile.jsx';
import Search from './sources/user/Search.jsx';
import ShortLoading from './sources/user/ShortLoading.jsx';

// Vendor Components
import VHome from './sources/vendor/VHome.jsx'
import VNavbar from './sources/vendor/common/VNavbar.jsx'
import VSidebar from './sources/vendor/common/VSidebar.jsx'
import VLogin from './sources/vendor/VLogin.jsx'
import VProfile from './sources/vendor/VProfile.jsx'
import VProduct from './sources/vendor/VProduct.jsx'
import VAttributes from './sources/vendor/productComponents/VAttributes.jsx'
import VManage from './sources/vendor/VManage.jsx'
import VOrders from './sources/vendor/VOrders.jsx'
import VSlider from './sources/vendor/VSlider.jsx'

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path='/vendor'>
            <Switch>
              <Route path='/vendor/login' exact render={props => <VLogin {...props} />} />
              <Route>
                <VNavbar />
                <VSidebar />
                <Switch>
                  <Route path='/vendor' exact render={props => <VHome {...props} />} />
                  <Route path='/vendor/dashboard' exact render={props => <VHome {...props} />} />
                  <Route path='/vendor/profile' exact render={props => <VProfile {...props} />} />
                  <Route path='/vendor/product' exact render={props => <VProduct {...props} />} />
                  <Route path='/vendor/product/:id' exact render={props => <VProduct {...props} />} />
                  <Route path='/vendor/attr' exact render={props => <VAttributes {...props} />} />
                  <Route path='/vendor/manage' exact render={props => <VManage {...props} />} />
                  <Route path='/vendor/orders' exact render={props => <VOrders {...props} />} />
                  <Route path='/vendor/general/sliders' exact render={props => <VSlider {...props} />} />
                </Switch>
              </Route>
            </Switch>
          </Route>
          <Route path='/'>
            <ShortLoading />
            <NavBar />
            <Signup />
            <SideBar />
            <Switch>
              <Route path='/' exact render={props => <Home {...props} />} />
              <Route path='/search/:searchItem' exact render={props => <Search {...props} />} />
              <Route path='/profile' exact render={props => <Profile {...props} />} />
              <Route path='/cart' exact render={props => <Cart {...props} />} />
              <Route path='/orders' exact render={props => <Orders {...props} />} />
              <Route path='/payment/:orderId' exact render={props => <Payment {...props} />} />
              <Route path='/item/info/:productId' exact render={props => <ProductDetail {...props} />} />
              <Route path='/c/:cat/:subCat' exact render={props => <Category {...props} />} />
            </Switch>
            <Footer />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
