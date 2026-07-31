import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/order_model.dart';
import '../../data/orders_repository.dart';

// Events
abstract class OrdersEvent {}

class LoadOrdersEvent extends OrdersEvent {}

class CreateOrderEvent extends OrdersEvent {
  final Map<String, dynamic> orderData;

  CreateOrderEvent(this.orderData);
}

class CancelOrderEvent extends OrdersEvent {
  final String orderId;

  CancelOrderEvent(this.orderId);
}

// States
abstract class OrdersState {}

class OrdersInitial extends OrdersState {}

class OrdersLoading extends OrdersState {}

class OrdersLoaded extends OrdersState {
  final List<OrderModel> orders;

  OrdersLoaded(this.orders);
}

class OrdersError extends OrdersState {
  final String message;

  OrdersError(this.message);
}

// BLoC
class OrdersBloc extends Bloc<OrdersEvent, OrdersState> {
  final OrdersRepository repository;

  OrdersBloc(this.repository) : super(OrdersInitial()) {
    on<LoadOrdersEvent>(_onLoadOrders);
    on<CreateOrderEvent>(_onCreateOrder);
    on<CancelOrderEvent>(_onCancelOrder);
  }

  Future<void> _onLoadOrders(
    LoadOrdersEvent event,
    Emitter<OrdersState> emit,
  ) async {
    emit(OrdersLoading());
    try {
      final orders = await repository.getOrders();
      emit(OrdersLoaded(orders));
    } catch (e) {
      emit(OrdersError(e.toString()));
    }
  }

  Future<void> _onCreateOrder(
    CreateOrderEvent event,
    Emitter<OrdersState> emit,
  ) async {
    emit(OrdersLoading());
    try {
      await repository.createOrder(event.orderData);
      final orders = await repository.getOrders();
      emit(OrdersLoaded(orders));
    } catch (e) {
      emit(OrdersError(e.toString()));
    }
  }

  Future<void> _onCancelOrder(
    CancelOrderEvent event,
    Emitter<OrdersState> emit,
  ) async {
    emit(OrdersLoading());
    try {
      await repository.cancelOrder(event.orderId);
      final orders = await repository.getOrders();
      emit(OrdersLoaded(orders));
    } catch (e) {
      emit(OrdersError(e.toString()));
    }
  }
}
