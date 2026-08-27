function ApplicationList({
  applications,
  handleEditApplication,
  handleDeleteApplication,
}) {
  if (applications.length === 0) {
    return <p>No applications yet.</p>;
  }

    return (
        <div className="card">
        <h2>Your Applications</h2>

        {applications.length === 0 ? (
            <p>No applications yet.</p>
        ) : (
            <div className="applications-list">
            {applications.map((application) => (
                <div className="application-item" key={application.id}>
                <div>
                    <h3>{application.company}</h3>

                    <p>{application.role}</p>

                    {application.location && (
                        <p>{application.location}</p>
                    )}
                    
                    {application.job_url && (
                        <p>
                            <a
                            href={application.job_url}
                            target="_blank"
                            rel="noreferrer"
                            >
                            View job posting
                            </a>
                        </p>
                    )}

                    {application.notes && (
                        <p className="application-notes">
                            {application.notes}
                        </p>
                    )}

                    <span
                    className={`status-badge status-${application.status.toLowerCase()}`}
                    >
                    {application.status}
                    </span>
                </div>

                <div className="application-actions">
                    <button
                    className="secondary-button"
                    onClick={() => handleEditApplication(application)}
                    >
                    Edit
                    </button>

                    <button
                    className="danger-button"
                    onClick={() =>
                        handleDeleteApplication(application.id)
                    }
                    >
                    Delete
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}

export default ApplicationList;