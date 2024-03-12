"use strict";

const MinHeap = require("./heap.js");
// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {
    let mergedAsyncEntriesHeap = new MinHeap();
    let promiseArray = [];
    // for each on all sources
    logSources.forEach(async (logSource) => {
      while (!logSource.drained) {
        // make a large array of all promises that will add the truthy values to the heap when they resolve
        promiseArray.push(
          logSource.popAsync().then((result) => {
            if (result) {
              mergedAsyncEntriesHeap.insert(result);
            }
          })
        );
      }
    });

    const handleBatchesOfPromises = (promises) => {
      const batchSize = 100;
      let batch = [];

      for (const promise of promises) {
        batch.push(promise);

        if (batch.length === batchSize) {
          Promise.all(batch)
            .then((resolvedValues) => {}) // nothing needs to be done here yet because all promises might not resolved yet
            .catch((error) => {
              console.error(error);
            });
          batch = []; // Reset batch
        }
      }

      // Handle any remaining promises
      if (batch.length > 0) {
        Promise.all(batch)
          .then((resolvedValues) => {
            // all promises are not resolved so can start reading from the heap
            while (mergedAsyncEntriesHeap.getMin()) {
              printer.print(mergedAsyncEntriesHeap.remove());
            }
            resolve(console.log("Async sort complete."));
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };

    // resolve all promises
    handleBatchesOfPromises(promiseArray);
  });
};
