import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/RegisterPage';
import {HomePage} from './pages/HomePage';
import {DashboardPage} from "./pages/DashboartPage";
import {Teams} from "./components/content/Teams";
import {Questions} from "./components/content/Questions";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage /> } >
                    <Route path="teams" element={<Teams />} />
                    <Route path="questions" element={<Questions />} />
                    <Route index element={<Teams />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;