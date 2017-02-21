import { ActivatePage } from './app.po';

describe('activate App', () => {
  let page: ActivatePage;

  beforeEach(() => {
    page = new ActivatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
