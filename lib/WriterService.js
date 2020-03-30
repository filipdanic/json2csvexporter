"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

exports.default = WriterService;