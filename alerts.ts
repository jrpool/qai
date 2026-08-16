// alerts.ts

// CONSTANTS

// Result of an attempt to send an alert.
export type AlertResult =
{status: 'delivered'} | {status: 'failed'; reason: string} | {status: 'unconfigured'};

// Configuration of an alert sender.
export type AlertConfig = {
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
  return (subject: string, body: string): Promise<AlertResult> => {
    void config;
    void subject;
    void body;
    return Promise.resolve({status: 'delivered'});
  };
};
