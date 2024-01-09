// script.js
import { map } from './config/peta.js';
import {
  onClosePopupClick,
  onDeleteMarkerClick,
  onSubmitMarkerClick,
  onMapClick,
  onMapPointerMove,
  disposePopover,
} from './controller/popup.js';
import { onClick } from 'https://jscroot.github.io/element/croot.js';
import { getAllCoordinates } from './controller/cog.js';
import VectorSource from 'ol/source/Vector.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import GeoJSON from 'ol/format/GeoJSON.js';

export function main() {
  function processFeatureRow(table, feature) {
    const row = table.insertRow();
    const nameCell = row.insertCell(0);
    const coordinatesCell = row.insertCell(1);
    const typeCell = row.insertCell(2);

    nameCell.innerText = feature.properties.name;
    coordinatesCell.innerText = JSON.stringify(feature.geometry.coordinates);
    typeCell.innerText = feature.geometry.type;
  }

  function fetchAndPopulateTable(table, geometryType) {
    fetch("map.json")
      .then(response => response.json())
      .then(data => {
        data.features.forEach(feature => {
          if (feature.geometry.type === geometryType) {
            processFeatureRow(table, feature);
          }
        });
      })
      .catch(error => console.error(`Terjadi kesalahan untuk ${geometryType} table:`, error));
  }

  document.addEventListener("DOMContentLoaded", () => {
    const pointTable = document.getElementById("pointTable").getElementsByTagName('tbody')[0];
    const polygonTable = document.getElementById("polygonTable").getElementsByTagName('tbody')[0];
    const polylineTable = document.getElementById("polylineTable").getElementsByTagName('tbody')[0];

    // Fetch dan isi tabel-tabel
    fetchAndPopulateTable(pointTable, "Point");
    fetchAndPopulateTable(polygonTable, "Polygon");
    fetchAndPopulateTable(polylineTable, "LineString");
  });

  function createVectorLayer(geoJSONUrl) {
    return new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: geoJSONUrl,
      }),
    });
  }

  // Definisikan URL GeoJSON untuk masing-masing jenis fitur
  const polygonGeoJSONUrl = 'map.json';
  const lineStringGeoJSONUrl = 'map.json';
  const pointGeoJSONUrl = 'map.json';

  // Buat lapisan vektor untuk masing-masing jenis fitur
  const polygonLayer = createVectorLayer(polygonGeoJSONUrl);
  const lineStringLayer = createVectorLayer(lineStringGeoJSONUrl);
  const pointLayer = createVectorLayer(pointGeoJSONUrl);

  // Tambahkan lapisan-lapisan ke peta
  map.addLayer(polygonLayer);
  map.addLayer(lineStringLayer);
  map.addLayer(pointLayer);

  // Tambahkan event click pada peta
  onClick('popup-closer', onClosePopupClick);
  onClick('insertmarkerbutton', onSubmitMarkerClick);
  onClick('hapusbutton', onDeleteMarkerClick);
  onClick('hitungcogbutton', getAllCoordinates);

  map.on('click', onMapClick);
  map.on('pointermove', onMapPointerMove);
  map.on('movestart', disposePopover);
}

// Panggil fungsi main saat diimpor di file lain
// main();
