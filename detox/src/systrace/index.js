// TODO unit test
class SysTrace {
  constructor() {
    this.startSection = () => { throw new Error('Not initialized!') }
    this.endSection = () => { throw new Error('Not initialized!') }
  }

  init(chromeTracing) {
    this.chromeTracing = chromeTracing;
    this.startSection = (name, args) => this.chromeTracing.beginEvent(name, args);
    this.endSection = (name, args) => this.chromeTracing.finishEvent(name, args);
  }

  toArtifactExport(append) {
    const prefix = (append ? ',' : '[');
    return this.chromeTracing.traces({prefix})
  }
}

const systrace = new SysTrace();
async function systraceCall(sectionName, func) {
  let error;

  systrace.startSection(sectionName);
  try {
    return await func();
  } catch (e) {
    error = e;
    throw e;
  } finally {
    systrace.endSection(sectionName, { error });
  }
}

module.exports = {
  systrace,
  systraceCall,
};
