# Analytical Atom Data Generator

This is a very simple application that generates arbitrary fake values (e.g. coming from sensors) and serves them via json-files or http requests. I use it to simulate dezentralized analytics scenarios, but it can be adapted for any other purpose where fake data sources are needed.

**Implementation details:**

* Build with nodejs

**Features:**

* configurable via simple json file
* easily extensible (Add your own field types and custom value generators)
* provides values via a http interface or writes results in json files
* simulate as many sensors/data sources as you need with only one running instance

### Get started

**1.  Configuration**

Change the config.json.sample to config.json in the root directory and edit it to fit your needs. Find more information about the config.json below.

**2.  Run the application**

You can run the application easily with `node app.js` from the root directory (take care that a config.json file exists).
As soon as the application is running you can see the logs in the console.

**2.1. Access via http**

You can easily access the data sources with your browser at *http://localhost:8000/##atomid##*. The ##atomid## part has to be replaced with the id you choose in your config.json e.g. http://localhost:8000/thermometer
The response will be a json string similar to something like this:
`{"name":"thermometer","temperature":22,"humidity":8}`

**2.2. Write results in file**

In the file mode the results are written in the output directory e.g. *output/##atomid##.json*. Each atom gets its own file.

**2.3 Fallback: console output**

If no or an unknown mode is defined the application just prints the output in the console.

### Configuration (config.json)

#### == General configuration ==
The main configuration contains the following elements

**1. id** sets the name of your atom.

**2. publish_intervall** defines the interval in milliseconds (e.g. 5000 = 5s) how often a message of an atom will be published

**3. mode** sets the way you access the values. Current modes are file, console and http. If not set console is used as default.

**4. fields:** a json array of the fields that the data source incorporates.

**4.1 name:** name of a certain field in your atom.

**4.2 generator:** used generator to fill the values of this field (details below).

**4.3 parameters:** used to configure the generator (details below).

#### == Generators ==
Currently the following value generators are implemented

**1. currentTimestamp** returns the current timestamp. *(no additional parameters necessary)*

**2. floatRange** Fallback generator that simply returns a random float value. . *(parameters [from, to, decimal])*

**3. integerRange** Fallback generator that simply returns a random integer value. *(parameters [from, to])*


### Contribute and future work
This project is part of an ongoing research at the University of Stuttgart and will be a tool to simulate analytics scenarios in the context of the Internet of Things. Feel free to use this generator for any purpose or to contribute and with enhancements or new field types or generators.
If you have any questions don't hesitate to contact me or use the Github issue tracker.

#### Related work
- [fakesensor](https://github.com/JEreth/fakesensor): A similiar project implemented in Java
- [Analytical Atoms Specs](https://github.com/JEreth/A-atom-meta-specs): A specification of the underlying idea of analytical atoms (in work)