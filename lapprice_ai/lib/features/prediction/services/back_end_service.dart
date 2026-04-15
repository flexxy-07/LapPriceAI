import '../../../core/api_client.dart';
import '../../../core/constants.dart';
import '../models/laptop_specification.dart';
import '../models/metadata.dart';
import '../models/prediction_result.dart';

class BackEndService {
  final ApiClient _apiClient = ApiClient();

  Future<LaptopMetadata> fetchMetadata() async {
    try {
      final json = await _apiClient.get(AppConstants.metadataEndpoint);
      return LaptopMetadata.fromJson(json);
    } catch (e) {
      throw Exception('Failed to fetch metadata: $e');
    }
  }

  Future<PredictionResult> predictPrice(LaptopSpecification spec) async {
    try {
      final json = await _apiClient.post(
        AppConstants.predictEndpoint,
        spec.toJson(),
      );
      return PredictionResult.fromJson(json);
    } catch (e) {
      throw Exception('Prediction failed: $e');
    }
  }
}
