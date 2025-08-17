import React from 'react';

// This is the only URL we should be using.
const AIRTABLE_AUTH_URL = `http://localhost:5001/auth/airtable`;

const HomePage = () => {
  const handleLogin = () => {
    // This function sends the user to the correct backend endpoint.
    window.location.href = AIRTABLE_AUTH_URL;
  };

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          Build Powerful Forms, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            Directly From Airtable.
          </span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Stop syncing data manually. Connect your Airtable base, select your fields, add conditional logic, and start collecting responses instantly.
        </p>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 shadow-lg"
        >
          Get Started for Free
        </button>
      </div>

      {/* Features Section */}
      <div className="mt-24 grid md:grid-cols-3 gap-12 text-left">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Dynamic Fields</h3>
          <p className="text-gray-600">
            Your form questions are generated directly from your Airtable table fields. Supports text, select options, and attachments.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Conditional Logic</h3>
          <p className="text-gray-600">
            Show or hide questions based on previous answers. Create interactive and personalized form experiences.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Instant Sync</h3>
          <p className="text-gray-600">
            Every submission instantly creates a new record in your Airtable base. No more manual data entry or complex integrations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
