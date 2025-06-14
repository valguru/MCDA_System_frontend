import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/RegisterPage';
import {HomePage} from './pages/HomePage';
import {DashboardPage} from "./pages/DashboartPage";
import {TeamsList} from "./components/content/team/TeamsList";
import {CreateTeam} from "./components/content/team/CreateTeam";
import {Team} from "./components/content/team/Team";
import {Questions} from "./components/content/question/Questions";
import {CreateQuestion} from "./components/content/question/CreateQuestion";
import {Invitations} from "./components/content/invitation/Invitations";
import {Profile} from "./components/content/profile/Profile";
import {QuestionPreview} from "./components/content/question/QuestionPreview";
import {QuestionDecisionView} from "./components/content/question/QuestionDecisionView";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/dashboard" element={<DashboardPage/>}>
                    <Route path="teams" element={<TeamsList/>}/>
                    <Route path="teams/create" element={<CreateTeam/>}/>
                    <Route path="teams/:id" element={<Team/>}/>
                    <Route path="teams/:id/question/create" element={<CreateQuestion/>}/>
                    <Route path="teams/:teamId/question/:questionId" element={<QuestionPreview/>}/>
                    <Route path="teams/:teamId/question/:questionId/view" element={<QuestionDecisionView />} />
                    <Route path="questions" element={<Questions/>}/>
                    <Route path="invitations" element={<Invitations/>}/>
                    <Route path="profile" element={<Profile/>}/>
                    <Route index element={<TeamsList/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
