// script.js
import { map } from './config/peta.js';
import { onClosePopupClick, onDeleteMarkerClick, onSubmitMarkerClick, onMapClick, onMapPointerMove, disposePopover } from './controller/popup.js';
import { onClick } from 'https://jscroot.github.io/element/croot.js';
import { getAllCoordinates } from './controller/cog.js';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js';
import { Vector as VectorLayer } from 'https://cdn.skypack.dev/ol/layer.js';
import GeoJSON from 'https://cdn.skypack.dev/ol/format/GeoJSON.js';

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

    function loadTableData(tableId, geometryType) {
      const pointTable = document.getElementById(tableId).getElementsByTagName('tbody')[0];
  
      fetch("jscroot/template/content/geojson/ch2/map.json")
          .then(response => response.json())
          .then(data => {
              console.log("Data from GeoJSON URL:", data); // Tambahkan log ini
              data.features.forEach(feature => {
                  if (feature.geometry.type === geometryType) {
                      processFeatureRow(pointTable, feature);
                  }
              });
          })
          .catch(error => console.error("Terjadi kesalahan:", error));
  }

    document.addEventListener("DOMContentLoaded", () => {
        loadTableData("pointTable", "Point");
        loadTableData("polygonTable", "Polygon");
        loadTableData("polylineTable", "LineString");
    });

    const polygonGeoJSONUrl = 'jscroot/template/content/geojson/ch2/map.json';
    const lineStringGeoJSONUrl = 'jscroot/template/content/geojson/ch2/map.json';
    const pointGeoJSONUrl = 'jscroot/template/content/geojson/ch2/map.json';

    const polygonSource = new VectorSource({
        format: new GeoJSON(),
        url: polygonGeoJSONUrl,
    });

    const lineStringSource = new VectorSource({
        format: new GeoJSON(),
        url: lineStringGeoJSONUrl,
    });

    const pointSource = new VectorSource({
        format: new GeoJSON(),
        url: pointGeoJSONUrl,
    });

    const polygonLayer = new VectorLayer({
        source: polygonSource,
    });

    const lineStringLayer = new VectorLayer({
        source: lineStringSource,
    });

    const pointLayer = new VectorLayer({
        source: pointSource,
    });

    map.addLayer(polygonLayer);
    map.addLayer(lineStringLayer);
    map.addLayer(pointLayer);

    onClick('popup-closer', onClosePopupClick);
    onClick('insertmarkerbutton', onSubmitMarkerClick);
    onClick('hapusbutton', onDeleteMarkerClick);
    onClick('hitungcogbutton', getAllCoordinates);

    map.on('click', onMapClick);
    map.on('pointermove', onMapPointerMove);
    map.on('movestart', disposePopover);
}

// Panggil main setelah dokumen dimuat
main();
