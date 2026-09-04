import { Pencil, Trash2 } from "lucide-react";


function ApplicationList({
  applications,
  handleEditApplication,
  handleDeleteApplication,
}) {
  if (applications.length === 0) {
    return <p className="empty-applications">No applications yet.</p>;
  }

    return (
        <div className="applications-table">
            <div className="applications-table-header">
                <span>Company</span>
                <span>Position</span>
                <span>Status</span>
                <span>Location</span>
                <span>Actions</span>
            </div>
            <div className="applications-list">
                {applications.map((application) => (
                    <div className="application-item" key={application.id}>
                        <div className="application-company">
                            <h3>{application.company}</h3>

                            {application.job_url && (
                                <a
                                    href={application.job_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View job posting
                                </a>
                            )}
                        </div>

                        <div className="application-position">
                            <span>{application.role}</span>

                            {application.notes && (
                                <p className="application-notes">
                                    {application.notes}
                                </p>
                            )}
                        </div>

                        <div className="application-status">
                            <span
                                className={`status-badge status-${application.status.toLowerCase()}`}
                            >
                                {application.status}
                            </span>
                        </div>

                        <div className="application-location">
                            {application.location || "—"}
                        </div>

                        <div className="application-actions">
                            <button
                                className="secondary-button"
                                onClick={() => handleEditApplication(application)}
                                aria-label="Edit application"
                            >
                                <Pencil size={16} />
                            </button>

                            <button
                                className="danger-button"
                                onClick={() => handleDeleteApplication(application.id)}
                                aria-label="Delete application"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        
        </div>
    );
}

export default ApplicationList;