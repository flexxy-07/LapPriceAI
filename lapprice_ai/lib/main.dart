import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme.dart';
import 'features/prediction/ui/screens/home_screen.dart';

void main() {
  runApp(
    const ProviderScope(
      child: SmartPriceApp(),
    ),
  );
}

class SmartPriceApp extends StatelessWidget {
  const SmartPriceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'smartPrice AI',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const HomeScreen(),
    );
  }
}
