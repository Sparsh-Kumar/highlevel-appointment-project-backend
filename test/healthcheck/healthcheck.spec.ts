
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';
import sinon from 'sinon';

chai.use(chaiHttp);
chai.use(chaiAsPromised);

let sinonSandbox: sinon.SinonSandbox;

describe('Todo.', () => {
  beforeEach(async () => {
    sinonSandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sinonSandbox.restore();
  });

  it('GET /health should return 200 status code.', async() => {

    // pretesting conditions

  });
});
