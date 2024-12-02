interface CredentialRequestOptions {
  otp: OTPOptions;
}
interface OTPOptions {
  transport: string[];
}

interface CredentialType {
  code: string
  type: string
}

declare class OTPCredential extends Credential {
  constructor(data: OTPCredentialData);

  readonly type: `otp`;

  /**
   * The credential’s One Time Password Code
   */
  readonly code: string | null;
}