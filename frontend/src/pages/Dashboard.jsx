import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationList from "../components/ApplicationList";
import ApplicationFilters from "../components/ApplicationFilters";
import ApplicationStats from "../components/ApplicationStats";
import { API_URL } from "../config";
import {LogOut, Plus, Trash2 } from "lucide-react";
import jobHuntIllustration from "../assets/job-hunt.svg";

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
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [applicationToDelete, setApplicationToDelete] = useState(null);


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
                setIsFormOpen(false);

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
            setIsFormOpen(false);
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

            setApplicationToDelete(null);

        } catch (error) {
            setError("Could not connect to the server");
        }
    }

    function handleDeleteClick(id) {
        setApplicationToDelete(id);
    }

    function handleCancelDelete(){
        setApplicationToDelete(null);
    }


    function handleEditApplication(application) {
        setEditingId(application.id);
        setCompany(application.company);
        setRole(application.role);
        setStatus(application.status);
        setLocation(application.location || "");
        setJobUrl(application.job_url || "");
        setNotes(application.notes || "");

        setIsFormOpen(true);
    }

    function handleCancelEdit() {
        setEditingId(null);
        setCompany("");
        setRole("");
        setStatus("Applied");
        setLocation("");
        setJobUrl("");
        setNotes("");
        setIsFormOpen(false);
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

    function handleOpenAddForm() {
        setEditingId(null);

        setCompany("");
        setRole("");
        setStatus("Applied");
        setLocation("");
        setJobUrl("");
        setNotes("");

        setIsFormOpen(true);
    }


    return (
        <main className="dashboard">
            <header className="dashboard-header">
                <div className="dashboard-brand">
                    <div className="dashboard-logo">C</div>
                    <span>CareerFlow</span>
                </div>

                <button
                    className="logout-button"
                    onClick={() => {
                    localStorage.removeItem("access_token");
                    navigate("/login");
                    }}
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </header>

            <div className="dashboard-content">
                <div className="dashboard-welcome">
                    <div className="welcome-text">
                        <h1>Welcome back!</h1>
                        <p>Here's an overview of your job search progress.</p>
                    </div>

                    <div className="welcome-visual">
                        <img
                            src={jobHuntIllustration}
                            alt=""
                            className="welcome-illustration"
                        />
                    </div>
                </div>
                <ApplicationStats applications={applications}/>

                <div className="applications-panel">
                    <div className="applications-section-header">
                        <h2>Your Applications</h2>

                        <button
                            className="primary-button add-application-button"
                            onClick={handleOpenAddForm}
                        >
                            <Plus size={18} />
                            <span>Add Application</span>
                        </button>
                    </div>

                    <ApplicationFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />

                    <ApplicationList
                        applications={filteredApplications}
                        handleEditApplication={handleEditApplication}
                        handleDeleteApplication={handleDeleteClick}
                    />
                </div>
        
            </div>

             {isFormOpen && (
                <div className="modal-overlay">
                    <div className="application-modal">
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
                    </div>
                </div>
            )}

            {applicationToDelete !== null && (
                <div className="modal-overlay">
                    <div className="delete-confirmation-modal">
                    <div className="delete-confirmation-icon">
                        <Trash2 size={24} />
                    </div>

                    <h2>Delete application?</h2>

                    <p>
                        Are you sure you want to delete this application?
                        This action cannot be undone.
                    </p>

                    <div className="delete-confirmation-actions">
                        <button
                        className="secondary-button"
                        onClick={handleCancelDelete}
                        >
                        Cancel
                        </button>

                        <button
                        className="danger-button"
                        onClick={() =>
                            handleDeleteApplication(applicationToDelete)
                        }
                        >
                        <Trash2 size={17} />
                        Delete
                        </button>
                    </div>
                    </div>
                </div>
            )}


        </main>


    );
}

export default Dashboard;