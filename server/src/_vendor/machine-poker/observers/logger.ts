import { inspect } from 'util';

export function complete(status: any) {
  if (status.state === 'complete') {
    process.stdout.write(`\n${inspect(status, false, 6)}\n`);
  }
}
