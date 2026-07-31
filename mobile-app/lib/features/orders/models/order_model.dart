class OrderModel {
  final String id;
  final String status;
  final DateTime createdAt;
  final String? tableId;
  final String? tableName;
  final List<OrderItemModel> items;

  OrderModel({
    required this.id,
    required this.status,
    required this.createdAt,
    this.tableId,
    this.tableName,
    required this.items,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      id: json['id'],
      status: json['status'],
      createdAt: DateTime.parse(json['createdAt']),
      tableId: json['tableId'],
      tableName: json['table']?['name'],
      items: (json['items'] as List)
          .map((item) => OrderItemModel.fromJson(item))
          .toList(),
    );
  }

  int get total => items.fold(0, (sum, item) => sum + item.totalPrice);
}

class OrderItemModel {
  final String productId;
  final String productName;
  final int quantity;
  final int unitPrice;
  final int totalPrice;
  final String status;

  OrderItemModel({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
    required this.status,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    return OrderItemModel(
      productId: json['productId'],
      productName: json['productName'],
      quantity: json['quantity'],
      unitPrice: json['unitPrice'],
      totalPrice: json['totalPrice'],
      status: json['status'],
    );
  }
}
