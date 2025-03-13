import './App.css';
import { Outlet, useLocation } from "react-router-dom";
import Navigation from './pages/Auth/Navigation.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./redux/store"; 
import { Route, RouterProvider, createRoutesFromElements, createBrowserRouter } from "react-router-dom"; 
import ReactDOM from "react-dom/client";



function App() {
  const location = useLocation(); // Get current route

  // Hide Navbar on Login/Register pages
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
  <Provider store={store}>  
  <ToastContainer />
  {!shouldHideNavbar && <Navigation />} {/* Conditionally render Navigation */}
  <main className=''>
  <Outlet/>
  </main>
  </Provider>
  </>
  );
}


export default App;
