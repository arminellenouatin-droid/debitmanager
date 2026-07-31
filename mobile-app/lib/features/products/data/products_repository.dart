import 'package:dio/dio.dart';
import '../models/product_model.dart';

class ProductsRepository {
  final Dio _dio;

  ProductsRepository(this._dio);

  Future<List<ProductModel>> getProducts() async {
    try {
      final response = await _dio.get('/products');
      return (response.data as List)
          .map((json) => ProductModel.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Failed to load products: $e');
    }
  }

  Future<ProductModel> createProduct(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/products', data: data);
      return ProductModel.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to create product: $e');
    }
  }

  Future<List<ProductModel>> getLowStockProducts() async {
    try {
      final response = await _dio.get('/products/low-stock');
      return (response.data as List)
          .map((json) => ProductModel.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Failed to load low stock products: $e');
    }
  }
}
