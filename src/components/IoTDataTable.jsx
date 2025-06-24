import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";

const DeviceSVG = ({ data }) => {
  if (!data) return <p>No data yet...</p>;

  const { deviceId, sensorData, location, receivedAt, networkData } = data;

  return (
    <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="500" height="300" fill="#f5f5f5" stroke="#ccc" />
      <text x="20" y="30" fontSize="18" fontWeight="bold" fill="#333">
        Device Data Overview
      </text>
      <rect
        x="20"
        y="50"
        width="460"
        height="200"
        fill="#fff"
        stroke="#999"
        rx="10"
      />

      <text x="40" y="80" fontSize="14" fill="#333">
        📟 Device ID: {deviceId}
      </text>
      <text x="40" y="105" fontSize="14" fill="#333">
        🌡️ Temperature: {sensorData?.temperature ?? "N/A"}°C
      </text>
      <text x="40" y="130" fontSize="14" fill="#333">
        📡 RSSI: {networkData?.rssi ?? "N/A"} dBm | SNR:{" "}
        {networkData?.snr ?? "N/A"}
      </text>
      <text x="40" y="155" fontSize="14" fill="#333">
        🗺️ Location: Lat {location?.latitude?.toFixed(4)}, Lon{" "}
        {location?.longitude?.toFixed(4)}
      </text>
      <text x="40" y="180" fontSize="14" fill="#333">
        🕓 Time: {new Date(receivedAt).toLocaleString()}
      </text>
      <text x="40" y="205" fontSize="14" fill="#333">
        📶 Frequency: {Number(networkData?.frequency) / 1e6} MHz | SF:{" "}
        {networkData?.dataRate?.lora?.spreading_factor}
      </text>
      {/* <rect
        width="100"
        height="100"
        rx="0"
        fill="none"
        stroke="#ccc"
        stroke-width="2"
      />
      <path
        d="M66.868 25.074a1.752 1.752 0 0 0-.645-1.072c-2.852-2.356-6.806-2.198-11.864.476-.33-.33-.688-.61-1.088-.85 3.486-3.127 6.663-4.44 9.533-3.939.846.148 1.431-.821.907-1.502a16.52 16.52 0 0 0-4.079-3.787 1.753 1.753 0 0 0-1.213-.302c-3.683.35-6.368 3.258-8.054 8.725-.467 0-.917.056-1.37.169.254-4.677 1.573-7.852 3.956-9.526.703-.494.431-1.593-.42-1.704a16.519 16.519 0 0 0-5.563.206 1.752 1.752 0 0 0-1.071.645c-2.357 2.852-2.199 6.806.475 11.864-.33.33-.61.688-.85 1.088-3.127-3.486-4.44-6.664-3.939-9.533.148-.846-.821-1.432-1.501-.907a16.517 16.517 0 0 0-3.788 4.079 1.753 1.753 0 0 0-.302 1.213c.35 3.683 3.259 6.368 8.726 8.054 0 .467.055.916.168 1.37-4.676-.254-7.851-1.573-9.526-3.956-.493-.703-1.593-.431-1.704.42a16.519 16.519 0 0 0 .207 5.563c.093.453.288.777.644 1.071 2.852 2.357 6.807 2.199 11.865-.475.33.33.687.61 1.087.85-3.486 3.127-6.663 4.44-9.532 3.939-.846-.148-1.432.821-.908 1.501a16.52 16.52 0 0 0 4.08 3.788c.386.255.752.346 1.213.302 3.683-.35 6.367-3.259 8.053-8.725a5.58 5.58 0 0 0 1.37-.17c-.254 4.677-1.572 7.853-3.956 9.527-.702.494-.431 1.593.42 1.704 1.89.245 3.696.178 5.563-.207a1.752 1.752 0 0 0 1.072-.644c2.356-2.852 2.198-6.806-.476-11.865.33-.33.61-.687.85-1.087 3.127 3.486 4.44 6.663 3.939 9.533-.148.845.821 1.431 1.501.907a16.518 16.518 0 0 0 3.788-4.08c.255-.386.346-.752.302-1.213-.35-3.683-3.259-6.367-8.725-8.053 0-.467-.056-.917-.169-1.37 4.676.254 7.852 1.572 9.526 3.956.494.702 1.593.431 1.704-.42.245-1.89.178-3.696-.206-5.563zm-16.503 8.103a4.706 4.706 0 1 1 0-9.412 4.706 4.706 0 0 1 0 9.412z"
        fill="#7d081e"
      />
      <text
        x="49.434"
        y="59.465"
        dominant-baseline="middle"
        fill="#000000"
        text-anchor="middle"
      >
        <tspan> 🌡️ Temperature: {sensorData?.temperature ?? "N/A"}°C</tspan>
      </text>
      <g transform="matrix(1.61104 0 0 1.60957 -72.338 -20.652)">
        <rect
          x="54.702"
          y="60.372"
          width="14.263"
          height="7.426"
          rx="1.5"
          fill="#12ed19"
          stroke="#000"
        />
        <text
          x="61.856"
          y="64.491"
          dominant-baseline="middle"
          fill="#000000"
          font-family="Roboto"
          font-size="4.446"
          stroke-width=".741"
          text-anchor="middle"
        >
          <tspan stroke-width=".741">On</tspan>
        </text>
      </g>
      <g transform="matrix(1.61253 0 0 1.61566 -58.441 -20.942)">
        <rect
          x="74.367"
          y="60.311"
          width="14.263"
          height="7.426"
          rx="1.5"
          fill="#ed121f"
          stroke="#000"
        />
        <text
          x="81.366"
          y="64.518"
          dominant-baseline="middle"
          fill="#000000"
          font-family="Roboto"
          font-size="4.446"
          stroke-width=".741"
          text-anchor="middle"
        >
          <tspan stroke-width=".741">Off</tspan>
        </text>
      </g> */}
    </svg>
  );
};

