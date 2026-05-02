export interface MeResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isFreelancer?: boolean;
  status: string;
  companyId?: string | null;
  companyName?: string | null;
  industry?: string | null;
  phoneNumber?: string | null;
}
