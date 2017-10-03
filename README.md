# json2csvexporter

This is a simple little library for exporting simple JSON structures to a CSV file. The download will trigger the user to save the file to their system. The library itself does not handle any File I/O.

Currently, json2csvexporter does not support nested JSON data. As such, you will probably need to reduce complex structures into a simple `key: value` schema.

To install:

`npm i json2csvexporter --save`

Table of contents:

1. [Simple Example](#simple-example)
2. [Example with Custom Options](#example-with-custom-options)
3. [Example with TSV and Formatters](#example-with-tsv-and-formaters)
4. [JSON to CSV/TSV encoded String/Blob (without downloading on the client)](#json-to-csvtsv-encoded-stringblob-without-downloading-on-the-client)
4. [API and Options Docs](#api-and-options-docs)
5. [Contributing](#contributing)

## Simple Example

In this simple example we take a JSON object and print all of the properties in it to the CSV. There is also [an online demo available via RequireBin.](http://requirebin.com/?gist=a830925068890ad30533e13e51206194)

```javascript
import CSVExportService from 'json2csvexporter';
...
const vehiclesJSON = [
  {id: 1, make: 'Toyota', model: 'Corolla', year: 2014},
  {id: 2, make: 'Ford', model: 'Mustang', year: 2012},
  {id: 3, make: 'Toyota', model: '', year: ''}
];
const exporter = CSVExportService.create();
exporter.downloadCSV(vehiclesJSON);
```

This will generate the following CSV:

```csv
id,make,model,year
1,Toyota,Corolla,2014
2,Ford,Mustang,2012
3,Toyota,,
```

## Example with Custom Options

In this example, we will take the same JSON object from the previous example, but only print a list of properties that we want. We will also decorate the headers with different names.

```javascript
import CSVExportService from 'json2csvexporter';
...
const csvColumnsList = ['id', 'make', 'model', 'year'];
const csvColumnsMap = {
  id: 'ID',
  make: 'Make',
  model: 'Model Name',
  year: 'Year'
};
const vehiclesJSON = [
  {id: 1, make: 'Toyota', model: 'Corolla', year: 2014},
  {id: 2, make: 'Ford', model: 'Mustang', year: 2012},
  {id: 3, make: 'Toyota', model: '', year: ''}
];
const exporter = CSVExportService.create({
  columns: csvColumnsList,
  headers: csvColumnsMap,
  includeHeaders: true,
});
exporter.downloadCSV(vehiclesJSON);
```
This will generate the following CSV:

```csv
ID,Make,Model Name,Year
1,Toyota,Corolla,2014
2,Ford,Mustang,2012
3,Toyota,,
```

## Example with TSV and Formatters

In this example, we will make a TSV file and create formatting functions to style the content of certain properties.

```javascript
import CSVExportService from 'json2csvexporter';
...
// using the same vehiclesJSON as before...

const exporter = CSVExportService.create({
  contentType: 'text/tsv',
  filename: 'newformat.tsv',
  delimiter: '\t',
  formatters: {
    id: (id) => {
      return `#${id}`;
    },
    model: (model) => {
      return model || 'Unknown model';
    },
    year: (year) => {
      return year || 'Unknown year';
    }
  }
});
exporter.downloadCSV(vehiclesJSON);

```

This will generate the following TSV:

```tsv
id  make  model year
#1  Toyota  Corolla 2014
#2  Ford  Mustang 2012
#3  Toyota  Unknown model  Unknown year
```

## JSON to CSV/TSV encoded String/Blob (without downloading on the client)

```javascript
import CSVExportService from 'json2csvexporter';
...
const vehiclesJSON = [
  {id: 1, make: 'Toyota', model: 'Corolla', year: 2014},
  {id: 2, make: 'Ford', model: 'Mustang', year: 2012},
  {id: 3, make: 'Toyota', model: '', year: ''}
];
const exporter = CSVExportService.create();
exporter.dataToString(vehiclesJSON);
```

This will return the CSV as a JavaScript String. This allows you to further manipulate the data, save to a file, a database or anything else.

Similarly, calling:

```javascript
exporter.createCSVBlob(vehiclesJSON);
```

Will return a `Blob {size: 76, type: "text/csv"}`, or in other words, a regular JavaScript blob object that is encoded as the type you specified (in this case a plain text/csv). You then manipulate this Blob object however you like.


## API and Options Docs

### Options

When creating a new `CSVExportService` you can pass in an options objects. These are the options that you can use:

- `columns`: an Array of Strings. Each element represents a property of the JSON object that should be extracted. If it is not provided, then the exporter will iterate through all of the properties.

- `contentType`: the content type of the file. Default is `text/csv`

- `delimiter`: the delimiter to separate values. The default is a comma.

- `formatters`: an Object. Each property defines how to format a value corresponding to the same key.

- `headers`: an Object. Works as a map to stylize keys in the header. E.g. `{firstName: 'First Name'}`

- `includeHeaders`: a Boolean. Defaults to true.

- `devMode`: a Boolean. Useful for debugging. Defaults to false.

### API

The `CSVExportService` implements two static methods: `create(options)` which returns a new instance of CSVExportService and `download(data, options)` which initializes a new service and downloads the data right away.

For more info, dive into the code. It is a very simple class.

## Browsers support 

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Opera | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari-ios.png" alt="iOS Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari |
| --------- | --------- | --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| 4+ | 13+ | 5+ | 12+ | 7+ | 


## Contributing

1. Submit issues or suggest features.
2. Send PRs with bug fixes, tests, new methods, better docs etc.
3. Share the love!

## Contributor list

1. [@filipdanic](https://github.com/filipdanic)
2. [@androidfanboi](https://github.com/androidfanboi)
3. [@erickzhao](https://github.com/erickzhao)
