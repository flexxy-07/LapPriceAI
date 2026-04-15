import 'package:flutter/material.dart';

class AppConstants {
  static const String appName = 'smartPrice AI';
  
  // Replace with your actual deployed URL
  // static const String baseUrl = 'https://your-deployed-api.com';
  static const String baseUrl = 'https://lappriceai.onrender.com'; // Default for Android Emulator
  
  static const String predictEndpoint = '/predict';
  static const String metadataEndpoint = '/metadata';
  
  // Design Tokens
  static const double borderRadius = 20.0;
  static const double elementPadding = 16.0;
  
  static const List<String> predictionSteps = [
    "Indexing local markets",
    "Analyzing hardware delta",
    "Calculating regional demand",
    "Finalizing valuation"
  ];
}

class AppColors {
  static const Color primary = Color(0xFF6366F1); // Vibrant Indigo
  static const Color secondary = Color(0xFF818CF8);
  static const Color background = Color(0xFF0F172A); // Deep Slate
  static const Color surface = Color(0xFF1E293B);
  static const Color accent = Color(0xFFF43F5E); // Rose
  static const Color textBody = Color(0xFF94A3B8);
  static const Color textHeading = Color(0xFFF8FAFC);
  static const Color error = Color(0xFFEF4444);
}
