process.on("uncaughtException", (err, origin) => {
  new Promise((resolve) => {
    setTimeout(resolve, 3000);
  }).then(() => {
    console.log("\n\nPromise resolved");
    process.exit(1);
  });
  console.log("Gets here");
  console.log("\n\n STACK", err.stack);
});

function hookStream(
  stream: NodeJS.WriteStream,
  callback: (...args: Parameters<NodeJS.WriteStream["write"]>) => void
) {
  const oldWrite = stream.write.bind(stream);

  stream.write = ((...args: Parameters<NodeJS.WriteStream["write"]>) => {
    callback(...args);
    return oldWrite(...args);
  }) as typeof stream.write;
}
const queue: (string | Uint8Array)[] = [];
hookStream(process.stdout, (str) => {
  queue.push(str);
});

hookStream(process.stderr, (str) => {
  queue.push(str);
});

async function main() {
  const err = new Error("Hello world");
  console.log(err.stack);
  console.error("something here");
  console.log(queue);
  // for (let i = 0; i < 1; i++) {
  //   deflate(input, (err, buffer) => {
  //     if (err) return console.log(err);
  //     // console.log(buffer.toString("base64"));
  //     console.log(input);
  //   });

  //   await new Promise((resolve) => {
  //     setTimeout(resolve, 2000);
  //   });
  // }
  // console.log(process.cwd());
  // throw new Error("test");
}

main();
