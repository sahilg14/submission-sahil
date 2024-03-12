"use strict";
const _ = require("lodash");
const MinHeap = require("./heap.js");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  // const mergedEntriesArray = [];
  const mergedEntriesHeap = new MinHeap();
  // for each on all sources
  logSources.forEach((logSource) => {
    while (!logSource.drained) {
      const entry = logSource.pop();
      // mergedEntriesArray.push(entry);
      if (entry) mergedEntriesHeap.insert(entry);
    }
    // mergedEntriesArray.sort((a, b) => a.date - b.date);
  });

  // mergedEntriesArray.forEach((entry) => printer.print(entry));
  while (mergedEntriesHeap.getMin()) {
    printer.print(mergedEntriesHeap.remove());
  }

  return console.log("Sync sort complete.");
};
