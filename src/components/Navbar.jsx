function Navbar({ onLogout, onProfile }) {
  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    onLogout();
  }

  return (
    <nav>
      <h2>Placement Tracker</h2>

      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;