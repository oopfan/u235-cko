define(function() {
  function Store(args, accumulator, memory) {
    memory.setValue(args.to, accumulator.getValue());
  }
  return Store;
});
