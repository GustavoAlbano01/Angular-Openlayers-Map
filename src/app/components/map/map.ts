import { AfterViewInit, Component } from '@angular/core';
import { MapService } from '../../service/map-service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements AfterViewInit {
  constructor(private mapService: MapService) {}

  ngAfterViewInit(): void {
    this.mapService.initMap('map');
  }
}
