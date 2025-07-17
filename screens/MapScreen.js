// import React, { useRef, useState } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   FlatList,
//   PermissionsAndroid,
//   Platform,
//   StyleSheet,
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import Geolocation from 'react-native-geolocation-service';
// import axios from 'axios';

// const destinationCoords = [
//   { name: 'F-6 Markaz', coords: '73.0605,33.7294' },
//   { name: 'F-10 Markaz', coords: '72.9934,33.6994' },
//   { name: 'Blue Area', coords: '73.0551,33.7167' },
//   { name: 'I-9 Sector', coords: '73.0500,33.6573' },
//   { name: 'I-8 Markaz', coords: '73.0600,33.6850' },
//   { name: 'G-11 Markaz', coords: '72.9910,33.6847' },
//   { name: 'G-8 Markaz', coords: '73.0514,33.6950' },
//   { name: 'H-9', coords: '73.0470,33.6710' },
//   { name: 'Saddar Rawalpindi', coords: '73.0479,33.5894' },
//   { name: 'Commercial Market', coords: '73.070884, 33.637775' },
//   { name: 'Bahria Town Phase 4', coords: '73.0858,33.5447' },
//   { name: 'DHA Phase 1', coords: '73.1243,33.5655' },
//   { name: 'Pindi Cricket Stadium', coords: '73.075669, 33.651101' },
//   { name: 'Faizabad Interchange', coords: '73.0703,33.6744' },
//   { name: 'Zero Point', coords: '73.0479,33.6932' },
// ];

// export default function MapScreen() {
//   const webviewRef = useRef(null);
//   const [currentCoords, setCurrentCoords] = useState(null);
//   const [filter, setFilter] = useState('');
//   const [error, setError] = useState('');
//   const [routeCoords, setRouteCoords] = useState([]);
//   const [routeSteps, setRouteSteps] = useState([]);
//   const [currentInstruction, setCurrentInstruction] = useState('');

//   const filteredDestinations = destinationCoords.filter(item =>
//     item.name.toLowerCase().includes(filter.toLowerCase())
//   );

//   const getCurrentLocation = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//         );
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           setError('Location permission denied.');
//           return;
//         }
//       }

//       Geolocation.getCurrentPosition(
//         position => {
//           const { latitude, longitude } = position.coords;
//           setCurrentCoords({ latitude, longitude });
//           const jsCode = `
//             if (typeof window.setCurrentLocation === 'function') {
//               window.setCurrentLocation(${latitude}, ${longitude});
//             }
//           `;
//           webviewRef.current.injectJavaScript(jsCode);
//           setError('');
//         },
//         error => {
//           console.log(error);
//           setError('Could not get location.');
//         },
//         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//       );
//     } catch (err) {
//       console.log(err);
//       setError('Something went wrong.');
//     }
//   };

//   const handleDestinationSelect = async destination => {
//     if (!currentCoords) {
//       setError('Please get your current location first.');
//       return;
//     }

//     const [destLng, destLat] = destination.coords.split(',').map(Number);
//     const start = `${currentCoords.longitude},${currentCoords.latitude}`;
//     const end = `${destLng},${destLat}`;

//     try {
//       const response = await axios.get(
//         `https://api.openrouteservice.org/v2/directions/driving-car`,
//         {
//           params: {
//             api_key: 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImI4MmJhYTU4ZDBlMDRlYTlhYzlhM2NhZTNiMjM5ZmNkIiwiaCI6Im11cm11cjY0In0=',
//             start,
//             end,
//           },
//         }
//       );

//       const coordinates = response.data.features[0].geometry.coordinates;
//       const steps = response.data.features[0].properties.segments[0].steps;

//       console.log(coordinates)
//       console.log(steps)
//       setRouteCoords(coordinates); // ✅ Store for simulation
//       setRouteSteps(steps);


//       const jsCode = `
//         if (typeof window.setDestinationAndRoute === 'function') {
//           window.setDestinationAndRoute(${destLat}, ${destLng}, ${JSON.stringify(
//         coordinates
//       )});
//         }
//       `;
//       webviewRef.current.injectJavaScript(jsCode);
//       setError('');
//     } catch (err) {
//       console.log(err);
//       setError('Failed to fetch route.');
//     }
//   };

