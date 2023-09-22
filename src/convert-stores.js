const fs = require('fs');
const json2md = require('json2md');
const xml2js = require('xml2js');
const yaml = require('js-yaml');

// Read the XML file
fs.readFile('db/stores.xml', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Parse the XML to JSON
  const parser = new xml2js.Parser();
  parser.parseString(data, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }

    // Convert the JSON to Markdown
    const markdown = json2md([
      { h1: 'Apple Stores in China' },
      ...result.records.country.map(country => ({
        h2: country.$.name,
        table: {
          headers: ['Name', 'Apple ID', 'City', 'Phone', 'Longitude', 'Latitude', 'Link'],
          rows: country.state.map(state => state.store.map(store => [
            store.name[0],
            store.appleid[0],
            state.$.name,
            store.phone[0],
            store.longitude[0],
            store.latitude[0],
            `[Link](${store.link[0]})`
          ])).flat()
        }
      }))
    ]);

    // Write the Markdown to a file
    fs.writeFile('db/stores.md', markdown, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Markdown file written successfully!');
    });

    // Convert the JSON to a string
    const jsonString = JSON.stringify(result);


    // Write the JSON to a file
    fs.writeFile('db/stores.json', jsonString, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('JSON file written successfully!');
    });
  });
});