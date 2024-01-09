// script.js
import { map } from './config/peta.js';
import VectorSource from 'ol/source/Vector.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import GeoJSON from 'ol/format/GeoJSON.js';

function processFeatureRow(table, feature) {
  const row = table.insertRow();
  const nameCell = row.insertCell(0);
  const coordinatesCell = row.insertCell(1);
  const typeCell = row.insertCell(2);

  nameCell.innerText = feature.properties.name;
  coordinatesCell.innerText = JSON.stringify(feature.geometry.coordinates);
  typeCell.innerText = feature.geometry.type;
}

async function fetchAndPopulateTable(table, geometryType) {
  try {
    const response = await fetch("map.json");
    const data = await response.json();

    data.features.forEach(feature => {
      if (feature.geometry.type === geometryType) {
        processFeatureRow(table, feature);
      }
    });
  } catch (error) {
    console.error(`Terjadi kesalahan untuk ${geometryType} table:`, error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const { onClick } = await import("https://cdn.jsdelivr.net/gh/jscroot/api@0.0.4/croot.js");

  const pointTable = document.getElementById("pointTable").getElementsByTagName('tbody')[0];
  const polygonTable = document.getElementById("polygonTable").getElementsByTagName('tbody')[0];
  const polylineTable = document.getElementById("polylineTable").getElementsByTagName('tbody')[0];

  // Fetch dan isi tabel-tabel
  await fetchAndPopulateTable(pointTable, "Point");
  await fetchAndPopulateTable(polygonTable, "Polygon");
  await fetchAndPopulateTable(polylineTable, "LineString");

  // Buat lapisan vektor untuk masing-masing jenis fitur
  const polygonLayer = createVectorLayer('map.json');
  const lineStringLayer = createVectorLayer('map.json');
  const pointLayer = createVectorLayer('map.json');

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
});

function createVectorLayer(geoJSONUrl) {
  return new VectorLayer({
    source: new VectorSource({
      format: new GeoJSON(),
      url: geoJSONUrl,
    }),
  });
}
