# json2csvexporter

This is a simple little library for exporting simple JSON structures to a CSV file. The download will trigger the user to save the file to their system. The library itself does not handle any File I/O.

Currently, json2csvexporter does not support nested JSON data. As such, you will probably need to reduce complex structures into a simple `key: value` schema.

To install:

`npm i json2csvexporter --save`

Table of contents:

1. Simple Example
2. Example with Custom Options
3. Example with TSV and Formaters
4. API and Options Docs
5. Contributing

## Simple Example

In this simple example we take a JSON object and print all of the properties in it to the CSV.

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

In this example we will take the same JSON object from the previous example, but only print a list of proprties that we want. We will also decorate the headers with different names.

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

## Example with TSV and Formaters

In this example we will make a TSV file and create formatter functions to style the content of certain properties.

```javascript
import CSVExportService from 'json2csvexporter';
...
// using the same vehiclesJSON as before...

const exporter = CSVExportService.create({
  contentType: 'text/tsv',
  filename: 'newformat.tsv',
  delimeter: '\t',
  formatters: {
    id: (id) => {
      return `#${id}`;
    },
    model: (model) => {
      return model || 'Unkown model';
    },
    year: (year) => {
      return year || 'Unkown year';
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
#3  Toyota  Unkown model  Unkown year
```

## API and Options Docs

### Options

When creating a new `CSVExportService` you can pass in an options objects. These are the options that you can use:

- `columns`: an Array of Strings. Each element represents a property of the JSON object that should be extracted. If it is not provided, then the exporter will iterate through all of the properties.

- `contentType`: the content type of the file. Default is `text/csv`

- `delimeter`: the delimeter to seperate values. Default is a comma.

- `formatters`: an Object. Each property defines how to format a value coresponding to the same key.

- `headers`: an Object. Works as a map to stylize keys in the header. E.g. `{firstName: 'First Name'}`

- `includeHeaders`: a Boolean. Defaults to true.

- `devMode`: a Boolean. Useful for debugging. Defaults to false.

### API

The `CSVExportService` implements two static methods: `create(options)` which returns a new instance of CSVExportSevice and `download(data, options)` which initalizes a new service and downloads the data right away.

For more info, dive into the code. It is a very simple class.


## Contributing

1. Submit issues or suggest features.
2. Send PRs with bugfixes, tests, new methods, better docs etc.
3. Share the love!
