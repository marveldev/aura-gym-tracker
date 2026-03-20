$(function() {
  try {
    const hasApp = !!window.App;
    const hasUI = hasApp && !!window.App.UI;
    const hasInit = hasUI && typeof window.App.UI.init === 'function';
    
    if (!hasApp || !hasUI || !hasInit) {
      console.error('[Contract] Missing App.UI.init architecture', { hasApp, hasUI, hasInit });
      return;
    }

    // Initialize the Application UI
    App.UI.init();

    // Event Bindings
    $('.nav-link, .mobile-link').on('click', function(e) {
      const target = $(this).data('target');
      if(target) {
        App.UI.switchView(target);
      }
    });

    $('#themeToggle, #mobileThemeToggle').on('click', function() {
      App.UI.toggleTheme();
    });

    // Close modal on escape key
    $(document).on('keydown', function(e) {
      if (e.key === 'Escape' && !$('#workoutModal').hasClass('hidden')) {
        App.UI.closeWorkoutModal();
      }
    });

  } catch (e) {
    console.error('Initialization failed', e);
  }
});