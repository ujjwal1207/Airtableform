import React from 'react';

// This is the only URL we should be using.
const AIRTABLE_AUTH_URL = 'http://localhost:5001/auth/airtable';

const Navbar = () => {

  const handleLogin = () => {
    // This function sends the user to the correct backend endpoint.
    window.location.href = AIRTABLE_AUTH_URL;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          Form<span className="text-blue-600">Table</span>
        </div>
        <nav>
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login with Airtable
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
