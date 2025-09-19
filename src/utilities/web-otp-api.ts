let form: HTMLFormElement | null;
let ac: AbortController | null;
let handleManualSubmit: () => void;

function closestElement(selector :string, el :Element | Window | Document | null ) :HTMLFormElement | null { /* https://stackoverflow.com/questions/54520554/custom-element-getrootnode-closest-function-crossing-multiple-parent-shadowd */
  if(el === null) {
    return null;
  }
  return ((el && el instanceof Element && el.closest(selector))
    || closestElement(selector, el instanceof Element && (el.getRootNode() as ShadowRoot).host || null)
  );
}

export function webOtpApiInit(renderRoot: HTMLElement | DocumentFragment): void {

  if ('OTPCredential' in window) {
    const input = renderRoot.querySelector('input[autocomplete="one-time-code"]') as HTMLInputElement | null;

    if (!input || !navigator.credentials) {
      return;
    }

    /* handle manual submit */
    ac = new AbortController(); // Cancel the WebOTP API if the form is submitted manually.
    form = closestElement('form', input);

    handleManualSubmit = () => {
      ac?.abort('Form submitted manually'); // Cancel WebOTP API.
    };
    form?.addEventListener('submit', handleManualSubmit);

    navigator.credentials.get({
      otp: { transport: ['sms'] },
      signal: ac.signal,
    }).then( (otp) => {
      if (!<string>(otp as OTPCredential)?.code) {
        return;
      }
      const otpCode = <string>(otp as OTPCredential).code;

      const submit = () => {
        form?.requestSubmit();
      };

      if (otpCode.length >= input.maxLength) {
        input.addEventListener('mid-complete', submit, { once: true });
      }

      input.value = otpCode;
      input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));

    }).catch(err => {
      if (err.name !== 'AbortError') {
        import.meta.env.DEV && console.log('WebOTP API error:', err);
      }
    });

  }
}

export function webOtpApiClose() {
  ac?.abort('User navigated away from page');
  if (form && handleManualSubmit) {
    form.removeEventListener('submit', handleManualSubmit);
  }
}
