import 'package:dio/dio.dart';
import '../models/order_model.dart';

class OrdersRepository {
  final Dio _dio;

  OrdersRepository(this._dio);

  Future<List<OrderModel>> getOrders() async {
    try {
      final response = await _dio.get('/orders');
      return (response.data as List)
          .map((json) => OrderModel.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Failed to load orders: $e');
    }
  }

  Future<OrderModel> createOrder(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/orders', data: data);
      return OrderModel.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to create order: $e');
    }
  }

  Future<OrderModel> addItem(String orderId, Map<String, dynamic> item) async {
    try {
      final response = await _dio.post('/orders/$orderId/items', data: item);
      return OrderModel.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to add item: $e');
    }
  }

  Future<void> cancelOrder(String orderId) async {
    try {
      await _dio.post('/orders/$orderId/cancel');
    } catch (e) {
      throw Exception('Failed to cancel order: $e');
    }
  }
}
