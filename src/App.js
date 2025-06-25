import { useContext, useEffect } from 'react';
import Cookies from 'js-cookie'
import { AuthContext } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import SignInPage from './pages/SignInPage';
import AdminEditorSignInPage from './pages/AdminEditorSignInPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import StudentChat from './pages/StudentChat';
import StudentPaymentsPage from './pages/StudentPaymentsPage';
import StudentMyOrdersPage from './pages/StudentMyOrdersPage';
import MyWritersPage from './pages/MyWritersPage';
import PostNewOrderPage from './pages/PostNewOrderPage';
import StudentSettingsPage from './pages/StudentSettingsPage';
import PlaceOrder from './pages/PlaceOrderStep1';
import PlaceOrderStep2 from './pages/PlaceOrderStep2';
import PlaceOrderStep3 from './pages/PlaceOrderStep3';
import PlaceOrderStep4 from './pages/PlaceOrderStep4';
import Dashboard from './components/writer/Dashboard';
import BidOrders from './components/writer/BidOrders';
import WritersMyOrdersPage from './pages/WriterMyOrdersPage';
import WriterProfile from './pages/WriterProfile';
import WriterPayments from './pages/WriterPayment';
import WriterCreateAccountPage from './pages/WriterCreateAccountPage';
import WriterChat from './pages/WriterChat';
import EditorDashboardPage from './pages/EditorDashboard';
import EditorAssignedOrdersPage from './pages/EditorAssignedOrdersPage';
import EditorWritersPage from './pages/EditorWritersPage';
import EditorChatPage from './pages/EditorChatPage';
import AdminAllOrdersPage from './pages/AdminAllOrdersPage';
import AdminEditorsPage from './pages/AdminEditorsPage';
import AdminWritersPage from './pages/AdminWritersPage';
import AdminChatPage from './pages/AdminChatPage';
import OverDueTasksPage from './pages/OverdueTasksPage';
import StudentsPage from './pages/StudentsPage';
import AdminDashboardPage from './pages/AdminDashboard';
import FinancialReportsPage from './pages/FinancialReportsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import WriterProfilePage from './pages/WriterProfilePage';
import EditorProfilePage from './pages/EditorProfilePage';
import NotFound from './components/NotFound';
import { Box, CircularProgress } from '@mui/material';
import ScrollToTop from './components/ScrollToTop';
import { ConductGuidelines, RefundPolicy, TermsAndPrivacy } from './components/footerText';
import StudentMyFilesPage from './pages/StudentMyFilesPage';
import WriterMyFilesPage from './pages/WriterMyFilesPage';
import EditorMyFilesPage from './pages/EditorMyFilesPage';
import WriterSignInPage from './pages/WriterSignInPage';
import CircularProgressLoading from './components/CircularProgress';

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      
       <CircularProgressLoading/>
      
    );
  }

  if (!user) {
    // Redirect to login, preserving the intended route
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to home if user role is not allowed
    return <Navigate to="/" replace />;
  }

  return children;
};

// Separate component for routing logic
const AppRoutes = () => {

  const navigate = useNavigate()
  const { user, loading,isLoggedOut } = useContext(AuthContext);
  const location = useLocation()

  const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  console.log("All Cookies",value)
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return undefined;
};
  
  useEffect(()=>{
  const token = getCookie("auth_token")

    console.log("Token",token)
  if(!token && (location.pathname!="/moderators/login" && location.pathname!="/" && location.pathname!="/writer/login")){
    navigate("/login")
  }
    console.log("Is Logged Out",isLoggedOut)
  },[isLoggedOut,location.pathname])

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user?.role === 'Writer' ? <Navigate to="/writer/dashboard" /> :user?.role ==="Editor"?<Navigate to="/editor/dashboard"/>:<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/moderators/login" element={<AdminEditorSignInPage />} />
        <Route path="/writer/login" element={<WriterSignInPage />} />
        <Route path="/writer/create-account" element={<WriterCreateAccountPage />} />
        <Route path="/codeofconduct" element={<ConductGuidelines />} />
        <Route path="/refundpolicy" element={<RefundPolicy />} />
        <Route path="/termsandconditions" element={<TermsAndPrivacy />} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/chat"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/payment-history"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentPaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/myorders"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentMyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/my-writers"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <MyWritersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/post-neworder"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <PostNewOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/settings"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/placeorder/step/1"
          element={
            
              <PlaceOrder />
          
          }
        />
        <Route
          path="/student/placeorder/step/2"
          element={
            
              <PlaceOrderStep2 />
          
          }
        />
        <Route
          path="/student/placeorder/step/3"
          element={
            
              <PlaceOrderStep3 />
            
          }
        />
        <Route
          path="/student/placeorder/step/4"
          element={
            
              <PlaceOrderStep4 />
            
          }
        />
        <Route
          path="/student/my-files"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentMyFilesPage />
            </ProtectedRoute>
          }
        />

        {/* Writer Routes */}
        <Route
          path="/writer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Writer']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/writer/bid-orders"
          element={
            <ProtectedRoute allowedRoles={['Writer']}>
              <BidOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/writer/my-orders"
          element={
            <ProtectedRoute allowedRoles={['Writer']}>
              <WritersMyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/writer/my-profile"
          element={
            <ProtectedRoute allowedRoles={['Writer']}>
              <WriterProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/writer/payment-history"
          element={
            <ProtectedRoute allowedRoles={['Writer']}>
              <WriterPayments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/writer/chat"
          element={
            <ProtectedRoute allowedRoles={['Writer']}>
              <WriterChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/writer/my-files"
          element={
            <ProtectedRoute allowedRoles={['Writer']}>
              <WriterMyFilesPage />
            </ProtectedRoute>
          }
        />

        {/* Editor Routes */}
        <Route
          path="/editor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Editor']}>
              <EditorDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/assigned-orders"
          element={
            <ProtectedRoute allowedRoles={['Editor']}>
              <EditorAssignedOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/my-writers"
          element={
            <ProtectedRoute allowedRoles={['Editor']}>
              <EditorWritersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/chat"
          element={
            <ProtectedRoute allowedRoles={['Editor']}>
              <EditorChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/my-files"
          element={
            <ProtectedRoute allowedRoles={['Editor']}>
              <EditorMyFilesPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/all-orders"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminAllOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/editors"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminEditorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/writers"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminWritersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/chat"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/overdue-tasks"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <OverDueTasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/financial-reports"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <FinancialReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/writer-profile/:id"
          element={
            <ProtectedRoute allowedRoles={['Admin','Student']}>
              <WriterProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/editor-profile/:id"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <EditorProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

// Main App component
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;