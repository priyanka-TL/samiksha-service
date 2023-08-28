/**
 * Book entity, used for filtering as well.
 */
export class Model {
  /**
   * @type {string} id Unique string identifier.
   */
  _id: number;

  /**
   * @type {string} title The title of the book.
   */
  externalId: String;

  /**
   * @type {string} author The author of the book.
   */
  name: String;
}
