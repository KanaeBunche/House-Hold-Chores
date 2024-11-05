import React, { useState, useEffect } from 'react';
import './App.css';

// Chore lists
const dailyChores = [
  'Laundry', 'Sweep', 'Dishes', 'Kitchen Table', 'Kitchen Cabinet', 
  'Bathroom Tub', 'Sink', 'Toilet', 'Garbage', 'Living Room Floor'
];
const weeklyChores = [
  'Clean Refrigerator', 'Mop Hallway', 'Mop Kitchen', 'Living-room TV Stand'
];

// Household members
const members = ['Kanae', 'Anaiah', 'Yejide'];

// Helper function to get current day of the week (0=Sunday, 1=Monday, etc.)
const getCurrentDayIndex = () => new Date().getDay();
const getCurrentWeekIndex = () => Math.floor((new Date().getDate() - 1) / 7);

function App() {
  const [dailyAssignments, setDailyAssignments] = useState({});
  const [weeklyAssignments, setWeeklyAssignments] = useState({});
  const [completedTasks, setCompletedTasks] = useState({ daily: {}, weekly: {} });

  useEffect(() => {
    assignChores();
    loadCompletedTasks();
  }, []);
  
  // Function to assign chores to members based on rotation
  const assignChores = () => {
    const dayIndex = getCurrentDayIndex();
    const weekIndex = getCurrentWeekIndex();

    const daily = members.reduce((acc, member, i) => {
      acc[member] = dailyChores
        .filter((_, choreIndex) => (choreIndex + dayIndex) % members.length === i)
        .map(chore => ({ name: chore, completed: false }));
      return acc;
    }, {});

    const weekly = members.reduce((acc, member, i) => {
      acc[member] = weeklyChores
        .filter((_, choreIndex) => (choreIndex + weekIndex) % members.length === i)
        .map(chore => ({ name: chore, completed: false }));
      return acc;
    }, {});

    setDailyAssignments(daily);
    setWeeklyAssignments(weekly);
  };

  // Function to load completed tasks from local storage
  const loadCompletedTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem('completedTasks'));
    if (savedTasks) {
      setCompletedTasks(savedTasks);
    }
  };

  // Function to save completed tasks to local storage
  const saveCompletedTasks = (tasks) => {
    localStorage.setItem('completedTasks', JSON.stringify(tasks));
  };

  // Function to mark a chore as completed
  const markAsComplete = (choreType, member, choreName) => {
    const updatedTasks = {
      ...completedTasks,
      [choreType]: {
        ...completedTasks[choreType],
        [member]: {
          ...completedTasks[choreType][member],
          [choreName]: new Date().toLocaleDateString()
        }
      }
    };
    setCompletedTasks(updatedTasks);
    saveCompletedTasks(updatedTasks);
  };

  // Function to undo the completion of a chore
  const undoComplete = (choreType, member, choreName) => {
    const updatedTasks = {
      ...completedTasks,
      [choreType]: {
        ...completedTasks[choreType],
        [member]: {
          ...completedTasks[choreType][member],
          [choreName]: null // Reset completion date
        }
      }
    };
    setCompletedTasks(updatedTasks);
    saveCompletedTasks(updatedTasks);
  };

  return (
    <div className="App">
      <h1>Household Chore Tracker</h1>
      <h2>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
      
      <div className="chores-container">
        {members.map(member => (
          <div className="member-column" key={member}>
            <h3>{member}</h3>

            <h4>Daily Chores</h4>
            <ul>
              {dailyAssignments[member]?.map(({ name }) => (
                <li key={name}>
                  {name}
                  <button 
                    onClick={() => markAsComplete('daily', member, name)}
                    disabled={completedTasks.daily?.[member]?.[name]}
                  >
                    {completedTasks.daily?.[member]?.[name] ? `Completed on ${completedTasks.daily[member][name]}` : 'Complete'}
                  </button>
                  {completedTasks.daily?.[member]?.[name] && (
                    <button onClick={() => undoComplete('daily', member, name)}>
                      Undo
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <h4>Weekly Chores</h4>
            <ul>
              {weeklyAssignments[member]?.map(({ name }) => (
                <li key={name}>
                  {name}
                  <button 
                    onClick={() => markAsComplete('weekly', member, name)}
                    disabled={completedTasks.weekly?.[member]?.[name]}
                  >
                    {completedTasks.weekly?.[member]?.[name] ? `Completed on ${completedTasks.weekly[member][name]}` : 'Complete'}
                  </button>
                  {completedTasks.weekly?.[member]?.[name] && (
                    <button onClick={() => undoComplete('weekly', member, name)}>
                      Undo
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
