import {h, Component} from 'preact'

import MapUi from './map-view';

export default class AppMain extends Component {
  
  render() {
    const options = {
      url: 'https://js.arcgis.com/4.4/'
    };

    return (
      <MapUi mapId={'Legend example'} options={options} />
    );
  }
}
