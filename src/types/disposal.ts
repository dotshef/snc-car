export interface DisposalRequest {
  name: string;
  phone: string;
  currentVehicle?: string;
  desiredCar?: string;
  privacyAgreed: boolean;
  submittedAt?: string;
}
