import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants.dart';
import '../../../../core/theme.dart';
import '../../models/laptop_specification.dart';
import '../../providers/prediction_provider.dart';

class SpecForm extends ConsumerStatefulWidget {
  const SpecForm({super.key});

  @override
  ConsumerState<SpecForm> createState() => _SpecFormState();
}

class _SpecFormState extends ConsumerState<SpecForm> {
  final _formKey = GlobalKey<FormState>();
  
  // Form fields
  String? selectedCompany;
  String? selectedType;
  String? selectedCpu;
  String? selectedGpu;
  String? selectedOpSys;
  String product = "Generic Laptop";
  double ram = 8;
  double ssd = 256;
  double hdd = 0;
  double weight = 2.0;
  double ppi = 141.0;
  bool touchscreen = false;
  bool ips = true;

  @override
  Widget build(BuildContext context) {
    final metadataAsync = ref.watch(metadataProvider);
    final predictionState = ref.watch(predictionProvider);

    return metadataAsync.when(
      data: (metadata) => Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDropdown('Company', metadata.companies, (val) => selectedCompany = val),
            const SizedBox(height: 16),
            _buildDropdown('Laptop Type', metadata.types, (val) => selectedType = val),
            const SizedBox(height: 16),
            _buildDropdown('CPU Brand', metadata.cpuBrands, (val) => selectedCpu = val),
            const SizedBox(height: 16),
            _buildDropdown('GPU Brand', metadata.gpuBrands, (val) => selectedGpu = val),
            const SizedBox(height: 16),
            _buildDropdown('Operating System', metadata.opsys, (val) => selectedOpSys = val),
            const SizedBox(height: 24),
            
            _buildSlider('RAM (GB)', ram, 4, 64, (val) => setState(() => ram = val)),
            _buildSlider('SSD (GB)', ssd, 0, 2048, (val) => setState(() => ssd = val)),
            _buildSlider('HDD (GB)', hdd, 0, 2048, (val) => setState(() => hdd = val)),
            _buildSlider('Weight (kg)', weight, 0.5, 5.0, (val) => setState(() => weight = val)),
            _buildSlider('PPI', ppi, 80, 400, (val) => setState(() => ppi = val)),
            
            Row(
              children: [
                _buildSwitch('Touchscreen', touchscreen, (val) => setState(() => touchscreen = val)),
                const Spacer(),
                _buildSwitch('IPS Panel', ips, (val) => setState(() => ips = val)),
              ],
            ),
            
            const SizedBox(height: 32),
            
            if (predictionState.isLoading)
              _buildLoadingOverlay()
            else
              ElevatedButton(
                onPressed: _submit,
                child: const Text('CALCULATE VALUE'),
              ),
          ],
        ),
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, stack) => Center(child: Text('Error: $err')),
    );
  }

  Widget _buildDropdown(String label, List<String> items, Function(String?) onChanged) {
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(labelText: label),
      items: items.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
      onChanged: onChanged,
      validator: (val) => val == null ? 'Please select $label' : null,
    );
  }

  Widget _buildSlider(String label, double value, double min, double max, Function(double) onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('$label: ${value.toInt()}', style: Theme.of(context).textTheme.bodyMedium),
        Slider(
          value: value,
          min: min,
          max: max,
          divisions: (max - min).toInt(),
          activeColor: AppColors.primary,
          onChanged: onChanged,
        ),
      ],
    );
  }

  Widget _buildSwitch(String label, bool value, Function(bool) onChanged) {
    return Row(
      children: [
        Text(label, style: Theme.of(context).textTheme.bodyMedium),
        Switch(
          value: value,
          activeColor: AppColors.primary,
          onChanged: onChanged,
        ),
      ],
    );
  }

  Widget _buildLoadingOverlay() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 20),
      decoration: AppTheme.glassDecoration(),
      child: Column(
        children: [
          const CircularProgressIndicator(),
          const SizedBox(height: 16),
          Text(
            'Analyzing Market Dynamics...',
            style: Theme.of(context).textTheme.labelSmall,
          ),
        ],
      ),
    );
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      final spec = LaptopSpecification(
        company: selectedCompany!,
        product: product,
        typeName: selectedType!,
        ram: ram.toInt(),
        opSys: selectedOpSys!,
        weight: weight,
        touchscreen: touchscreen ? 1 : 0,
        ips: ips ? 1 : 0,
        ppi: ppi,
        cpuBrand: selectedCpu!,
        gpuBrand: selectedGpu!,
        ssd: ssd.toInt(),
        hdd: hdd.toInt(),
      );
      
      ref.read(predictionProvider.notifier).predict(spec);
    }
  }
}
