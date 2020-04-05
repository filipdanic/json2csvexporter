(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.CSVExportService = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * Provides an interface for mapping JS data types to a delimiter-separated value.
   * Creates a list of lists called rows and maps it to a Blob via toBlob().
   */
  var WriterService = /*#__PURE__*/function () {
    /**
     * Default constructors. Takes two optional params.
     * @param  {string} delimiter - Delimiter character(s) to be used in the CSV.
     * @param  {string} contentType - Type of file.
     */
    function WriterService() {
      var delimiter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ',';
      var contentType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text/csv';

      _classCallCheck(this, WriterService);

      this.delimiter = delimiter;
      this.contentType = contentType;
      this.rows = [[]];
    }
    /**
     * Returns the current row
     * @return {Array} - An array of values.
     */


    _createClass(WriterService, [{
      key: "wrapWithQuotes",

      /**
       * Returns the input string
       * @param  {string} string - The input string.
       * @return {string} - A safe strings wrapped in quotes.
       */
      value: function wrapWithQuotes(string) {
        var safeString = string.replace(/"/g, '""');
        return "\"".concat(safeString, "\"");
      }
      /**
       * @param {*} value
       * @return {string}
       */

    }, {
      key: "sanitizeValue",
      value: function sanitizeValue(value) {
        if (value === undefined || value === null || typeof value === 'function') {
          return '';
        }

        return String(value);
      }
      /**
       * Pushes a new value into the current row.
       * @param  {*} value - The value to push.
       */

    }, {
      key: "writeValue",
      value: function writeValue(value) {
        var stringValue = this.sanitizeValue(value);
        var needsQuotes = stringValue.indexOf(this.delimiter) !== -1 || /"\r\n/.test(stringValue);
        this.currentRow.push(needsQuotes ? this.wrapWithQuotes(stringValue) : stringValue);
      }
      /**
       * Adds a en empty array to rows property. This maps to an empty line.
       */

    }, {
      key: "writeLine",
      value: function writeLine() {
        this.rows.push([]);
      }
      /**
       * Flatten rows to a String.
       * @return {string} - A string representation of the rows..
       */

    }, {
      key: "toString",
      value: function toString() {
        var _this = this;

        return this.rows.map(function (row) {
          return row.join(_this.delimiter);
        }).reduce(function (content, row) {
          return "".concat(content, "\r\n").concat(row);
        });
      }
      /**
       * Transform the rows into a Blob.
       * @return {Object} - A representation of the rows in the form of
       * a Blob. The returned Object is an instance of Blob, but typeof Object.
       */

    }, {
      key: "toBlob",
      value: function toBlob() {
        return new Blob([this.toString()], {
          type: this.contentType
        });
      }
    }, {
      key: "currentRow",
      get: function get() {
        return this.rows[this.rows.length - 1];
      }
    }]);

    return WriterService;
  }();

  /**
   * Provides an ExportService that uses WriterService to mentain an in-memory representation of the CSV file.
   * Uses downloadCSV to map the [data] via the Writer to a Blob and initiate download which triggers the download of the actual file in the browser.
   * Provides static methods for Singleton-like usage.
   */

  var CSVExportService = /*#__PURE__*/function () {
    /**
     * Default constructor. Takes an optional options param.
     * @param  {Object} options - Provides the configuration options.
     */
    function CSVExportService(options) {
      _classCallCheck(this, CSVExportService);

      this.options = options || {};
    }
    /**
     * Shorthand for createCSV() with a pre-set writerType
    */


    _createClass(CSVExportService, [{
      key: "createCSVBlob",
      value: function createCSVBlob(data) {
        return this.createCSV(data);
      }
      /**
        * Shorthand for createCSV() with a pre-set writerType
      */

    }, {
      key: "dataToString",
      value: function dataToString(data) {
        return this.createCSV(data, 'string');
      }
      /**
       * Creates a Blob based on the provided data and configuration options.
       * @param  {Array} data - An array of JSON objects that will be mapped to the Blob.
       * @param  {String} writerType - ENUM for choosing the return type. Default to 'blo'
       * @return {Object|String} - The Blob object (Is an instance of Blob, but typeof Object) or a String version of the CSV with newlines.
       */

    }, {
      key: "createCSV",
      value: function createCSV(data) {
        var writerType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'blob';

        var _ref = this.options || {},
            optionsColumns = _ref.columns,
            optionsContentType = _ref.contentType,
            optionsDelimeter = _ref.delimeter,
            optionsDelimiter = _ref.delimiter,
            optionsFormatters = _ref.formatters,
            optionsHeaders = _ref.headers,
            optionsIncludeHeaders = _ref.includeHeaders;

        var contentType = optionsContentType || 'text/csv';
        var delimiter = optionsDelimeter || ',';
        var formatters = optionsFormatters || {};

        var getFormater = function getFormater(header) {
          return formatters[header] || function (v) {
            return v;
          };
        };

        var headerNames = optionsHeaders || {};
        var headers = optionsColumns || Object.getOwnPropertyNames(data[0]);
        var includeHeaders = optionsIncludeHeaders;
        var writer = new WriterService(delimiter, contentType);

        if (includeHeaders === undefined || includeHeaders) {
          headers.forEach(function (header) {
            return writer.writeValue(headerNames[header] || header);
          });
          writer.writeLine();
        }

        data.forEach(function (row) {
          headers.forEach(function (header) {
            return writer.writeValue(getFormater(header)(row[header]));
          });
          writer.writeLine();
        });
        return writerType === 'string' ? writer.toString() : writer.toBlob();
      }
      /**
       * Triggers the download of the file.
       * @param  {Object} blob - The blob to be downloaded.
       * @param  {String} filename - Name of the file.
       */

    }, {
      key: "download",
      value: function download(blob, filename) {
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, filename);
          return;
        }

        var link = document.createElement('A');
        var url = URL.createObjectURL(blob);
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

    }, {
      key: "downloadCSV",
      value: function downloadCSV(data) {
        try {
          var blob = this.createCSV(data, 'blob');
          var filename = this.options.filename || "export-".concat(new Date().getTime() / 1000 | 0, ".csv");
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

    }], [{
      key: "create",
      value: function create(options) {
        return new CSVExportService(options);
      }
      /**
       * Shorthand for initialization and download() call.
       * @param {Array} data - An array of objects to map and store.
       * @param {Object} options
       * @return {undefined}
       */

    }, {
      key: "download",
      value: function download(data) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return new CSVExportService(options).downloadCSV(data);
      }
    }]);

    return CSVExportService;
  }();

  return CSVExportService;

})));
//# sourceMappingURL=CSVExportService.js.map
