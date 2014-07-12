# Confdir

[![Build Status](https://secure.travis-ci.org/ricallinson/confdir.png?branch=master)](http://travis-ci.org/ricallinson/confdir)

A library for reading all JSON, YML and YAML files in a given directory and returning them as a JavaScript object.

    var confdir = require("confdir");
    console.log(confdir.read(__dirname));
