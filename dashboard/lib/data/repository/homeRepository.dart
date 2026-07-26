import 'package:software_analista/data/service/homeService.dart';
import 'package:software_analista/domain/models/risultatoTest.dart';

class HomeRepository {
  final HomeService service;

  HomeRepository(this.service);

  Future<List<Test>> getAllTentativi() {
    return service.getAllTentativi();
  }
}
