export interface RunnerSettings {
  id: string;
  v1_16_1: {
    enabled: number;
    second_structure: number;
    first_portal: number;
    enter_stronghold: number;
    enter_end: number;
    credits: number;
  };
}

export interface TokenSettingsResponse {
  v1_16_1: {
    enabled: number;
    second_structure: number;
    first_portal: number;
    enter_stronghold: number;
    enter_end: number;
    credits: number;
  };
  runners: RunnerSettings[];
}

export interface TokenForRunnerParams {
  runnerId: string;
}

export interface TokenForRunnerResponse {
  message: string;
  runnerId: string;
  expoToken: string;
}

export interface UpdateRunnerSettingsParams {
  runnerId: string;
  v1_16_1_enabled?: number;
  v1_16_1_second_structure?: number;
  v1_16_1_first_portal?: number;
  v1_16_1_enter_stronghold?: number;
  v1_16_1_enter_end?: number;
  v1_16_1_credits?: number;
}

export interface UpdateRunnerSettingsResponse {
  message: string;
  runnerId: string;
  expoToken: string;
}
