import { Suspense, useContext, useEffect, useState } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import SignIn from "./components/users/SignIn";
import Register from "./components/users/Register";
import ForgotPassword from "./components/users/ForgotPassword";
import Dashboard from "./components/admin/dashboard";
// Bootstrap is now imported in main.jsx before Tailwind to ensure Tailwind overrides
// import routes from "tempo-routes";
import AuthContext from "./contexts/AuthContext";

function App() {
  const {auth, setAuth} = useContext(AuthContext);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsLoading(false);
    }
  }, [mounted]);


  if (!isLoading) return (
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
          <Route path="/admin" element={auth.isLoggedIn ? <Dashboard /> : <SignIn />} />
          <Route path="/admin/dashboard" element={auth.isLoggedIn ? <Dashboard /> : <SignIn />} />
            <Route path="/signin" element={!auth.isLoggedIn ? <SignIn /> : <Home />} />
            <Route path="/register" element={!auth.isLoggedIn ? <Register /> : <Home />} />
            <Route path="/forgot-password" element={!auth.isLoggedIn ? <ForgotPassword /> : <Home />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
          {/* {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)} */}
        </>
      </Suspense>

  );
}

export default App;

