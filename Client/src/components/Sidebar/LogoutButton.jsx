import { useNavigate } from "react-router-dom";

function LogoutButton(props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem("token");

    location.reload();

    // Update the auth state
    props.setAuth(false);
  };

  return (
    <li className="logout-span" onClick={handleLogout}>
      Logout
    </li>
  );
}

export default LogoutButton;
