import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationList from "../components/ApplicationList";
import ApplicationFilters from "../components/ApplicationFilters";
import ApplicationStats from "../components/ApplicationStats";
import { API_URL } from "../config";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("Applied");
    const [location, setLocation] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [jobUrl, setJobUrl] = useState("");
    const [notes, setNotes] = useState("");


    useEffect(() => {
        async function loadDashboard() {
        const token = localStorage.getItem("access_token");

        try {
            // Check who is logged in
            const userResponse = await fetch(
            `${API_URL}/api/auth/me`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            if (!userResponse.ok) {
            localStorage.removeItem("access_token");
            navigate("/login");
            return;
            }

            const userData = await userResponse.json();
            setUser(userData);

            // Get this user's job applications
            const applicationsResponse = await fetch(
            `${API_URL}/api/applications`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            if (!applicationsResponse.ok) {
                setError("Could not load applications");
                return;
            }

            const applicationsData = await applicationsResponse.json();
            setApplications(applicationsData);

        } catch (error) {
            setError("Could not connect to the server");
        }
    }
    loadDashboard();
    }, [navigate]);

    async function handleAddApplication(event) {
        event.preventDefault();

        if (editingId !== null) {
            const token = localStorage.getItem("access_token");

            try {
                const response = await fetch(
                `${API_URL}/api/applications/${editingId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        company,
                        role,
                        status,
                        location,
                        job_url: jobUrl,
                        notes: notes,
                    }),
                }
                );

                if (!response.ok) {
                    setError("Could not update application");
                    return;
                }

                const updatedApplication = await response.json();

                setApplications((currentApplications) =>
                currentApplications.map((application) =>
                    application.id === editingId
                    ? updatedApplication
                    : application
                )
                );

                setEditingId(null);
                setCompany("");
                setRole("");
                setStatus("Applied");
                setLocation("");
                setJobUrl("");
                setNotes("");

                return;
            } catch (error) {
                setError("Could not connect to the server");
                return;
            }
        }

        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch(
            `${API_URL}/api/applications`,
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    company,
                    role,
                    status,
                    location,
                    job_url: jobUrl,
                    notes: notes,
                }),
            }
            );

            if (!response.ok) {
            setError("Could not add application");
            return;
            }

            const newApplication = await response.json();

            setApplications((currentApplications) => 
                [...currentApplications,newApplication, ]);

            setCompany("");
            setRole("");
            setStatus("Applied");
            setLocation("");
            setJobUrl("");
            setNotes("");
        } catch (error) {
            setError("Could not connect to the server");
        }
    }

    async function handleDeleteApplication(applicationId) {
        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch(
            `${API_URL}/api/applications/${applicationId}`,
            {
                method: "DELETE",
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            if (!response.ok) {
            setError("Could not delete application");
            return;
            }

            setApplications((currentApplications) =>
            currentApplications.filter(
                (application) => application.id !== applicationId
            )
            );
        } catch (error) {
            setError("Could not connect to the server");
        }
    }


    function handleEditApplication(application) {
        setEditingId(application.id);
        setCompany(application.company);
        setRole(application.role);
        setStatus(application.status);
        setLocation(application.location || "");
        setJobUrl(application.job_url || "");
        setNotes(application.notes || "");
    }

    function handleCancelEdit() {
        setEditingId(null);
        setCompany("");
        setRole("");
        setStatus("Applied");
        setLocation("");
        setJobUrl("");
        setNotes("");
    }

    const filteredApplications = applications.filter((application) => {
        const matchesSearch = application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            application.role.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || application.status === statusFilter;

        return matchesSearch && matchesStatus;
    });
    
    if (error) {
        return <p>{error}</p>;
    }

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
            <div>
                <h1>CareerFlow</h1>
                <p>Welcome, {user.email}</p>
            </div>

            <button
                className="logout-button"
                onClick={() => {
                localStorage.removeItem("access_token");
                navigate("/login");
                }}
            >
                Logout
            </button>
            </header>

            <main className="dashboard-content">
                <ApplicationStats applications={applications}/>
                <ApplicationForm
                    company={company}
                    setCompany={setCompany}
                    role={role}
                    setRole={setRole}
                    status={status}
                    setStatus={setStatus}
                    location={location}
                    setLocation={setLocation}
                    jobUrl={jobUrl}
                    setJobUrl={setJobUrl}
                    notes={notes}
                    setNotes={setNotes}
                    editingId={editingId}
                    handleSubmit={handleAddApplication}
                    handleCancelEdit={handleCancelEdit}
                    
                />

                <ApplicationFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                <ApplicationList
                    applications={filteredApplications}
                    handleEditApplication={handleEditApplication}
                    handleDeleteApplication={handleDeleteApplication}
            />
            </main>
        </div>
    );
}

export default Dashboard;