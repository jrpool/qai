// alerts.ts

// CONSTANTS

// Result of an attempt to send an alert.
export type AlertResult =
{status: 'delivered'} | {status: 'failed'; reason: string} | {status: 'unconfigured'};

// Configuration of an alert sender.
export type AlertConfig = {
  protocol?: 'http' | 'https';
  managerEmail?: string;
  apiHost?: string;
  apiPath?: string;
  apiKey?: string;
  from?: string;
  timeout?: number;
};

// FUNCTIONS

// Returns a function that sends an email alert to a manager.
export const makeSendAlert = (config: AlertConfig) => {
  const {
    protocol = 'https',
    managerEmail,
    apiHost,
    apiPath,
    apiKey,
    from,
    timeout = 3000
  } = config;
  return async (subject: string, body: string): Promise<AlertResult> => {
    // If the alert configuration is incomplete:
    if (! (managerEmail && apiHost && apiPath && apiKey && from)) {
      return {status: 'unconfigured'};
    }
    // Otherwise, i.e. if it is complete, ask the alerting host to send an alert to the manager.
    try {
      const response = await fetch(`${protocol}://${apiHost}${apiPath}`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${apiKey}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: [managerEmail],
          subject,
          text: body
        }),
        signal: AbortSignal.timeout(timeout)
      });
      // If this succeeded:
      if (response.status >= 200 && response.status < 300) {
        // Return this.
        return {status: 'delivered'};
      }
      // Otherwise, i.e. if it failed, return this and why.
      return {
        status: 'failed',
        reason: `Alert service responded with ${response.status} status (${await response.text()})`
      };
    }
    // If the request threw an error:
    catch (error) {
      const {message} = error as Error;
      // If it was a timeout:
      if (message.includes('timeout') || message.includes('aborted')) {
        // Return this.
        return {
          status: 'failed',
          reason: 'timeout'
        };
      }
      // Otherwise, i.e. if it was another network error, return this and why.
      return {
        status: 'failed',
        reason: message
      };
    }
  };
};