const IoTDataTable = () => {
  const [data, setData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [lastDoc, setLastDoc] = useState(null); // For pagination

  useEffect(() => {
    setLoading(true);
    if (!db) {
      console.error("Firestore db is not initialized");
      setError("Firestore is not properly initialized.");
      setLoading(false);
      return;
    }

    // Create Firestore query
    const q = query(
      collection(db, "iot_data"),
      orderBy("createdAt", "desc"),
      limit(rowsPerPage)
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          if (!snapshot || snapshot.empty) {
            console.warn("Firestore snapshot is empty or undefined");
            setData([]);
            setError("No data available in Firestore.");
            setLoading(false);
            return;
          }

          // Process documents
          const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Fetched docs:", JSON.stringify(docs, null, 2)); // Detailed debug log
          setData(docs);
          setLatestData(docs[0]);
          setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);

          // Get total count
          const totalSnapshot = await await getDocs(collection(db, "iot_data"));
          console.log("Total documents:", totalSnapshot.size);
          setTotal(totalSnapshot.size || 0);

          setLastUpdated(new Date().toLocaleString());
          setError(null);
          setLoading(false);
        } catch (err) {
          console.error(
            "Error processing Firestore snapshot:",
            err.message,
            err.stack
          );
          setError(`Failed to fetch data: ${err.message}`);
          setData([]);
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore listener error:", err.message, err.stack);
        setError(`Error setting up real-time listener: ${err.message}`);
        setData([]);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [rowsPerPage]);

  // Handle pagination
  const handleChangePage = async (event, newPage) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "iot_data"),
        orderBy("createdAt", "desc"),
        startAfter(newPage > page ? lastDoc : null),
        limit(rowsPerPage)
      );

      const snapshot = await new Promise((resolve) => {
        onSnapshot(q, resolve, (err) => {
          console.error("Pagination query error:", err.message, err.stack);
          setError(`Failed to fetch page data: ${err.message}`);
          setData([]);
          setLoading(false);
        });
      });

      const docs = snapshot.docs
        ? snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        : [];
      console.log("Paginated docs:", JSON.stringify(docs, null, 2));
      setData(docs);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setPage(newPage);
      setLastUpdated(new Date().toLocaleString());
      setLoading(false);
    } catch (err) {
      console.error("Error fetching page:", err.message, err.stack);
      setError(`Failed to fetch page data: ${err.message}`);
      setData([]);
      setLoading(false);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setLastDoc(null);
  };

  return (
    <div>
      <Box>
        {error && <Alert severity="error">{error}</Alert>}
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Last Updated: {lastUpdated || "Never"}
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" padding={2}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Device ID</TableCell>
                    <TableCell>Temperature (°C)</TableCell>
                    <TableCell>RSSI (dBm)</TableCell>
                    <TableCell>SNR (dB)</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.deviceId}</TableCell>
                      <TableCell>
                        {row.sensorData?.temperature ?? "N/A"}
                      </TableCell>
                      <TableCell>{row.networkData?.rssi ?? "N/A"}</TableCell>
                      <TableCell>{row.networkData?.snr ?? "N/A"}</TableCell>
                      <TableCell>
                        {row.timestamp
                          ? new Date(row.timestamp).toLocaleString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Box>
      <div>
        <h2>Real-Time IoT Data Viewer</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <DeviceSVG data={latestData} />
      </div>
    </div>
  );
};

export default IoTDataTable;
