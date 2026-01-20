import { Routes, Route } from "react-router-dom";
import CustomCursor from "./components/CustomCursor"; 

import Landing from "./pages/Landing";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import RecommendationForm from "./pages/RecommendationForm";
import RecommendationResult from "./pages/RecommendationResult";
import ProtectedRoute from "./auth/ProtectedRoute";
import GeneratingPlan from "./pages/GeneratingPlan";

export default function App() {
  return (
    <>
      <CustomCursor /> 
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommend"
          element={
            <ProtectedRoute>
              <RecommendationForm />
            </ProtectedRoute>
          }
        />

        <Route path="/generating" element={<GeneratingPlan />} />

        <Route
          path="/recommendation"
          element={
            <ProtectedRoute>
              <RecommendationResult />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}