//   // Map Route Boundary 
//   const getCurrentBounds = () => {
//     const jsCode = `
//       if (typeof window.getCurrentRouteView === 'function') {
//         window.getCurrentRouteView();
//       }
//     `;
//     webviewRef.current.injectJavaScript(jsCode);
//   }
//   // ✅ Simulate movement along route:
//   // const simulateMovement = () => {
//   //   if (!routeCoords.length) {
//   //     setError('No route to simulate.');
//   //     return;
//   //   }

//   //   let i = 0;

//   //   const moveNext = () => {
//   //     if (i >= routeCoords.length) return;

//   //     console.log("Route Coords Before Slicing: ",routeCoords)

//   //     const [lng, lat] = routeCoords[i];
//   //     console.log(`Current Location: ${lat} Latitude and ${lng} Longitude.`)

//   //     const remaining = routeCoords.slice(i);
//   //     console.log("Route Coords After Slicing: ",remaining)

//   //     const jsCode = `
//   //     if (typeof window.moveCurrentMarker === 'function') {
//   //       window.moveCurrentMarker(${lat}, ${lng});
//   //     }
//   //     if (typeof window.updateRouteLine === 'function') {
//   //       window.updateRouteLine(${JSON.stringify(remaining)});
//   //     }
//   //   `;
//   //     webviewRef.current.injectJavaScript(jsCode);

//   //     i++;
//   //     setTimeout(moveNext, 500); // adjust for speed
//   //   };

//   //   moveNext();
//   // };
//   const simulateMovement = () => {
//     if (!routeCoords.length) {
//       setError('No route to simulate.');
//       return;
//     }

//     let i = 0;

//     const moveSegment = (from, to, duration) => {
//       const start = Date.now();

//       const animate = () => {
//         const now = Date.now();
//         const elapsed = now - start;

//         const t = Math.min(elapsed / duration, 1); // 0 to 1

//         const lat = from[1] + (to[1] - from[1]) * t;
//         const lng = from[0] + (to[0] - from[0]) * t;

//         const remaining = routeCoords.slice(i);

//         // Find the active step for this index
//         const activeStep = routeSteps.find(step => {
//           const [start, end] = step.way_points;
//           return i >= start && i <= end;
//         });

//         if (activeStep) {
//           setCurrentInstruction(activeStep.instruction);
//         }

//         const jsCode = `
//         if (typeof window.moveCurrentMarker === 'function') {
//           window.moveCurrentMarker(${lat}, ${lng});
//         }
//         if (typeof window.updateRouteLine === 'function') {
//           window.updateRouteLine(${JSON.stringify(remaining)});
//         }
//       `;
//         webviewRef.current.injectJavaScript(jsCode);

//         if (t < 1) {
//           requestAnimationFrame(animate);
//         } else {
//           i++;
//           // if (i < routeCoords.length - 1) {
//           //   moveSegment(routeCoords[i], routeCoords[i + 1], 500); // next segment
//           // }
//           if (i < routeCoords.length - 1) {
//             moveSegment(routeCoords[i], routeCoords[i + 1], 500);
//           } else {
//             // Simulation done → force last instruction
//             const finalStep = routeSteps[routeSteps.length - 1];
//             if (finalStep) {
//               setCurrentInstruction(finalStep.instruction);
//             }
//           }

//         }
//       };

//       animate();
//     };

//     // start with first segment
//     if (routeCoords.length > 1) {
//       moveSegment(routeCoords[0], routeCoords[1], 500);
//     }
//   };

//   const clearMap = () => {
//     const jsCode = `
//       if (typeof window.clearMap === 'function') {
//         window.clearMap();
//       }
//     `;
//     webviewRef.current.injectJavaScript(jsCode);
//     setCurrentCoords(null);
//     setCurrentInstruction('');
//     setRouteCoords([]);
//     setRouteSteps([]);
//     setError('');
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <View style={styles.buttonsRow}>
//         <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
//           <Text style={styles.buttonText}>📍 Get Location</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.button, { backgroundColor: '#FF3B30' }]} onPress={clearMap}>
//           <Text style={styles.buttonText}>❌ Clear</Text>
//         </TouchableOpacity>

