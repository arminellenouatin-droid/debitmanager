import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/product_model.dart';
import '../../data/products_repository.dart';

// Events
abstract class ProductsEvent {}

class LoadProductsEvent extends ProductsEvent {}

class CreateProductEvent extends ProductsEvent {
  final Map<String, dynamic> productData;

  CreateProductEvent(this.productData);
}

class LoadLowStockProductsEvent extends ProductsEvent {}

// States
abstract class ProductsState {}

class ProductsInitial extends ProductsState {}

class ProductsLoading extends ProductsState {}

class ProductsLoaded extends ProductsState {
  final List<ProductModel> products;

  ProductsLoaded(this.products);
}

class ProductsError extends ProductsState {
  final String message;

  ProductsError(this.message);
}

// BLoC
class ProductsBloc extends Bloc<ProductsEvent, ProductsState> {
  final ProductsRepository repository;

  ProductsBloc(this.repository) : super(ProductsInitial()) {
    on<LoadProductsEvent>(_onLoadProducts);
    on<CreateProductEvent>(_onCreateProduct);
    on<LoadLowStockProductsEvent>(_onLoadLowStockProducts);
  }

  Future<void> _onLoadProducts(
    LoadProductsEvent event,
    Emitter<ProductsState> emit,
  ) async {
    emit(ProductsLoading());
    try {
      final products = await repository.getProducts();
      emit(ProductsLoaded(products));
    } catch (e) {
      emit(ProductsError(e.toString()));
    }
  }

  Future<void> _onCreateProduct(
    CreateProductEvent event,
    Emitter<ProductsState> emit,
  ) async {
    emit(ProductsLoading());
    try {
      await repository.createProduct(event.productData);
      final products = await repository.getProducts();
      emit(ProductsLoaded(products));
    } catch (e) {
      emit(ProductsError(e.toString()));
    }
  }

  Future<void> _onLoadLowStockProducts(
    LoadLowStockProductsEvent event,
    Emitter<ProductsState> emit,
  ) async {
    emit(ProductsLoading());
    try {
      final products = await repository.getLowStockProducts();
      emit(ProductsLoaded(products));
    } catch (e) {
      emit(ProductsError(e.toString()));
    }
  }
}
