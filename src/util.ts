// util.ts

const log: (level: 'error' | 'warning' | 'info', message: string) => void = (level: string, message: string) => {
  console.log(JSON.stringify({
    level,
    message
  }, null, 2));
};

export {log};