//         {/* ✅ Add button: */}
//         {routeCoords.length > 0 && (
//           <TouchableOpacity style={[styles.button, { backgroundColor: '#4CD964' }]} onPress={simulateMovement}>
//             <Text style={styles.buttonText}>▶️ Simulate Movement</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <TextInput
//         placeholder="Search destination..."
//         value={filter}
//         onChangeText={setFilter}
//         style={styles.input}
//       />

//       {filter.trim().length > 0 && (
//         <FlatList
//           data={filteredDestinations}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.listItem}
//               onPress={() => handleDestinationSelect(item)}
//             >
//               <Text style={styles.listItemText}>{item.name}</Text>
//             </TouchableOpacity>
//           )}
//           style={{ maxHeight: 200 }}
//         />
//       )}

//       {error ? <Text style={styles.error}>{error}</Text> : null}

//       <WebView
//         ref={webviewRef}
//         originWhitelist={['*']}
//         source={{ html: mapHTML }}
//         style={{ flex: 1 }}
//       />

//       <TouchableOpacity style={styles.bndButton} onPress={getCurrentBounds}>
//         <Text style={styles.buttonText}>Get Route View</Text>
//       </TouchableOpacity>
//       {currentInstruction ? (
//         <View style={styles.instructionBox}>
//           <Text style={styles.instructionText}>{currentInstruction}</Text>
//         </View>
//       ) : null}
//     </View>
//   );
// }

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

const destinationCoords = [
  { name: 'F-6 Markaz', coords: '73.0605,33.7294' },
  { name: 'F-10 Markaz', coords: '72.9934,33.6994' },
  { name: 'Blue Area', coords: '73.0551,33.7167' },
  { name: 'I-9 Sector', coords: '73.0500,33.6573' },
  { name: 'I-8 Markaz', coords: '73.0600,33.6850' },
  { name: 'G-11 Markaz', coords: '72.9910,33.6847' },
  { name: 'G-8 Markaz', coords: '73.0514,33.6950' },
  { name: 'H-9', coords: '73.0470,33.6710' },
  { name: 'Saddar Rawalpindi', coords: '73.0479,33.5894' },
  { name: 'Commercial Market', coords: '73.0731,33.6277' },
  { name: 'Bahria Town Phase 4', coords: '73.0858,33.5447' },
  { name: 'DHA Phase 1', coords: '73.1243,33.5655' },
  { name: 'Pindi Cricket Stadium', coords: '73.075669, 33.651101' },
  { name: 'Faizabad Interchange', coords: '73.0703,33.6744' },
  { name: 'Zero Point', coords: '73.0479,33.6932' },
];

