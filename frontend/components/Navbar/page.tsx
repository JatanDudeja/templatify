import React from "react";

function Navbar() {
  return (
    <nav className="p-4 bg-rose-500 text-white">
      <ul className="flex items-center justify-evenly flex-row">
        <li>
          <a href="/createTemplate">Create Template</a>
        </li>
        <li>
          <a href="/login">Login</a>
        </li>
        <li>
          <a href="/signup">SignUp</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
