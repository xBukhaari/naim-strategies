import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Books from './pages/Books';
import Events from './pages/Events';
import Insights from './pages/Insights';
import Contact from './pages/Contact';
import Article from './pages/Article';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsApp from './components/WhatsApp';
import PageTransition from './components/PageTransition';
import Register from './auth/Register';
import Login from './auth/Login';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import AuthCallback from './auth/AuthCallback';
import ProtectedRoute from './auth/ProtectedRoute';
import DashboardHome from './dashboard/DashboardHome';
import DashboardEvents from './dashboard/DashboardEvents';
import DashboardCertificates from './dashboard/DashboardCertificates';
import DashboardProfile from './dashboard/DashboardProfile';
import EventWorkspace from './dashboard/EventWorkspace';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* DASHBOARD ROUTES */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/events" element={
          <ProtectedRoute>
            <DashboardEvents />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/events/:eventId" element={
          <ProtectedRoute>
            <EventWorkspace />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/certificates" element={
          <ProtectedRoute>
            <DashboardCertificates />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/profile" element={
          <ProtectedRoute>
            <DashboardProfile />
          </ProtectedRoute>
        } />

        {/* PUBLIC ROUTES */}
        <Route path="*" element={
          <>
            <Nav />
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<Books />} />
                <Route path="/events" element={<Events />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/insights/:slug" element={<Article />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </PageTransition>
            <Footer />
            <ScrollToTop />
            <WhatsApp />
          </>
        } />

      </Routes>
    </BrowserRouter>
  );
}