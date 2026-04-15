import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/constants.dart';
import '../../../../core/theme.dart';
import '../../providers/prediction_provider.dart';
import '../widgets/spec_form.dart';
import '../widgets/result_card.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  bool _showForm = false;

  @override
  Widget build(BuildContext context) {
    final predictionState = ref.watch(predictionProvider);

    return Scaffold(
      body: Stack(
        children: [
          // Background Blobs
          Positioned(
            top: -100,
            right: -100,
            child: _buildBlob(AppColors.primary.withOpacity(0.15), 300),
          ),
          Positioned(
            bottom: -50,
            left: -50,
            child: _buildBlob(AppColors.accent.withOpacity(0.1), 250),
          ),

          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildHeader(),
                  const SizedBox(height: 40),
                  
                  if (!_showForm && predictionState.value == null)
                    _buildLanding()
                  else if (predictionState.value != null)
                    const ResultCard()
                  else
                    const SpecForm(),
                  
                  const SizedBox(height: 40),
                  _buildFooter(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBlob(Color color, double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
      ),
    ).animate().fadeIn(duration: 1000.ms).scale(begin: const Offset(0.8, 0.8));
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'DIGITAL ASSET VALUATION / V2.0',
          style: Theme.of(context).textTheme.labelSmall,
        ).animate().fadeIn().moveY(begin: -10, end: 0),
        const SizedBox(height: 12),
        RichText(
          text: TextSpan(
            children: [
              TextSpan(
                text: 'Precision ',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(fontSize: 42),
              ),
              TextSpan(
                text: 'Pricing.',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(
                  fontSize: 42,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ).animate().fadeIn(delay: 200.ms).moveX(begin: -20, end: 0),
        const SizedBox(height: 8),
        Text(
          'Real-time market analytics for a competitive regional advantage.',
          style: Theme.of(context).textTheme.bodyLarge,
        ).animate().fadeIn(delay: 400.ms),
      ],
    );
  }

  Widget _buildLanding() {
    return Column(
      children: [
        Container(
          height: 300,
          width: double.infinity,
          decoration: AppTheme.glassDecoration(),
          child: Center(
            child: Icon(
              Icons.laptop_mac_rounded,
              size: 100,
              color: AppColors.primary.withOpacity(0.5),
            ),
          ),
        ).animate().fadeIn(delay: 600.ms).scale(),
        const SizedBox(height: 40),
        ElevatedButton(
          onPressed: () => setState(() => _showForm = true),
          child: const Text('Get Started'),
        ).animate().fadeIn(delay: 800.ms).moveY(begin: 20, end: 0),
      ],
    );
  }

  Widget _buildFooter() {
    return Column(
      children: [
        const Divider(color: Colors.white10),
        const SizedBox(height: 20),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              '© 2024 MARKET DYNAMICS',
              style: Theme.of(context).textTheme.labelSmall?.copyWith(fontSize: 8, color: Colors.white24),
            ),
            Text(
              'REGIONAL FOCUS: SOUTH ASIA',
              style: Theme.of(context).textTheme.labelSmall?.copyWith(fontSize: 8, color: Colors.white24),
            ),
          ],
        ),
      ],
    );
  }
}
