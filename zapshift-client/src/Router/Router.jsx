import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayOut"
import Home from "../Pages/Home/Home";
import AuthLayout from "../AuthLayout/AuthLayout";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import Login from "../Login/Login";
import Register from "../Pages/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import SendParcel from "../SendParcel/SendParcel";

import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Myparcels from "../Dashboard/MyParcels/Myparcels";
import Payment from "../Dashboard/Payment/Payment";
import PaymentHistory from "../Dashboard/PaymentHistory/PaymentHistory";
import Track from "../Dashboard/Track/Track";
import BeARider from "../BeARider/BeARider";
import PendingRider from "../Dashboard/PendingRider/PendingRider";
import ActiveRider from "../Dashboard/ActiveRider/ActiveRider";
import MakeAdmin from "../Dashboard/MakeAdmin/MakeAdmin";
import AdminRoute from "../PrivateRoute/AdminRoute";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AssignRider from "../Dashboard/AssignRider/AssignRider";
import RiderRoute from "../PrivateRoute/RiderRoute";
import RiderTasks from "../Dashboard/RiderTasks/RiderTasks";
import CompletedDelivery from "../Dashboard/CompletedDelivery/CompletedDelivery";
import MyEarnings from "../Dashboard/MyEarnings/MyEarnings";
import ParcelTracking from "../Dashboard/ParcelTracking/ParcelTracking ";
import Dashboard from "../Dashboard/UserDashboard/Dashboard";
const Router = createBrowserRouter(
    [
        {
            path: "/",
            Component: RootLayout,
            children: [
                {
                   index: true,
                   Component: Home
                },
                {
                   path: 'coverage',
                   Component: Coverage,
                   loader: () => fetch('./FinWarehouses.json')
                },
                {
                   path: 'sendParcel',
                   element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>,
                   loader: () => fetch('./FinWarehouses.json')
                   
                },
                {
                   path: 'beARider',
                   element: <PrivateRoute><BeARider></BeARider></PrivateRoute>,
                   loader: () => fetch('./FinWarehouses.json')
                   
                }
            ]
        },

        {
            path: "/",
            Component: AuthLayout,
            children: [
                {
                    path: "login",
                    Component: Login
                },
                {
                    path: "register",
                    Component: Register
                },
            ]
        },

        {
            path: '/dashboard',
            element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
            children: [

                {
                    index: true,
                    Component: Dashboard
                },
                {
                    path: 'myparcel',
                    Component: Myparcels
                },
                {
                    path: 'payment/:parcelId',
                    Component: Payment
                },
                {
                    path: 'paymenthistory',
                    Component: PaymentHistory
                },
                {
                    path: 'parcelTracking',
                    Component: ParcelTracking
                },
                {
                    path: 'pendingRider',
                    Component: PendingRider
                },
                
                {
                    path: 'activeRider',
                    element: <AdminRoute><ActiveRider></ActiveRider></AdminRoute>
                },
                {
                    path: 'assignRider',
                    element: <AdminRoute><AssignRider></AssignRider></AdminRoute>
                },
                {
                    path: 'myTasks',
                    element: <RiderRoute><RiderTasks></RiderTasks></RiderRoute>
                },
                {
                    path: 'completeDelivery',
                    element: <RiderRoute><CompletedDelivery></CompletedDelivery></RiderRoute>
                },
                {
                    path: 'myEarnings',
                    element: <RiderRoute><MyEarnings></MyEarnings></RiderRoute>
                },
                {
                    path: 'makeAdmin',
                    Component: MakeAdmin
                },
                {
                    path:'forbidden',
                    Component:Forbidden
                }
            ]
        }
    ]   
)

export default Router;
