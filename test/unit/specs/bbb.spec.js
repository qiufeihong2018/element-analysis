import { createTest, destroyVM } from '../util';
import Bbb from 'packages/bbb';

describe('Bbb', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(Bbb, true);
    expect(vm.$el).to.exist;
  });
});

