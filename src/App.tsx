import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/RegisterPage';
import {HomePage} from './pages/HomePage';
import {DashboardPage} from "./pages/DashboartPage";
import {Teams} from "./components/content/team/Teams";
import {Questions} from "./components/content/Questions";
import {CreateTeam} from "./components/content/team/CreateTeam"
import {Invitations} from "./components/content/invitation/Invitations";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/dashboard" element={<DashboardPage/>}>
                    <Route path="teams" element={<Teams/>}/>
                    <Route path="teams/create" element={<CreateTeam/>}/>
                    <Route path="questions" element={<Questions/>}/>
                    <Route path="invitations" element={<Invitations/>}/>
                    <Route index element={<Teams/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;