import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants.dart';
import '../../../../core/theme.dart';
import '../../providers/prediction_provider.dart';

class ResultCard extends ConsumerWidget {
  const ResultCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final predictionState = ref.watch(predictionProvider);
    final currencyFormat = NumberFormat.currency(
      locale: 'en_IN',
      symbol: '₹',
      decimalDigits: 0,
    );

    return predictionState.when(
      data: (result) {
        if (result == null) return const SizedBox.shrink();
        
        return Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppColors.primary.withOpacity(0.15),
                AppColors.primary.withOpacity(0.05),
              ],
            ),
            borderRadius: BorderRadius.circular(AppConstants.borderRadius * 2),
            border: Border.all(
              color: AppColors.primary.withOpacity(0.3),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withOpacity(0.05),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_circle_outline,
                  color: AppColors.primary,
                  size: 40,
                ),
              ).animate().scale(delay: 100.ms, duration: 400.ms, curve: Curves.easeOutBack),
              const SizedBox(height: 24),
              Text(
                'VALUATION COMPLETE',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  letterSpacing: 2.0,
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                ),
              ).animate().fadeIn().scale(),
              const SizedBox(height: 16),
              FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  currencyFormat.format(result.predictedPrice),
                  style: Theme.of(context).textTheme.displayLarge?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                  ),
                ).animate().fadeIn(delay: 200.ms).moveY(begin: 10, end: 0),
              ),
              const SizedBox(height: 8),
              Text(
                'Estimated Market Value',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Theme.of(context).textTheme.bodyLarge?.color?.withOpacity(0.7),
                ),
              ).animate().fadeIn(delay: 400.ms),
              const SizedBox(height: 40),
              ElevatedButton.icon(
                onPressed: () => ref.read(predictionProvider.notifier).reset(),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 56),
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppConstants.borderRadius),
                  ),
                ),
                icon: const Icon(Icons.refresh),
                label: const Text(
                  'CALCULATE AGAIN',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ).animate().fadeIn(delay: 600.ms),
            ],
          ),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, stack) => _buildError(context, err.toString(), ref),
    );
  }

  Widget _buildError(BuildContext context, String error, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: AppTheme.glassDecoration(color: AppColors.error.withOpacity(0.1)),
      child: Column(
        children: [
          const Icon(Icons.error_outline, color: AppColors.error, size: 48),
          const SizedBox(height: 16),
          Text(
            'SIGNAL LOST',
            style: Theme.of(context).textTheme.labelSmall?.copyWith(color: AppColors.error),
          ),
          const SizedBox(height: 8),
          Text(
            error,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => ref.read(predictionProvider.notifier).reset(),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('RETRY CONFIGURATION'),
          ),
        ],
      ),
    );
  }
}
