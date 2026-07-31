import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';

import '../config/app_config.dart';
import '../network/api_client.dart';
import '../utils/logger.dart';

final getIt = GetIt.instance;

Future<void> initDependencyInjection() async {
  AppLogger.info('Initializing dependency injection...');
  
  // Register Dio
  getIt.registerLazySingleton<Dio>(() => Dio(
    BaseOptions(
      baseUrl: AppConfig.apiBaseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
      },
    ),
  ));
  
  // Register API Client
  getIt.registerLazySingleton<ApiClient>(() => ApiClient(getIt<Dio>()));
  
  AppLogger.info('Dependency injection initialized');
}
