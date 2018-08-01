import WriterService from './WriterService';
/**
 * Provides an ExportService that uses WriterService to mentain an in-memory representation of the CSV file.
 * Uses downloadCSV to map the [data] via the Writer to a Blob and initiate download which triggers the download of the actual file in the browser.
 * Provides static methods for Singleton-like usage.
 */
export default class CSVExportService {
  /**
   * Default constructor. Takes an optional options param.
   * @param  {Object} options - Provides the configuration options.
   */
  constructor(options) {
    this.options = options || {};
  }

  /**
   * Shorthand for createCSV() with a pre-set writerType
  */
  createCSVBlob(data) {
    return this.createCSV(data);
  }

  /**
    * Shorthand for createCSV() with a pre-set writerType
  */
  dataToString(data) {
    return this.createCSV(data, 'string');
  }

  /**
   * Creates a Blob based on the provided data and configuration options.
   * @param  {Array} data - An array of JSON objects that will be mapped to the Blob.
   * @param  {String} writerType - ENUM for choosing the return type. Default to 'blo'
   * @return {Object|String} - The Blob object (Is an instance of Blob, but typeof Object) or a String version of the CSV with newlines.
   */
  createCSV(data, writerType = 'blob') {
    const {
      columns: optionsColumns,
      contentType: optionsContentType,
      delimeter: optionsDelimeter, // delimeter is a common miss-spelling of “delimiter”
      delimiter: optionsDelimiter,
      formatters: optionsFormatters,
      headers: optionsHeaders,
      includeHeaders: optionsIncludeHeaders,
    } = this.options || {};
    const contentType = optionsContentType || 'text/csv';
    const delimiter = optionsDelimeter || ',';
    const formatters = optionsFormatters || {};
    const getFormater = header => formatters[header] || (v => v);
    const headerNames = optionsHeaders || {};
    const headers = optionsColumns || Object.getOwnPropertyNames(data[0]);
    const includeHeaders = optionsIncludeHeaders;
    const writer = new WriterService(delimiter, contentType);

    if (includeHeaders === undefined || includeHeaders) {
      headers.forEach(header => writer.writeValue(headerNames[header] || header));
      writer.writeLine();
    }
    data.forEach(row => {
      headers.forEach(header => writer.writeValue(getFormater(header)(row[header])));
      writer.writeLine();
    });
    return writerType === 'string' ? writer.toString() : writer.toBlob();
  }
  /**
   * Triggers the download of the file.
   * @param  {Object} blob - The blob to be downloaded.
   * @param  {String} filename - Name of the file.
   */
  download(blob, filename) {
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
      return;
    }
    const link = document.createElement('A');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Creates and passes the blob and filename params to the download() method. In case of error, calls the onError callback (if provided) and prints a error mesage if devMode is enabled via options.
   * @param  {Array} data - An array of objects to map and store.
   */
  downloadCSV(data) {
    try {
      const blob = this.createCSV(data, 'blob');
      const filename = this.options.filename || `export-${new Date().getTime() / 1000 | 0}.csv`;
      this.download(blob, filename);
    } catch (err) {
      if (this.options.devMode) {
        console.error('Error downloading CSV. Send this log to the developers: \n', err);
      }
      if (this.options.onError) {
        this.options.onError(err);
      }
    }
  }

  /**
   * Shorthand for constructor.
   * @param  {Object} options
   * @return {Object} - An instance of CSVExportService
   */
  static create(options) {
    return new CSVExportService(options);
  }

  /**
   * Shorthand for initialization and download() call.
   * @param {Array} data - An array of objects to map and store.
   * @param {Object} options
   * @return {undefined}
   */
  static download(data, options = {}) {
    return new CSVExportService(options).downloadCSV(data);
  }
}
