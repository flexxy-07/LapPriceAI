class LaptopMetadata {
  final List<String> companies;
  final List<String> types;
  final List<String> opsys;
  final List<String> cpuBrands;
  final List<String> gpuBrands;

  LaptopMetadata({
    required this.companies,
    required this.types,
    required this.opsys,
    required this.cpuBrands,
    required this.gpuBrands,
  });

  factory LaptopMetadata.fromJson(Map<String, dynamic> json) {
    return LaptopMetadata(
      companies: List<String>.from(json['companies'] ?? []),
      types: List<String>.from(json['types'] ?? []),
      opsys: List<String>.from(json['opsys'] ?? []),
      cpuBrands: List<String>.from(json['cpu_brands'] ?? []),
      gpuBrands: List<String>.from(json['gpu_brands'] ?? []),
    );
  }

  factory LaptopMetadata.empty() {
    return LaptopMetadata(
      companies: [],
      types: [],
      opsys: [],
      cpuBrands: [],
      gpuBrands: [],
    );
  }
}
