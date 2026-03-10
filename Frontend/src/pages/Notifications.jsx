import React from "react";

const Notifications = () => {
  const sample = [
    "Your report for CBC is ready.",
    "New package offers available.",
    "Appointment confirmed for 05 Mar.",
  ];

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Notifications</h2>
      {sample.length === 0 ? (
        <p className="text-gray-500">No notifications.</p>
      ) : (
        <ul className="space-y-2">
          {sample.map((note, idx) => (
            <li key={idx} className="bg-white p-4 rounded-lg shadow">
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
