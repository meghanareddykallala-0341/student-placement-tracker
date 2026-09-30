function ApplicationCard({
  company,
  role,
  status,
  appliedDate,
  deadline,
  onEdit,
  onDelete
}) {
  return (
    <div className="application-card">
      <h3>{company}</h3>

      <p>Role: {role}</p>

      <p>Status: {status}</p>

      <p>Applied Date: {appliedDate}</p>

      <p>
        Deadline: {deadline ? deadline : "No deadline"}
      </p>

      <button onClick={onEdit}>
        Edit
      </button>

      <button onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}

export default ApplicationCard;
