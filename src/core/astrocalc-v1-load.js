define(function() {
  function Load(args, accumulator, memory) {
    accumulator.setValue(memory.getValue(args.from));
  }
  return Load;
});
