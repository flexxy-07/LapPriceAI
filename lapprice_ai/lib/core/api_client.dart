import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../core/constants.dart';

class ApiClient {
  final http.Client _client = http.Client();

  Future<dynamic> get(String endpoint) async {
    final response = await _client.get(Uri.parse('${AppConstants.baseUrl}$endpoint'));
    return _handleResponse(response);
  }

  Future<dynamic> post(String endpoint, Map<String, dynamic> body) async {
    final response = await _client.post(
      Uri.parse('${AppConstants.baseUrl}$endpoint'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );
    return _handleResponse(response);
  }

  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    } else {
      throw Exception('API Error: ${response.statusCode} - ${response.body}');
    }
  }
}
