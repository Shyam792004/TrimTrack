import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/DietApp.css';  // Make sure you create this CSS file for custom styles
import ExerciseCalendar from './ExerciseCalendar';
const DietApp = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [exerciseMinutes, setExerciseMinutes] = useState('');
  const [bmi, setBmi] = useState(null);
  const [idealBmi, setIdealBmi] = useState(null);
  const [bmiDifference, setBmiDifference] = useState(null);
  const [daysRequired, setDaysRequired] = useState(null);
  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [badges, setBadges] = useState([]);
  const [exerciseDates, setExerciseDates] = useState([]);
  const [level, setLevel] = useState('Beginner');
  const [darkMode, setDarkMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // NEW: state for marked days count
  const [markedDaysCount, setMarkedDaysCount] = useState(0);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const calculateBMI = () => {
    if (!weight || !height) {
      alert('Please enter both weight and height.');
      return;
    }
    const h = height / 100;
    const bmiVal = weight / (h * h);
    const ideal = 21.7;
    const diff = bmiVal - ideal;
    setBmi(bmiVal.toFixed(2));
    setIdealBmi(ideal);
    setBmiDifference(diff.toFixed(2));
  };

  const calculateDaysToGoal = () => {
    const current = parseFloat(weight);
    const target = parseFloat(targetWeight);
    const mins = parseFloat(exerciseMinutes);
    const dailyLoss = mins * 0.01;

    if (current > target && dailyLoss > 0) {
      const totalLossRequired = current - target;
      const days = totalLossRequired / dailyLoss;
      setDaysRequired(Math.ceil(days));
      return Math.ceil(days);
    } else {
      setDaysRequired('Invalid or already at target');
      return null;
    }
  };

  const calculateProgress = (goalDays) => {
    if (!goalDays || typeof goalDays !== 'number') {
      setProgress(0);
      return;
    }
    const count = exerciseDates.length;
    let progressVal = (count / goalDays) * 100;
    if (progressVal > 100) progressVal = 100;
    setProgress(progressVal);
  };
  

  const handleCalculate = () => {
    if (!weight || !height) {
      alert('Please enter both weight and height before calculating.');
      return;
    }
    calculateBMI();
    const goalDays = calculateDaysToGoal();
    calculateProgress(goalDays);
  };

  const handleExerciseLog = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert('Cannot log exercise for past dates.');
      return;
    }

    if (!weight || !height) {
      alert('Please enter your weight and height before logging exercise.');
      return;
    }

    if (!exerciseDates.find(d => d.toDateString() === date.toDateString())) {
      setExerciseDates(prev => [...prev, date]);
    }
  };

  useEffect(() => {
    let count = exerciseDates.length;
    let newBadges = [];

    if (count >= 1) newBadges.push('🎉 First Workout!');
    if (count >= 5) newBadges.push('🏅 5-Day Streak!');
    if (count >= 7) newBadges.push('⭐ Weekly Win!');
    if (count >= 10) newBadges.push('🔥 10-Day Hero!');
    if (count >= 20) newBadges.push('🥇 Champion!');

    setBadges(newBadges);

    if (count < 5) setLevel('Beginner');
    else if (count < 10) setLevel('Intermediate');
    else setLevel('Advanced');

    if (typeof daysRequired === 'number') {
      calculateProgress(daysRequired);
    }
  }, [exerciseDates, daysRequired]);

  // Update markedDaysCount whenever exerciseDates change
  useEffect(() => {
    setMarkedDaysCount(exerciseDates.length);
  }, [exerciseDates]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < progress) {
        setDisplayProgress(i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [progress]);

  useEffect(() => {
    if (progress >= 100) {
      setShowCelebration(true);
    } else {
      setShowCelebration(false);
    }
  }, [progress]);

  // You can keep or remove this alert function as needed
  const handleCountMarkedDays = () => {
    alert(`You have logged exercise on ${markedDaysCount} day(s).`);
  };

  return (
    <div className="min-h-screen p-8 max-w-xl mx-auto">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="mb-4 px-4 py-2 rounded bg-gray-700 text-white"
      >
        Toggle Theme
      </button>

      <h1 className="text-2xl font-bold mb-4">🎯 Diet Tracker & Game</h1>

      <label>Weight (kg):</label>
      <input
        type="number"
        value={weight}
        onChange={e => setWeight(e.target.value)}
        className="block mb-2 border p-2 w-full"
      />

      <label>Height (cm):</label>
      <input
        type="number"
        value={height}
        onChange={e => setHeight(e.target.value)}
        className="block mb-2 border p-2 w-full"
      />

      <label>Age:</label>
      <input
        type="number"
        value={age}
        onChange={e => setAge(e.target.value)}
        className="block mb-2 border p-2 w-full"
      />

      <label>Target Weight (kg):</label>
      <input
        type="number"
        value={targetWeight}
        onChange={e => setTargetWeight(e.target.value)}
        className="block mb-2 border p-2 w-full"
      />

      <label>Exercise per Day (minutes):</label>
      <input
        type="number"
        value={exerciseMinutes}
        onChange={e => setExerciseMinutes(e.target.value)}
        className="block mb-4 border p-2 w-full"
      />

      <button onClick={handleCalculate} className="bg-green-500 text-white px-4 py-2 rounded">
        Calculate
      </button>

      {bmi && (
        <div className="mt-4">
          <p>📊 <strong>BMI:</strong> {bmi}</p>
          <p>🎯 <strong>Ideal BMI:</strong> {idealBmi}</p>
          <p>📉 <strong>Difference:</strong> {bmiDifference}</p>
        </div>
      )}

      {daysRequired && typeof daysRequired === 'number' && (
        <p className="mt-2">📆 <strong>Estimated Days to Goal:</strong> {daysRequired}</p>
      )}

      <div className="mt-4">
        <p>🚦 <strong>Progress:</strong></p>
        <div className="bg-gray-300 h-4 rounded">
          <div
            className="bg-blue-500 h-4 rounded"
            style={{ width: `${displayProgress}%`, transition: 'width 0.5s ease' }}
          ></div>
        </div>
        <p className="mt-1">{Math.floor(displayProgress)}%</p>
      </div>

      <div className="mt-4">
        <p>🏅 <strong>Badges Earned:</strong> {badges.join(', ') || 'None yet'} {badges.length >= 3 && '🎗️'}</p>
      </div>

      <div className="mt-4">
        <p>🎮 <strong>Level:</strong> {level}</p>
      </div>

      <ExerciseCalendar
  exerciseDates={exerciseDates}
  handleExerciseLog={handleExerciseLog}
  markedDaysCount={markedDaysCount}
  handleCountMarkedDays={handleCountMarkedDays}
  darkMode={darkMode}
/>


      {showCelebration && (
        <div className="celebration">
          🎉🎊 Congratulations! You reached your goal! 🎊🎉
        </div>
      )}
    </div>
  );
};

export default DietApp;
