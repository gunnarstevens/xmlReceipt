import { ConsumerviewAppPage } from './app.po';

describe('consumerview-app App', function() {
  let page: ConsumerviewAppPage;

  beforeEach(() => {
    page = new ConsumerviewAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
