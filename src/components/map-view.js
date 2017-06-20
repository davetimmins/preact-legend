import {h, render, Component} from 'preact'
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { dojoRequire } from 'esri-loader';
import { MapLegend, setInitialLegend } from 'arcgis-react-redux-legend';
import isWebGLEnabled from 'is-webgl-enabled';
import isMobile from 'is-mobile';

const styles = {
  fullSize: {
    width: '100%',
    height: '100%'
  },
  thirtyPercent: {
    width: '30%',
    height: '100%'
  }
};

class MapUi extends Component {
  initialState = {
    title: null
  };
  state = this.initialState;

  createMap = webMapId => {
    const { mapId, initLegend } = this.props;

    if (webMapId) {
      dojoRequire(
        [
          'esri/Map',
          isWebGLEnabled() && !isMobile() ? 'esri/views/SceneView' : 'esri/views/MapView',
          'esri/WebMap'
        ],
        (Map, View, WebMap) => {
          const view = new View({
            container: ReactDOM.findDOMNode(this.mapContainer),
            map: new WebMap({
              portalItem: {
                id: webMapId
              }
            }),
            padding: { right: 280 }
          });

          view.map.portalItem.then(() => {
            this.setState({ title: view.map.portalItem.title });
          });

          // calling this initialises the legend control
          initLegend(view, mapId);
        }
      );
    } else {
      dojoRequire(
        [
          'esri/Map',
          isWebGLEnabled() && !isMobile() ? 'esri/views/SceneView' : 'esri/views/MapView',
          'esri/layers/MapImageLayer',
          'esri/layers/FeatureLayer'
        ],
        (Map, View, MapImageLayer, FeatureLayer) => {
          const layer1 = new MapImageLayer({
            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/RedlandsEmergencyVehicles/MapServer'
          });

          const layer2 = new MapImageLayer({
            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
            visible: false
          });

          const layer3 = new MapImageLayer({
            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer/'
          });

          const layer4 = new FeatureLayer({
            url: 'http://services2.arcgis.com/j80Jz20at6Bi0thr/arcgis/rest/services/HawaiiLavaFlowHazardZones/FeatureServer/0'
          })

          const map = new Map({
            basemap: 'topo',
            layers: [layer1, layer4, layer3, layer2]
          });

          const view = new View({
            container: ReactDOM.findDOMNode(this.mapContainer),
            map: map,
            padding: { right: 280 }
          });

          // calling this initialises the legend control
          initLegend(view, mapId);

          layer3.then(function(lyr) {
            view.goTo(lyr.fullExtent);
          });
        }
      );
    }
  };

  getUrlParameter = name => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  componentDidMount() {
    this.createMap(this.getUrlParameter('webmap'));
  }

  render() {
    const { mapId } = this.props;
    const { title } = this.state;
    return (
      <div style={styles.fullSize} ref={node => (this.mapContainer = node)}>
        <MapLegend style={styles.thirtyPercent} mapId={mapId} title={title} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initLegend: (view, mapId) => {
      dispatch(setInitialLegend(view, mapId));
    }
  };
};

export default connect(null, mapDispatchToProps)(MapUi);
