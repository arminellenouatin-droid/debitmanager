class ProductModel {
  final String id;
  final String name;
  final String? description;
  final int price;
  final int currentStock;
  final int alertThreshold;
  final String? categoryId;
  final String? categoryName;
  final String? unitId;
  final String? unitName;
  final String? imageUrl;

  ProductModel({
    required this.id,
    required this.name,
    this.description,
    required this.price,
    required this.currentStock,
    required this.alertThreshold,
    this.categoryId,
    this.categoryName,
    this.unitId,
    this.unitName,
    this.imageUrl,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      price: json['price'],
      currentStock: json['currentStock'],
      alertThreshold: json['alertThreshold'],
      categoryId: json['categoryId'],
      categoryName: json['category']?['name'],
      unitId: json['unitId'],
      unitName: json['unit']?['name'],
      imageUrl: json['imageUrl'],
    );
  }

  bool get isLowStock => currentStock <= alertThreshold;
}
