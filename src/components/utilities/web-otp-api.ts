let form: HTMLFormElement | null;
let ac: AbortController | null;
function closestElement(selector :string, el :Element | Window | Document | null ) :HTMLFormElement | null { /* https://stackoverflow.com/questions/54520554/custom-element-getrootnode-closest-function-crossing-multiple-parent-shadowd */
  if(el === null) {
    return null;
  }
  return ((el && el instanceof Element && el.closest(selector))
    || closestElement(selector, el instanceof Element && (el.getRootNode() as ShadowRoot).host || null)
  );
}

export function webOtpApiInit(renderRoot: HTMLElement | DocumentFragment): void {

  if ("OTPCredential" in window) {
    const input = renderRoot.querySelector("input[autocomplete=\"one-time-code\"]") as HTMLInputElement | null;

    if (!input || !navigator.credentials) {
      return;
    }

    /* handle manual submit */
    ac = new AbortController(); // Cancel the WebOTP API if the form is submitted manually.
    form = closestElement("form", input);
    form?.addEventListener("submit", () => {
      ac?.abort("Form submitted manually"); // Cancel WebOTP API.
    });

    navigator.credentials.get({
      otp: { transport: ["sms"] },
      signal: ac.signal
    }).then( (otp) => {
      input.value = <string>(otp as OTPCredential)?.code;
      input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));
      form?.dispatchEvent(new Event('submit'));
    }).catch(err => {
      import.meta.env.DEV && console.log("WebOPT API error:", err);
    });

  }
}

export function webOtpApiClose() {
  ac?.abort("User navigated away from page");
  form?.removeEventListener("submit", () => {
    ac?.abort("Form submitted manually");
  });
}