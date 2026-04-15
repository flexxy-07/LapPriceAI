class PredictionResult {
  final double predictedPrice;
  final String? error;

  PredictionResult({
    required this.predictedPrice,
    this.error,
  });

  factory PredictionResult.fromJson(Map<String, dynamic> json) {
    double rawPrice = (json['predicted_price'] as num?)?.toDouble() ?? 0.0;
    
    // The ML model dataset for laptops usually has prices in foreign currencies.
    // Adjusting the multiplier down (e.g., using ~50 to 60) aligns it better with 
    // the actual Indian market hardware pricing for these specifications.
    double finalPriceInINR = rawPrice * 55.0;

    return PredictionResult(
      predictedPrice: finalPriceInINR,
      error: json['error'] as String?,
    );
  }
}
