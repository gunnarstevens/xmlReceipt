import { ConsumerviewPage } from './app.po';

describe('consumerview App', function() {
  let page: ConsumerviewPage;

  beforeEach(() => {
    page = new ConsumerviewPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
