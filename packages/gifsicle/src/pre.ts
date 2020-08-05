import { GifsicleModule } from './gifsicle';

// write input file to FS of WASM before executing gifsicle
Module.preRun = Module.preRun || [];
Module.preRun.push(function writeInputFile() {
  const data = (Module as GifsicleModule).input;
  FS.writeFile('/input.gif', data);
});

// send output file from FS of WASM back to the JS
Module.postRun = Module.postRun || [];
Module.postRun.push(function getOutputFile() {
  const data = FS.readFile('/output.gif');
  (Module as GifsicleModule).output(data);
});
