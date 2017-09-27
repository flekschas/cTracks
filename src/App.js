import React, { Component } from 'react';
import * as ViewConfig from './ViewConfig';
import HiglassUI from './HiglassUI';
import CNVTable from './CNVTable';
import HiglassAPI from './utils/HiglassAPI';
import ReactFileReader from 'react-file-reader';
import Papa from 'papaparse';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

//import './Components/HiGlassLauncher.scss';

function ParseFile(file, callback) {
  console.log("Parsing CNV file...");

  Papa.parse(file, {
    //download: true,
    newline: "\n",
    header: true,
    dynamicTyping: true,
    error: function(error) {
      console.log("ERROR Parse:",error);
    },
    complete: function(results) {
      callback(results.data);
    }
  });
}

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      APIInfo: null,
      CNVData: null,
    };
    this.UpdateLocation = this.UpdateLocation.bind(this);
    this.UpdateLocation2 = this.UpdateLocation2.bind(this);
    this.UpdateAPIInfo = this.UpdateAPIInfo.bind(this);
    this.ProcessCNVFile = this.ProcessCNVFile.bind(this);
    this.UpdateCNVData = this.UpdateCNVData.bind(this);
  }

  componentDidMount() {
    this.UpdateLocation();
    //this.UpdateLocation2();
  }

  UpdateAPIInfo(location) {
    console.log("APIInfo:", location);
    this.setState(function () {
      return {
        APIInfo: location
      }
    })
  }

  UpdateLocation() {
    console.log("Updating location...");
    //HiglassAPI.fetchLocation('aa')
    HiglassAPI.fetchLocationAuto()
      .then(function(location) {
        this.UpdateAPIInfo(location);
      }.bind(this));
  }

  ListenerID (id) {
    console.log('Listener ID:', id);
  } 

  UpdateLocation2() {
    console.log("Updating location2...");
    /*HiglassAPI.fetchViewConfig()
      .then(function(ViewID) {
        window.hgApi.on('location',(location) => {this.UpdateAPIInfo(location)},ViewID, function (id) {
          console.log('Second Listener ID:', id);
          });
        });
*/
//    window.hgApi.on('location', this.UpdateAPIInfo, 'aa' , this.ListenerID);

    // Need to improve function (with automated viewID)
   window.hgApi.on('location', (info) => {
      console.log('We are over here:', info);
      //this.setState({APIInfo: info});
    }, 'aa' , function (id) {
      console.log('Listener ID:', id);
      });
  }

  ProcessCNVFile (files) {
    console.log("Processing CNVFile...");
    // Loading file
    var reader = new FileReader();
    reader.onload = function(e) {
      // Use reader.result
      var text = reader.result;
    }
    //reader.readAsText(files[0]);

    ParseFile(files[0], this.UpdateCNVData);  
  }

  UpdateCNVData(data) {
    console.log("CNVData:", data);
    this.setState(function () {
      return {
        CNVData: data
      }
    });
  }

  render() {
    // Feature: can add button to choose our initial ViewConfig
    var MyViewConfig = ViewConfig.ViewConfig_Public_Dev_Simple;
    return (
      <div className="App">
        <div>
          <HiglassUI ViewConfig = {MyViewConfig} />
        </div>
        <div  className = "Button">
          <ReactFileReader handleFiles={this.ProcessCNVFile} fileTypes={'.bed, .tsv'}>
            <button>Upload CNV File</button>
          </ReactFileReader>
        </div>
        <div className = "Button">
          <button onClick={this.UpdateLocation}>UpdateTable</button>
        </div>
        <div>
          {this.state.APIInfo && this.state.CNVData && <CNVTable CNVData = {this.state.CNVData} location={this.state.APIInfo} />}
        </div>
      </div>
    )
  }
}

export default App;
