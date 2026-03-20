window.App = window.App || {};

(function() {
  App.Data = {
    initMockDataIfEmpty: () => {
      const existing = App.Helpers.getWorkouts();
      if (existing.length > 0) return;
      
      console.log('Initializing mock data for onboarding...');
      
      const today = new Date();
      const mockData = [];
      
      // Generate ~10 workouts over the past 30 days
      const routines = [
        { focus: 'Chest', ex: ['Bench Press', 'Incline Dumbbell Press', 'Cable Crossovers'] },
        { focus: 'Back', ex: ['Deadlift', 'Pull-ups', 'Barbell Rows'] },
        { focus: 'Legs', ex: ['Squat', 'Leg Press', 'Calf Raises'] }
      ];
      
      for(let i = 0; i < 12; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - (30 - (i * 2) - Math.floor(Math.random() * 2)));
        
        const routine = routines[i % 3];
        const exercises = routine.ex.map((name, idx) => {
          // Simulate progressive overload
          const baseWeight = name === 'Deadlift' ? 225 : (name === 'Squat' ? 185 : (name === 'Bench Press' ? 135 : 50));
          const weight = baseWeight + (i * 5);
          
          return {
            id: App.Helpers.generateId(),
            name: name,
            sets: [
              { reps: 10, weight: weight },
              { reps: 8, weight: weight + 10 },
              { reps: 5, weight: weight + 20, isPR: i > 8 }
            ]
          };
        });
        
        mockData.push({
          id: App.Helpers.generateId(),
          date: d.toISOString().split('T')[0],
          focus: routine.focus,
          exercises: exercises
        });
      }
      
      App.Helpers.saveWorkouts(mockData.reverse()); // Newest first
    }
  };
})();