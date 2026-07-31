class AppConfig {
  static const String appName = 'DebitManager';
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000/api/v1',
  );
  
  // Geolocation settings
  static const int geolocationRadiusMeters = 100;
  static const int geolocationCheckIntervalMinutes = 30;
  
  // Offline settings
  static const int maxOfflineQueueSize = 100;
  static const Duration syncRetryInterval = Duration(minutes: 5);
  
  // Pagination
  static const int defaultPageSize = 20;
}
