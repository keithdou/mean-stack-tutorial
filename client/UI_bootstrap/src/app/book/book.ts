export class Book {
  public constructor(init?: Partial<Book>) {
    Object.assign(this, init);
  }

  title: string;
  author: string;
}