export default function MapScreen() {
  const webviewRef = useRef(null);
  const watchId = useRef(null);

  const [currentCoords, setCurrentCoords] = useState(null);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  // const [routeCoords, setRouteCoords] = useState([]);
  // const [routeSteps, setRouteSteps] = useState([]);
  // const [currentInstruction, setCurrentInstruction] = useState('');
  const [tracking, setTracking] = useState(false);

  const filteredDestinations = destinationCoords.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setError('Location permission denied.');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentCoords({ latitude, longitude });
        const jsCode = `
          if (typeof window.setCurrentLocation === 'function') {
            window.setCurrentLocation(${latitude}, ${longitude});
          }
        `;
        webviewRef.current.injectJavaScript(jsCode);
        setError('');
      },
      error => {
        console.log(error);
        setError('Could not get location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const startLiveTracking = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setError('Location permission denied.');
      return;
    }

    if (watchId.current !== null) {
      console.log('Already watching!');
      return;
    }

    watchId.current = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentCoords({ latitude, longitude });

        const jsCode = `
        if (typeof window.setCurrentLocation === 'function') {
          window.setCurrentLocation(${latitude}, ${longitude});
        }
      `;
        webviewRef.current.injectJavaScript(jsCode);
      },
      error => {
        console.log(error);
        setError('Error tracking location.');
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 5,
        interval: 3000,
        fastestInterval: 2000,
      }
    );

    console.log('Started live tracking, ID:', watchId.current);
    setTracking(true);
  };

  const stopLiveTracking = () => {
    if (watchId.current !== null) {
      console.log('Clearing watch ID:', watchId.current);
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setTracking(false);
  };

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, []);


  const handleDestinationSelect = async destination => {
    if (!currentCoords) {
      setError('Please get your current location first.');
      return;
    }

    const [destLng, destLat] = destination.coords.split(',').map(Number);
    const start = `${currentCoords.longitude},${currentCoords.latitude}`;
    const end = `${destLng},${destLat}`;

    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          params: {
            api_key: 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImI4MmJhYTU4ZDBlMDRlYTlhYzlhM2NhZTNiMjM5ZmNkIiwiaCI6Im11cm11cjY0In0=',
            start,
            end,
          },
        }
      );

      const coordinates = response.data.features[0].geometry.coordinates;
      const steps = response.data.features[0].properties.segments[0].steps;

      // setRouteCoords(coordinates);
      // setRouteSteps(steps);

      const jsCode = `
        if (typeof window.setDestinationAndRoute === 'function') {
          window.setDestinationAndRoute(${destLat}, ${destLng}, ${JSON.stringify(
        coordinates
      )});
        }
      `;
      webviewRef.current.injectJavaScript(jsCode);
      setError('');
    } catch (err) {
      console.log(err);
      setError('Failed to fetch route.');
    }
  };

  const getCurrentBounds = () => {
    const jsCode = `
      if (typeof window.getCurrentRouteView === 'function') {
        window.getCurrentRouteView();
      }
    `;
    webviewRef.current.injectJavaScript(jsCode);
  };

  // const simulateMovement = () => {
  //   if (!routeCoords.length) {
  //     setError('No route to simulate.');
  //     return;
  //   }

  //   let i = 0;

  //   const moveSegment = (from, to, duration) => {
  //     const start = Date.now();

  //     const animate = () => {
  //       const now = Date.now();
  //       const elapsed = now - start;

  //       const t = Math.min(elapsed / duration, 1);

  //       const lat = from[1] + (to[1] - from[1]) * t;
  //       const lng = from[0] + (to[0] - from[0]) * t;

  //       const remaining = routeCoords.slice(i);

  //       const activeStep = routeSteps.find(step => {
  //         const [start, end] = step.way_points;
  //         return i >= start && i <= end;
  //       });

  //       if (activeStep) {
  //         setCurrentInstruction(activeStep.instruction);
  //       }

  //       const jsCode = `
  //         if (typeof window.moveCurrentMarker === 'function') {
  //           window.moveCurrentMarker(${lat}, ${lng});
  //         }
  //         if (typeof window.updateRouteLine === 'function') {
  //           window.updateRouteLine(${JSON.stringify(remaining)});
  //         }
  //       `;
  //       webviewRef.current.injectJavaScript(jsCode);

  //       if (t < 1) {
  //         requestAnimationFrame(animate);
  //       } else {
  //         i++;
  //         if (i < routeCoords.length - 1) {
  //           moveSegment(routeCoords[i], routeCoords[i + 1], 500);
  //         } else {
  //           const finalStep = routeSteps[routeSteps.length - 1];
  //           if (finalStep) {
  //             setCurrentInstruction(finalStep.instruction);
  //           }
  //         }
  //       }
  //     };

  //     animate();
  //   };

  //   if (routeCoords.length > 1) {
  //     moveSegment(routeCoords[0], routeCoords[1], 500);
  //   }
  // };

  const clearMap = () => {
    const jsCode = `
      if (typeof window.clearMap === 'function') {
        window.clearMap();
      }
    `;
    webviewRef.current.injectJavaScript(jsCode);
    stopLiveTracking();
    setCurrentCoords(null);
    // setCurrentInstruction('');
    // setRouteCoords([]);
    // setRouteSteps([]);
    setError('');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
          <Text style={styles.buttonText}>📍 Get Location</Text>
        </TouchableOpacity>

        {!tracking ? (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#34C759' }]}
            onPress={startLiveTracking}
          >
            <Text style={styles.buttonText}>▶️ Start Live</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FF9500' }]}
            onPress={stopLiveTracking}
          >
            <Text style={styles.buttonText}>⏸️ Stop Live</Text>
          </TouchableOpacity>
        )}


        <TouchableOpacity style={[styles.button, { backgroundColor: '#FF3B30' }]} onPress={clearMap}>
          <Text style={styles.buttonText}>❌ Clear</Text>
        </TouchableOpacity>

        {/* {routeCoords.length > 0 && (
          <TouchableOpacity style={[styles.button, { backgroundColor: '#4CD964' }]} onPress={simulateMovement}>
            <Text style={styles.buttonText}>▶️ Simulate</Text>
          </TouchableOpacity>
        )} */}
      </View>

      <TextInput
        placeholder="Search destination..."
        value={filter}
        onChangeText={setFilter}
        style={styles.input}
      />

      {filter.trim().length > 0 && (
        <FlatList
          data={filteredDestinations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => handleDestinationSelect(item)}
            >
              <Text style={styles.listItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={{ maxHeight: 200 }}
        />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        style={{ flex: 1 }}
      />

      <TouchableOpacity style={styles.bndButton} onPress={getCurrentBounds}>
        <Text style={styles.buttonText}>Get Route View</Text>
      </TouchableOpacity>

    </View>
  );
}


const mapHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Leaflet Directions</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
</head>
<body style="margin:0; padding:0;">
  <div id="map" style="width:100%; height:100vh;"></div>
 <script>
  var map = L.map('map').setView([33.6996, 73.0362], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  var currentMarker = null;
  var destMarker = null;
  var routeLine = null;

  window.setCurrentLocation = function(lat, lng) {
    if (!currentMarker) {
      currentMarker = L.marker([lat, lng]).addTo(map).bindPopup('Current Location').openPopup();
    } else {
      currentMarker.setLatLng([lat, lng]).update();
    }
    // map.setView([lat, lng], 13);
  };

  window.moveCurrentMarker = function(lat, lng) {
    if (currentMarker) {
      currentMarker.setLatLng([lat, lng]).update();
    }
    map.setView([lat, lng], 15);
  };

  window.setDestinationAndRoute = function(destLat, destLng, coordinates) {
    if (destMarker) {
      map.removeLayer(destMarker);
    }
    destMarker = L.marker([destLat, destLng]).addTo(map).bindPopup('Destination').openPopup();

    if (routeLine) {
      map.removeLayer(routeLine);
    }

    var latlngs = coordinates.map(function(coord) {
      return [coord[1], coord[0]];
    });

    routeLine = L.polyline(latlngs, { color: 'blue' }).addTo(map);
    map.fitBounds(routeLine.getBounds());
  };
  window.updateRouteLine = function(coordinates) {
    if (routeLine) {
      map.removeLayer(routeLine);
    }

    var latlngs = coordinates.map(function(coord) {
      return [coord[1], coord[0]];
    });

    routeLine = L.polyline(latlngs, { color: 'blue' }).addTo(map);
  };
  window.getCurrentRouteView = function() {
    if (routeLine) { map.fitBounds(routeLine.getBounds()); }
  }
  window.clearMap = function() {
    if (currentMarker) { map.removeLayer(currentMarker); currentMarker = null; }
    if (destMarker) { map.removeLayer(destMarker); destMarker = null; }
    if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
    map.setView([33.6996, 73.0362], 13);
  };
</script>

</body>
</html>
`;

const styles = StyleSheet.create({
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  bndButton: {
    position: 'absolute',
    backgroundColor: '#007AFF',
    top: '140',
    left: '290',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
  },
  listItem: {
    padding: 12,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  listItemText: { fontSize: 16 },
  error: {
    color: 'red',
    paddingHorizontal: 10,
    marginTop: 10
  },
  instructionBox: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
  },

});

