import { AfterViewInit, Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as geometry from 'spherical-geometry-js';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Access-Control-Allow-Origin':'*',
    'Authorization':'authkey',
    'userid':'1'
  })
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {
  constructor(private _http: HttpClient) { }

  title = 'google_maps';
  map!: google.maps.Map;
  
  ngAfterViewInit(){
    this._http.get('https://api.npoint.io/f26432e9e880999eeb1b', httpOptions).subscribe(
      (data: any) => {
        this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
          center: {
            lat: data.features[0].geometry.coordinates[1],
            lng: data.features[0].geometry.coordinates[0]
          },
          zoom: 8,
          disableDoubleClickZoom: true,
          maxZoom: 15,
          minZoom: 8,
        });

        this.map.data.loadGeoJson('https://api.npoint.io/f26432e9e880999eeb1b');
        var icon: google.maps.Icon;

        this.map.data.setStyle((feature) => {
          let exclude: boolean[] = [];
          let check = true;
          let lat = feature.getProperty('LATITUDE');
          let lng = feature.getProperty('LONGITUDE');
          data.features.forEach((element:any) => {
            if(lat != element.properties['LATITUDE'] && lng != element.properties['LONGITUDE']){
              check = geometry.computeDistanceBetween( 
                new google.maps.LatLng(lat, lng),
                new google.maps.LatLng(element.geometry.coordinates[1], element.geometry.coordinates[0])
              ) <= 23000;
              exclude.push(check)
            }
          });
          if(exclude.includes(true)){
            icon = { url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'}
          } else{
            icon = { url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}
          } 
          return { icon: icon };
        });

      }
    );
  }
  
}