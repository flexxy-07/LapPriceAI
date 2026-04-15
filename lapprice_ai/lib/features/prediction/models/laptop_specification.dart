class LaptopSpecification {
  final String company;
  final String product;
  final String typeName;
  final int ram;
  final String opSys;
  final double weight;
  final int touchscreen; // 0 or 1
  final int ips; // 0 or 1
  final double ppi;
  final String cpuBrand;
  final String gpuBrand;
  final int ssd;
  final int hdd;

  LaptopSpecification({
    required this.company,
    required this.product,
    required this.typeName,
    required this.ram,
    required this.opSys,
    required this.weight,
    required this.touchscreen,
    required this.ips,
    required this.ppi,
    required this.cpuBrand,
    required this.gpuBrand,
    required this.ssd,
    required this.hdd,
  });

  Map<String, dynamic> toJson() {
    return {
      'Company': company,
      'Product': product,
      'TypeName': typeName,
      'Ram': ram,
      'OpSys': opSys,
      'Weight': weight,
      'Touchscreen': touchscreen,
      'IPS': ips,
      'PPI': ppi,
      'Cpu_Brand': cpuBrand,
      'Gpu_Brand': gpuBrand,
      'SSD': ssd,
      'HDD': hdd,
    };
  }
}
