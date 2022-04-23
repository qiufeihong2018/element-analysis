import { createTest, destroyVM } from '../util';
import Aaa from 'packages/aaa';

describe('Aaa', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(Aaa, true);
    expect(vm.$el).to.exist;
  });
});

