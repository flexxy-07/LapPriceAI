import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/laptop_specification.dart';
import '../models/metadata.dart';
import '../models/prediction_result.dart';
import '../services/back_end_service.dart';

final backEndServiceProvider = Provider((ref) => BackEndService());

final metadataProvider = FutureProvider<LaptopMetadata>((ref) async {
  final service = ref.watch(backEndServiceProvider);
  return service.fetchMetadata();
});

class PredictionNotifier extends StateNotifier<AsyncValue<PredictionResult?>> {
  final BackEndService _service;

  PredictionNotifier(this._service) : super(const AsyncValue.data(null));

  Future<void> predict(LaptopSpecification spec) async {
    state = const AsyncValue.loading();
    try {
      final result = await _service.predictPrice(spec);
      state = AsyncValue.data(result);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  void reset() {
    state = const AsyncValue.data(null);
  }
}

final predictionProvider =
    StateNotifierProvider<PredictionNotifier, AsyncValue<PredictionResult?>>((ref) {
  final service = ref.watch(backEndServiceProvider);
  return PredictionNotifier(service);
});
