import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/DietApp.css'; // Ensure your calendar styles are here

const ExerciseCalendar = ({
  exerciseDates,
  handleExerciseLog,
  markedDaysCount,
  handleCountMarkedDays,
  darkMode
}) => {
  return (
    <div className="mt-6">
      <p className="mb-2">🗓️ <strong>Exercise Calendar:</strong> (Click day after exercising)</p>
      <Calendar
        onClickDay={handleExerciseLog}
        tileClassName={({ date }) =>
          exerciseDates.find(d => d.toDateString() === date.toDateString()) ? 'logged-day' : null
        }
        className={darkMode ? 'dark-calendar' : ''}
      />
      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={handleCountMarkedDays}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Count Marked Days
        </button>
        <span className="font-semibold text-lg">
          {markedDaysCount} day{markedDaysCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export default ExerciseCalendar;
