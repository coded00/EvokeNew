import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import SEO from './components/SEO';
import { GlitchLoadingScreen } from './components/ui/loading';

// Lazy load all components for better performance
const Home = React.lazy(() => import('./screens/Home').then(module => ({ default: module.Home })));
const CreateVibe = React.lazy(() => import('./screens/CreateVibe').then(module => ({ default: module.CreateVibe })));
const CreateEvent = React.lazy(() => import('./screens/CreateEvent').then(module => ({ default: module.CreateEvent })));
const EventDetail = React.lazy(() => import('./screens/EventDetail').then(module => ({ default: module.EventDetail })));
const TicketPurchase = React.lazy(() => import('./screens/TicketPurchase').then(module => ({ default: module.TicketPurchase })));
const TicketSuccess = React.lazy(() => import('./screens/TicketSuccess').then(module => ({ default: module.TicketSuccess })));
const Profile = React.lazy(() => import('./screens/Profile').then(module => ({ default: module.Profile })));
const MyTickets = React.lazy(() => import('./screens/MyTickets').then(module => ({ default: module.MyTickets })));
const Login = React.lazy(() => import('./screens/Login').then(module => ({ default: module.Login })));
const SignUp = React.lazy(() => import('./screens/SignUp').then(module => ({ default: module.SignUp })));
const TicketScanner = React.lazy(() => import('./screens/TicketScanner').then(module => ({ default: module.TicketScanner })));
const Support = React.lazy(() => import('./screens/Support').then(module => ({ default: module.Support })));
const Discovery = React.lazy(() => import('./screens/Discovery').then(module => ({ default: module.Discovery })));
const Games = React.lazy(() => import('./screens/Games').then(module => ({ default: module.Games })));
const Messages = React.lazy(() => import('./screens/Messages').then(module => ({ default: module.Messages })));
const EventDashboard = React.lazy(() => import('./screens/EventDashboard').then(module => ({ default: module.EventDashboard })));
const EventManagement = React.lazy(() => import('./screens/EventManagement').then(module => ({ default: module.EventManagement })));
const EventEdit = React.lazy(() => import('./screens/EventEdit').then(module => ({ default: module.EventEdit })));
const Calendar = React.lazy(() => import('./screens/Calendar').then(module => ({ default: module.Calendar })));
const QRTest = React.lazy(() => import('./screens/QRTest').then(module => ({ default: module.QRTest })));

// Enhanced Loading component with glitch effect
const RouteLoading = () => (
  <GlitchLoadingScreen text="Loading page..." />
);

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <SEO />
        <Router>
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home" element={<Home />} />
              <Route path="/create-vibe" element={<CreateVibe />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/event/:eventId" element={<EventDetail />} />
              <Route path="/ticket-purchase/:eventId" element={<TicketPurchase />} />
              <Route path="/ticket-success" element={<TicketSuccess />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-tickets" element={<MyTickets />} />
              <Route path="/ticket-scanner" element={<TicketScanner />} />
              <Route path="/support" element={<Support />} />
              <Route path="/discovery" element={<Discovery />} />
              <Route path="/games" element={<Games />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/event-dashboard/:eventId" element={<EventDashboard />} />
              <Route path="/event-management/:eventId" element={<EventManagement />} />
              <Route path="/event-edit/:eventId" element={<EventEdit />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/qr-test/:eventId?" element={<QRTest />} />
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
);