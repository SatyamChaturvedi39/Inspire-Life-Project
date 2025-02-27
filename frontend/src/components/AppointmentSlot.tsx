import React, { useState, useEffect } from "react";

interface Appointment {
  id: string;
  date: string;
  time: string;
  clientName: string;
}

const AppointmentsList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data));
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Scheduled Appointments</h2>

      {appointments.map((appt) => (
        <div key={appt.id} className="bg-gray-100 p-3 rounded mb-2">
          <p>
            <strong>{appt.date}</strong> - {appt.time}
          </p>
          <p>Client: {appt.clientName}</p>
        </div>
      ))}
    </div>
  );
};

export default AppointmentsList;
