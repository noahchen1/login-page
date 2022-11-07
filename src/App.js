import './App.css';
import Register from './components/Register';
import Login from './components/Login'
import RequireAuth from './components/requireAuth';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Routes>
      <Route element={<RequireAuth allowedRoles={[2001]}/>}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
