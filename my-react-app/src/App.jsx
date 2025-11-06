import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import ServicesPage from './components/ServicesPage'
import ReportFound from './components/ReportFound'
import NationalID from './components/NationalID'
import NationalIDForm from './components/NationalIDForm'
import NationalIDPayment from './components/NationalIDPayment'
import Passport from './components/Passport'
import PassportForm from './components/PassportForm'
import PassportPayment from './components/PassportPayment'
import VehiclePermit from './components/VehiclePermit'
import VehiclePermitForm from './components/VehiclePermitForm'
import VehiclePermitPayment from './components/VehiclePermitPayment'
import LandDocuments from './components/LandDocuments'
import LandDocumentsForm from './components/LandDocumentsForm'
import LandDocumentsPayment from './components/LandDocumentsPayment'
import ReconcileForm from './components/ReconcileForm'
import ReconciliationCenter from './components/ReconciliationCenter'
// Found components
import FoundServicesPage from './components/FoundServicesPage'
import FoundNationalIDForm from './components/FoundNationalIDForm'
import FoundPassportForm from './components/FoundPassportForm'
import FoundVehiclePermitForm from './components/FoundVehiclePermitForm'
import FoundLandDocumentsForm from './components/FoundLandDocumentsForm'
// Login component
import LoginForm from './components/LoginForm'
// Test component
import BackendTest from './components/BackendTest'
// Test ReconcileStore component
import TestReconcileStore from './components/TestReconcileStore'
// Total Reports component
import TotalReports from './components/TotalReports'
// Welcome Page component
import WelcomePage from './components/WelcomePage'
// Choice Page component
import ChoicePage from './components/ChoicePage'
// Individual choice components
import LostPage from './components/LostPage'
import FoundPage from './components/FoundPage'
import SeeEverythingPage from './components/SeeEverythingPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/choice" element={<ChoicePage />} />
        <Route path="/lost" element={<LostPage />} />
        <Route path="/found" element={<FoundPage />} />
        <Route path="/see-everything" element={<SeeEverythingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/report-found" element={<ReportFound />} />
        <Route path="/found-services" element={<FoundServicesPage />} />
        <Route path="/found-national-id" element={<FoundNationalIDForm />} />
        <Route path="/found-passport" element={<FoundPassportForm />} />
        <Route path="/found-vehicle-permit" element={<FoundVehiclePermitForm />} />
        <Route path="/found-land-documents" element={<FoundLandDocumentsForm />} />
        <Route path="/national-id" element={<NationalID />} />
        <Route path="/national-id-form" element={<NationalIDForm />} />
        <Route path="/national-id-payment" element={<NationalIDPayment />} />
        <Route path="/passport" element={<Passport />} />
        <Route path="/passport-form" element={<PassportForm />} />
        <Route path="/passport-payment" element={<PassportPayment />} />
        <Route path="/vehicle-permit" element={<VehiclePermit />} />
        <Route path="/vehicle-permit-form" element={<VehiclePermitForm />} />
        <Route path="/vehicle-permit-payment" element={<VehiclePermitPayment />} />
        <Route path="/land-documents" element={<LandDocuments />} />
        <Route path="/land-documents-form" element={<LandDocumentsForm />} />
        <Route path="/land-documents-payment" element={<LandDocumentsPayment />} />
        <Route path="/reconcile" element={<ReconcileForm />} />
        <Route path="/reconciliation" element={<ReconciliationCenter />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/backend-test" element={<BackendTest />} />
        <Route path="/test-reconcile-store" element={<TestReconcileStore />} />
        <Route path="/total-reports" element={<TotalReports />} />
      </Routes>
    </Router>
  )
}

export default App