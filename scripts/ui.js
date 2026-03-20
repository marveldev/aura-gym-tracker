window.App = window.App || {};

(function() {
  let chartInstance = null;

  App.UI = {
    init: () => {
      if (App.Data && typeof App.Data.initMockDataIfEmpty === 'function') App.Data.initMockDataIfEmpty();
      App.UI.setupTheme();
      App.UI.updateDateGreeting();
      App.UI.renderDashboard();
      App.UI.renderHistory();
      App.UI.setupAnalytics();
    },

    showToast: (message, type = 'success') => {
      const icon = type === 'success' ? 'ph-check-circle' : 'ph-warning-circle';
      const color = type === 'success' ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]';
      const toast = $(`
        <div class="toast-notification bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-xl shadow-xl p-4 flex items-center gap-3 w-72 pointer-events-auto">
          <i class="ph ${icon} ${color} text-2xl"></i>
          <span class="text-sm font-medium text-[hsl(var(--fg))]">${message}</span>
        </div>
      `);
      $('#toastContainer').append(toast);
      setTimeout(() => toast.remove(), 4000);
    },

    setupTheme: () => {
      const theme = localStorage.getItem('aura_theme') || 'dark';
      if (theme === 'dark') $('html').addClass('dark');
      else $('html').removeClass('dark');
    },

    toggleTheme: () => {
      $('html').toggleClass('dark');
      const isDark = $('html').hasClass('dark');
      localStorage.setItem('aura_theme', isDark ? 'dark' : 'light');
      if (chartInstance) App.UI.renderChart(); // re-render for colors
    },

    switchView: (viewName) => {
      $('.view-section').addClass('hidden');
      $(`#view-${viewName}`).removeClass('hidden');
      
      $('.nav-link, .mobile-link').removeClass('active');
      $(`[data-target="${viewName}"]`).addClass('active');
      
      if(viewName === 'dashboard') App.UI.renderDashboard();
      if(viewName === 'history') App.UI.renderHistory();
      if(viewName === 'analytics') {
        App.UI.populateChartDropdown();
        App.UI.renderChart();
      }
    },

    updateDateGreeting: () => {
      const d = new Date();
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      $('#dateGreeting').text(d.toLocaleDateString('en-US', options));
    },

    renderDashboard: () => {
      const stats = App.Helpers.calculateStats();
      $('#dashboardStats').html(`
        <div class="card p-6">
          <div class="flex justify-between items-center mb-4">
            <span class="text-[hsl(var(--muted))] text-sm font-medium">Total Workouts</span>
            <div class="w-10 h-10 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
              <i class="ph ph-lightning text-[hsl(var(--primary))] text-xl"></i>
            </div>
          </div>
          <div class="text-4xl font-bold">${stats.totalWorkouts}</div>
        </div>
        <div class="card p-6">
          <div class="flex justify-between items-center mb-4">
            <span class="text-[hsl(var(--muted))] text-sm font-medium">Volume Load (lbs)</span>
            <div class="w-10 h-10 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
              <i class="ph ph-barbell text-[hsl(var(--primary))] text-xl"></i>
            </div>
          </div>
          <div class="text-4xl font-bold">${stats.totalVolume.toLocaleString()}</div>
        </div>
        <div class="card p-6">
          <div class="flex justify-between items-center mb-4">
            <span class="text-[hsl(var(--muted))] text-sm font-medium">Sets Completed</span>
            <div class="w-10 h-10 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
              <i class="ph ph-stack text-[hsl(var(--primary))] text-xl"></i>
            </div>
          </div>
          <div class="text-4xl font-bold">${stats.totalSets}</div>
        </div>
      `);

      const workouts = App.Helpers.getWorkouts().slice(0, 4);
      const $list = $('#recentActivityList').empty();
      
      if (workouts.length === 0) {
        $list.html(`<div class="col-span-full text-center py-10 text-[hsl(var(--muted))]">No recent activity. Log a workout to start.</div>`);
        return;
      }

      workouts.forEach(w => {
        const exCount = w.exercises.length;
        const totalV = w.exercises.reduce((acc, ex) => {
          return acc + ex.sets.reduce((sAcc, s) => sAcc + ((parseFloat(s.weight)||0) * (parseInt(s.reps)||0)), 0);
        }, 0);

        $list.append(`
          <div class="card p-5 hover:border-[hsl(var(--primary))]/50 transition-colors cursor-pointer" onclick="App.UI.switchView('history')">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="font-bold text-lg">${w.focus} Session</h4>
                <span class="text-xs text-[hsl(var(--muted))]">${App.Helpers.formatDate(w.date)}</span>
              </div>
              <span class="bg-[hsl(var(--bg))] border border-[hsl(var(--border))] text-xs px-2 py-1 rounded font-medium text-[hsl(var(--muted))]">
                ${exCount} Exercises
              </span>
            </div>
            <div class="text-sm text-[hsl(var(--muted))]">
              Volume: <span class="font-mono text-[hsl(var(--fg))]">${totalV.toLocaleString()} lbs</span>
            </div>
          </div>
        `);
      });
    },

    renderHistory: () => {
      const workouts = App.Helpers.getWorkouts();
      const $container = $('#historyList').empty();

      if (workouts.length === 0) {
        $container.html(`
          <div class="card p-12 text-center flex flex-col items-center justify-center">
             <i class="ph ph-folder-open text-4xl text-[hsl(var(--muted))] mb-4"></i>
             <h3 class="text-lg font-medium text-[hsl(var(--fg))]">No history found</h3>
             <p class="text-[hsl(var(--muted))] text-sm mt-1">Your logged workouts will appear here.</p>
          </div>
        `);
        return;
      }

      workouts.forEach(w => {
        let exercisesHtml = w.exercises.map(ex => {
          let setsText = ex.sets.map(s => `${s.reps}x${s.weight}`).join(', ');
          return `
            <div class="text-sm border-t border-[hsl(var(--border))] py-2 flex justify-between">
              <span class="font-medium text-[hsl(var(--fg))]">${ex.name}</span>
              <span class="font-mono text-[hsl(var(--muted))]">${setsText}</span>
            </div>
          `;
        }).join('');

        $container.append(`
          <div class="card p-6 relative group overflow-hidden">
            <div class="flex justify-between items-center mb-4">
               <div class="flex items-center gap-3">
                 <div class="w-12 h-12 rounded-xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))] flex flex-col items-center justify-center">
                   <span class="text-xs font-bold text-[hsl(var(--primary))]">${App.Helpers.formatDate(w.date).split(' ')[1]}</span>
                   <span class="text-[10px] text-[hsl(var(--muted))]">${App.Helpers.formatDate(w.date).split(' ')[0]}</span>
                 </div>
                 <div>
                   <h3 class="font-bold text-lg">${w.focus}</h3>
                   <p class="text-xs text-[hsl(var(--muted))]">${w.exercises.length} Exercises</p>
                 </div>
               </div>
               <button class="text-[hsl(var(--danger))] opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[hsl(var(--danger))]/10 rounded-lg" onclick="App.UI.deleteWorkout('${w.id}')">
                 <i class="ph ph-trash text-xl"></i>
               </button>
            </div>
            <div class="bg-[hsl(var(--bg))] rounded-lg p-4">
              ${exercisesHtml}
            </div>
          </div>
        `);
      });
    },

    deleteWorkout: (id) => {
      if(confirm('Are you sure you want to delete this session?')) {
        App.Helpers.deleteWorkout(id);
        App.UI.showToast('Workout deleted successfully.');
        App.UI.renderHistory();
        App.UI.renderDashboard();
      }
    },

    setupAnalytics: () => {
      App.UI.populateChartDropdown();
      $('#chartExerciseSelect').on('change', () => App.UI.renderChart());
    },

    populateChartDropdown: () => {
      const exercises = App.Helpers.getUniqueExercises();
      const $select = $('#chartExerciseSelect').empty();
      if(exercises.length === 0) {
        $select.append(`<option value="">No data available</option>`);
        return;
      }
      exercises.forEach((ex, i) => {
        $select.append(`<option value="${ex}" ${i===0 ? 'selected' : ''}>${ex}</option>`);
      });
    },

    renderChart: () => {
      const exName = $('#chartExerciseSelect').val();
      if (!exName) return;
      
      const history = App.Helpers.getExerciseHistory(exName);
      if (history.length === 0) return;

      const labels = history.map(h => App.Helpers.formatDate(h.date));
      const dataPoints = history.map(h => h.maxWeight);

      const isDark = $('html').hasClass('dark');
      const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
      const textColor = isDark ? '#999' : '#666';

      // HSL parser helper to inject root variable into chart
      const primaryHue = 22;
      const primaryColor = `hsl(${primaryHue}, 100%, 50%)`;
      const primaryBg = `hsla(${primaryHue}, 100%, 50%, 0.1)`;

      const ctx = document.getElementById('progressChart').getContext('2d');
      
      if (chartInstance) chartInstance.destroy();
      
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Est. 1RM / Max Weight (lbs)',
            data: dataPoints,
            borderColor: primaryColor,
            backgroundColor: primaryBg,
            borderWidth: 3,
            pointBackgroundColor: primaryColor,
            pointBorderColor: isDark ? '#171717' : '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: isDark ? '#171717' : '#fff',
              titleColor: isDark ? '#fff' : '#000',
              bodyColor: isDark ? '#999' : '#666',
              borderColor: isDark ? '#262626' : '#e5e5e5',
              borderWidth: 1,
              padding: 12,
              displayColors: false
            }
          },
          scales: {
            x: {
              grid: { display: false, drawBorder: false },
              ticks: { color: textColor, font: { family: 'Inter' } }
            },
            y: {
              grid: { color: gridColor, drawBorder: false },
              ticks: { color: textColor, font: { family: 'Inter' }, padding: 10 }
            }
          }
        }
      });
    },

    /* Modal Methods */
    openWorkoutModal: () => {
      $('#workoutDate').val(new Date().toISOString().split('T')[0]);
      $('#exercisesContainer').empty();
      App.UI.addExerciseBlock(); // Add one default blank block
      $('#workoutModal').removeClass('hidden');
    },

    closeWorkoutModal: () => {
      $('#workoutModal').addClass('hidden');
    },

    addExerciseBlock: () => {
      const id = 'ex_' + Math.random().toString(36).substr(2, 5);
      const block = $(`
        <div class="bg-[hsl(var(--bg))] border border-[hsl(var(--border))] rounded-xl p-5 exercise-block" id="${id}">
          <div class="flex justify-between items-center mb-4">
            <input type="text" placeholder="Exercise Name (e.g. Bench Press)" class="input-field font-bold text-lg bg-transparent border-none px-0 focus:ring-0 w-full ex-name" required>
            <button type="button" class="text-[hsl(var(--danger))] p-2 hover:bg-[hsl(var(--danger))]/10 rounded-lg" onclick="$('#${id}').remove()">
              <i class="ph ph-trash"></i>
            </button>
          </div>
          
          <div class="space-y-2 sets-container">
            <div class="grid grid-cols-12 gap-3 items-center text-xs font-semibold text-[hsl(var(--muted))] px-2 uppercase tracking-wider">
              <div class="col-span-2">Set</div>
              <div class="col-span-4">Weight</div>
              <div class="col-span-4">Reps</div>
              <div class="col-span-2 text-center">Action</div>
            </div>
          </div>
          
          <button type="button" onclick="App.UI.addSetRow('${id}')" class="mt-4 text-sm text-[hsl(var(--primary))] font-medium flex items-center gap-1 hover:underline">
            <i class="ph ph-plus"></i> Add Set
          </button>
        </div>
      `);
      $('#exercisesContainer').append(block);
      App.UI.addSetRow(id);
    },

    addSetRow: (blockId) => {
      const container = $(`#${blockId} .sets-container`);
      const setNum = container.children('.set-row').length + 1;
      const row = $(`
        <div class="grid grid-cols-12 gap-3 items-center set-row group">
          <div class="col-span-2 flex justify-center">
            <span class="w-6 h-6 rounded-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] flex items-center justify-center text-xs font-bold text-[hsl(var(--muted))]">${setNum}</span>
          </div>
          <div class="col-span-4 relative">
             <input type="number" placeholder="0" class="input-field set-weight" required min="0" step="any">
             <span class="absolute right-3 top-2.5 text-xs text-[hsl(var(--muted))]">lbs</span>
          </div>
          <div class="col-span-4 relative">
             <input type="number" placeholder="0" class="input-field set-reps" required min="1">
             <span class="absolute right-3 top-2.5 text-xs text-[hsl(var(--muted))]">reps</span>
          </div>
          <div class="col-span-2 flex justify-center">
             <button type="button" class="text-[hsl(var(--muted))] hover:text-[hsl(var(--danger))] transition-colors p-1" onclick="$(this).closest('.set-row').remove(); App.UI.renumberSets('${blockId}')">
               <i class="ph ph-x"></i>
             </button>
          </div>
        </div>
      `);
      container.append(row);
    },

    renumberSets: (blockId) => {
      $(`#${blockId} .set-row`).each(function(idx) {
        $(this).find('span').first().text(idx + 1);
      });
    },

    saveWorkout: () => {
      // Validation
      const date = $('#workoutDate').val();
      const focus = $('#workoutFocus').val();
      if(!date || !focus) {
        App.UI.showToast('Please fill out Date and Focus', 'error');
        return;
      }

      const exercises = [];
      let valid = true;

      $('.exercise-block').each(function() {
        const name = $(this).find('.ex-name').val().trim();
        if(!name) { valid = false; return false; }

        const sets = [];
        $(this).find('.set-row').each(function() {
          const w = $(this).find('.set-weight').val();
          const r = $(this).find('.set-reps').val();
          if(w && r) {
            sets.push({ weight: parseFloat(w), reps: parseInt(r) });
          }
        });

        if(sets.length > 0) {
          exercises.push({ name, sets });
        }
      });

      if(!valid || exercises.length === 0) {
        App.UI.showToast('Please provide an exercise name and at least one set.', 'error');
        return;
      }

      const workout = {
        date: date,
        focus: focus,
        exercises: exercises
      };

      App.Helpers.addWorkout(workout);
      App.UI.showToast('Session logged successfully!');
      App.UI.closeWorkoutModal();
      
      // Re-render current view
      App.UI.renderDashboard();
      App.UI.renderHistory();
      if(!$('#view-analytics').hasClass('hidden')) {
        App.UI.populateChartDropdown();
        App.UI.renderChart();
      }
    }
  };
})();