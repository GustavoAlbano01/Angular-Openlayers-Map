import { Component } from '@angular/core';
import { FullScreen } from 'ol/control';
import { OSM } from 'ol/source';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import Toggle from 'ol-ext/control/Toggle.js';
import Draw from 'ol/interaction/Draw.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Bar from 'ol-ext/control/Bar';
import Modify from 'ol/interaction/Modify.js';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent {
  map!: Map;
  vectorSource: any;

  ngOnInit(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

    this.map.addControl(new FullScreen());

    let vectorLayer = new VectorLayer({
      source: new VectorSource()
    })
    this.map.addLayer(vectorLayer);

    let mainBar = new Bar ({});
    this.map.addControl(mainBar);

    let barDrawing = new Bar({
      group: true,
      toggleOne: true
    });

    mainBar.addControl(barDrawing);

    let tg_point = new Toggle({
      title: 'Draw Points',
      html: '📍',
      interaction: new Draw({
        type: 'Point',
        source: vectorLayer.getSource() as VectorSource
      })
    })
    barDrawing.addControl(tg_point);

    let tg_line = new Toggle({
      title: 'Draw Lines',
      html: '➖',
      interaction: new Draw({
        type: 'LineString',
        source: vectorLayer.getSource() as VectorSource
      })
    })
    barDrawing.addControl(tg_line);

    const modify = new Modify({
      source: vectorLayer.getSource()!
    });
    this.map.addInteraction(modify);
  }
}
