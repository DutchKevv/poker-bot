import fs from 'fs';

export default function createGameObserver(filename: string) {
  let buffers: string[] = [];
  let ready: boolean = false;
  let finished: boolean = false;
  let finishedCallback: (() => void) | undefined = undefined;
  let gameCount: number = 0;

  const stream = fs.createWriteStream(`${process.cwd()}/${filename}`);

  stream.once('open', () => {
    ready = true;
    write("[\n");
  });

  stream.once('close', () => {
    observerFinished();
  });

  const write = (data: string, end?: boolean) => {
    if (ready) {
      for (const buffer of buffers) {
        stream.write(buffer);
      }
      if (end) {
        stream.end(data);
      } else {
        stream.write(data);
      }
    } else {
      buffers.push(data);
    }
  };

  const observerFinished = () => {
    finished = true;
    if (finishedCallback) {
      finishedCallback();
    }
  };

  return {
    complete(game: any) {
      if (gameCount > 0) {
        write(`,\n${JSON.stringify(game)}`);
      } else {
        write(`${JSON.stringify(game)}`);
      }
      gameCount++;
    },

    tournamentComplete(players: any[]) {
      write(']', true);
    },

    onObserverComplete(callback: () => void) {
      if (finished) {
        setImmediate(callback);
      } else {
        finishedCallback = callback;
      }
    },
  };
}
