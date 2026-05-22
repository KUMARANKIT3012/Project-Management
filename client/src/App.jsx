import { Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";

import Chatbot from "./components/Chatbot";

const App = () => {

    const { isSignedIn } = useUser();

    return (
        <>
            <Toaster />

            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="team" element={<Team />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="projectsDetail" element={<ProjectDetails />} />
                    <Route path="taskDetails" element={<TaskDetails />} />
                </Route>
            </Routes>

            {isSignedIn && <Chatbot />}
        </>
    );
};

export default App;