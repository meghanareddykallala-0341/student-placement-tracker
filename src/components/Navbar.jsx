function Navbar({ onLogout, onMenuClick }) {
  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    onLogout();
  }

  return (
    <nav>
      <button
        className="mobile-menu-button"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>

      <h2>Placement Tracker</h2>

      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;