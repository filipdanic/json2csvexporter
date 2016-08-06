/**
 * Provides an interface for maping JS datatypes to a delimiter-seperated value.
 * Creates a list of lists called rows and maps it to a Blob via toBlob().
 */
export default class WriterService {
  /**
   * Default constructors. Takes two optional params.
   * @param  {String} delimiter - Delimiter character(s) to be used in the CSV.
   * @param  {String} contentType - Type of file.
   */
  constructor(delimiter = ',', contentType = 'text/csv') {
    this.delimiter = delimiter;
    this.contentType = contentType;
    this.rows = [[]];
  }
  /**
   * Returns the current row
   * @return {Array} - An array of values.
   */
  get currentRow() {
    return this.rows[this.rows.length - 1];
  }
  /**
   * Returns the input string
   * @param  {String} string - The input string.
   * @return {String} - A safe strings wrapped in quotes.
   */
  wrapWithQuotes(string) {
    const safeString = string.replace(/"/g, '""');
    return `"${safeString}"`;
  }
  /**
   * Pushes a new value into the current row.
   * @param  {Any} value - The value to push.
   */
  writeValue(value) {
    const stringValue = value === undefined ? '' : String(value);
    const needsQuotes = stringValue.indexOf(this.delimiter) !== -1 || /"\r\n/.test(stringValue);
    this.currentRow.push(needsQuotes ? this.wrapWithQuotes(stringValue) : stringValue);
  }
  /**
   * Adds a en empty array to rows property. This maps to an empty line.
   */
  writeLine() {
    this.rows.push([]);
  }
  /**
   * Flatten rows to a String.
   * @return {String} - A string representation of the rows..
   */
  toString() {
    return this.rows.map(row => {
      return row.join(this.delimiter);
    }).reduce((content, row) => {
      return `${content}\r\n${row}`;
    });
  }
  /**
   * Transform the rows into a Blob.
   * @return {Object} - A representation of the rows in the form of a Blob. The returned Object is an instance of Blob, but typeof Object.
   */
  toBlob() {
    return new Blob([this.toString()], {type: this.contentType});
  }
}
