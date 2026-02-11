/**
 * Performance Observer for monitoring Core Web Vitals
 * Helps track LCP, FCP, CLS, and FID in production
 */

(function() {
  'use strict';
  
  // Only run in production
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return;
  }
  
  // Track performance metrics
  var metrics = {
    fcp: null,
    lcp: null,
    fid: null,
    cls: 0,
    tbt: 0
  };
  
  // Observe Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      // LCP Observer
      var lcpObserver = new PerformanceObserver(function(list) {
        var entries = list.getEntries();
        var lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        
        // Log if LCP is slow
        // LCP monitoring for production analytics
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // FCP Observer
      var fcpObserver = new PerformanceObserver(function(list) {
        var entries = list.getEntries();
        entries.forEach(function(entry) {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime;
            
            // Log if FCP is slow
            // FCP monitoring for production analytics
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      
      // CLS Observer
      var clsValue = 0;
      var clsObserver = new PerformanceObserver(function(list) {
        var entries = list.getEntries();
        entries.forEach(function(entry) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            metrics.cls = clsValue;
            
            // Log if CLS is high
            // CLS monitoring for production analytics
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      
      // FID Observer
      var fidObserver = new PerformanceObserver(function(list) {
        var entries = list.getEntries();
        entries.forEach(function(entry) {
          metrics.fid = entry.processingStart - entry.startTime;
          
          // Log if FID is slow
          // FID monitoring for production analytics
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      
      // Long Task Observer (for TBT)
      var longTaskObserver = new PerformanceObserver(function(list) {
        var entries = list.getEntries();
        entries.forEach(function(entry) {
          var taskDuration = entry.duration;
          if (taskDuration > 50) {
            metrics.tbt += (taskDuration - 50);
            
            // Log long tasks
            // Long task monitoring for production analytics
          }
        });
      });
      
      // Check if long tasks are supported
      if (PerformanceObserver.supportedEntryTypes && 
          PerformanceObserver.supportedEntryTypes.indexOf('longtask') !== -1) {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      }
      
    } catch (e) {
      // Silently fail if observers not supported
      if (console && console.error) {
        console.error('Performance observer error:', e);
      }
    }
  }
  
  // Report metrics before page unload
  window.addEventListener('beforeunload', function() {
    // Send metrics to analytics in production
    if (false) {
      // Disabled for production
      var metricsData = {
        FCP: metrics.fcp ? (metrics.fcp / 1000).toFixed(2) + 's' : 'N/A',
        LCP: metrics.lcp ? (metrics.lcp / 1000).toFixed(2) + 's' : 'N/A',
        FID: metrics.fid ? metrics.fid.toFixed(2) + 'ms' : 'N/A',
        CLS: metrics.cls.toFixed(3),
        TBT: metrics.tbt.toFixed(0) + 'ms'
      });
    }
  });
  
})();
