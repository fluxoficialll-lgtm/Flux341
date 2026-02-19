import { USE_MOCKS } from "../mocks/index";
import { authService as RealAuthService } from "../real/authService";
import { authService as MockAuthService } from "../mocks/authService";

export const authService = USE_MOCKS ? MockAuthService : RealAuthService;
