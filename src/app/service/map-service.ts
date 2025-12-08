import { Injectable } from '@angular/core';
import { FullScreen } from 'ol/control';
import { OSM } from 'ol/source';
import { Style, Icon, Stroke } from 'ol/style';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import Toggle from 'ol-ext/control/Toggle.js';
import Draw from 'ol/interaction/Draw.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Bar from 'ol-ext/control/Bar';
import Modify from 'ol/interaction/Modify.js';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map!: Map;
  vectorSource!: VectorSource;

  initMap(targetId: string): Map {
    this.vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: features => {
        const geometryType = features.getGeometry()?.getType();

        if (geometryType === 'Point') {
          return new Style({
            image: new Icon({
              src: 'map-marker-alt-svgrepo-com.svg',
              scale: 0.03,
              anchor: [0.5, 1]
            }),
          });
        }
        return new Style({
          stroke: new Stroke({
            color: '#3399CC',
            width: 3,
          }),
        });
      },
    });

    this.map = new Map({
      target: targetId,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

    this.addControls();
    this.addInteractions(vectorLayer);

    return this.map;
  }

  private addControls() {
    this.map.addControl(new FullScreen());

    const mainBar = new Bar({});
    this.map.addControl(mainBar);

    const drawBar = new Bar({
      group: true,
      toggleOne: true
    });

    mainBar.addControl(drawBar);

    drawBar.addControl(
      new Toggle({
        title: 'Draw points',
        html: '📍',
        interaction: new Draw({
          type: 'Point',
          source: this.vectorSource
        })
      })
    );

    drawBar.addControl(
      new Toggle({
        title: 'Draw lines',
        html: '➖',
        interaction: new Draw({
          type: 'LineString',
          source: this.vectorSource
        })
      })
    );
  }

  private addInteractions(vectorLayer: VectorLayer<VectorSource>) {
    const modify = new Modify({ source: vectorLayer.getSource()! });
    this.map.addInteraction(modify);
  }
}
