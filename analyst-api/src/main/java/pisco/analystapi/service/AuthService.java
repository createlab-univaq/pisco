package pisco.analystapi.service;

import pisco.analystapi.model.dto.LoginRequestDTO;
import pisco.analystapi.model.dto.LoginResponseDTO;

public interface AuthService {

    LoginResponseDTO login(LoginRequestDTO request);
}
