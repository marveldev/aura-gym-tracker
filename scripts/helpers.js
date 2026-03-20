window.App = window.App || {};

(function() {
  const STORAGE_KEY = 'aura_workouts_data';
  
  App.Helpers = {
    generateId: () => '_' + Math.random().toString(36).substr(2, 9),
    
    getWorkouts: () => {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        console.error('Failed to parse workouts', e);
        return [];
      }
    },

    saveWorkouts: (workouts) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    },

    addWorkout: (workoutObj) => {
      const w = App.Helpers.getWorkouts();
      workoutObj.id = workoutObj.id || App.Helpers.generateId();
      w.push(workoutObj);
      w.sort((a, b) => new Date(b.date) - new Date(a.date));
      App.Helpers.saveWorkouts(w);
    },

    deleteWorkout: (id) => {
      let w = App.Helpers.getWorkouts();
      w = w.filter(x => x.id !== id);
      App.Helpers.saveWorkouts(w);
    },

    formatDate: (dateString) => {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      const d = new Date(dateString);
      // Fix timezone offset issue
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
      return d.toLocaleDateString('en-US', options);
    },

    calculateStats: () => {
      const w = App.Helpers.getWorkouts();
      let totalVolume = 0;
      let totalSets = 0;
      
      w.forEach(workout => {
        workout.exercises.forEach(ex => {
          ex.sets.forEach(set => {
            const weight = parseFloat(set.weight) || 0;
            const reps = parseInt(set.reps) || 0;
            totalVolume += weight * reps;
            totalSets++;
          });
        });
      });

      return {
        totalWorkouts: w.length,
        totalVolume: totalVolume,
        totalSets: totalSets
      };
    },

    getUniqueExercises: () => {
      const w = App.Helpers.getWorkouts();
      const names = new Set();
      w.forEach(workout => {
        workout.exercises.forEach(ex => {
          if (ex.name.trim()) names.add(ex.name.trim());
        });
      });
      return Array.from(names).sort();
    },

    getExerciseHistory: (exerciseName) => {
      const w = App.Helpers.getWorkouts();
      const history = [];
      
      w.forEach(workout => {
        const ex = workout.exercises.find(e => e.name.toLowerCase() === exerciseName.toLowerCase());
        if (ex) {
          let maxWeight = 0;
          let volume = 0;
          ex.sets.forEach(s => {
            const wt = parseFloat(s.weight) || 0;
            const rp = parseInt(s.reps) || 0;
            if (wt > maxWeight) maxWeight = wt;
            volume += (wt * rp);
          });
          history.push({
            date: workout.date,
            maxWeight,
            volume
          });
        }
      });
      
      // Sort chronological for charts
      return history.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  };
})();