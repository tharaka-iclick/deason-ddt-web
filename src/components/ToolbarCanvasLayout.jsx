import React, { useState } from "react";

const ToolbarCanvasLayout = () => {
  const [canvasData, setCanvasData] = useState(
    "Canvas Area - Click to draw or interact"
  );
  const [selectedStencil, setSelectedStencil] = useState(null);

  const stencilItems = [
    { id: 1, name: "Rectangle", color: "#1976d2" },
    { id: 2, name: "Circle", color: "#388e3c" },
    { id: 3, name: "Triangle", color: "#f57c00" },
    { id: 4, name: "Line", color: "#7b1fa2" },
    { id: 5, name: "Text", color: "#d32f2f" },
    { id: 6, name: "Arrow", color: "#0288d1" },
  ];

  const handleStencilSelect = (stencil) => {
    setSelectedStencil(stencil);
    setCanvasData(`Selected: ${stencil.name} - Ready to place on canvas`);
  };

  const handleCanvasClick = () => {
    if (selectedStencil) {
      setCanvasData(`Added ${selectedStencil.name} to canvas`);
    } else {
      setCanvasData("Select a stencil first to add elements");
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      backgroundColor: "#f5f5f5",
    },

    // Top Bar Styles
    topBar: {
      backgroundColor: "#1976d2",
      color: "white",
      padding: "8px 16px",
      display: "flex",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      zIndex: 1000,
    },

    menuButton: {
      backgroundColor: "transparent",
      border: "none",
      color: "white",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "4px",
      marginRight: "16px",
      fontSize: "20px",
      transition: "background-color 0.2s ease",
    },

    title: {
      fontSize: "20px",
      fontWeight: 500,
      flexGrow: 1,
      margin: 0,
    },

    toolbarActions: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
    },

    iconButton: {
      backgroundColor: "transparent",
      border: "none",
      color: "white",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "4px",
      fontSize: "20px",
      transition: "background-color 0.2s ease",
    },

    saveButton: {
      backgroundColor: "rgba(255,255,255,0.1)",
      border: "none",
      color: "white",
      cursor: "pointer",
      padding: "8px 16px",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: 500,
      marginLeft: "16px",
      transition: "background-color 0.2s ease",
    },

    // Main Content Styles
    mainContent: {
      display: "flex",
      flexDirection: "row",
      flex: 1,
      gap: "16px",
      padding: "16px",
      height: "calc(100vh - 64px)",
    },

    // Canvas Styles
    canvasContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },

    canvasHeader: {
      padding: "16px",
      backgroundColor: "#f5f5f5",
      borderBottom: "1px solid #e0e0e0",
    },

    canvasHeaderTitle: {
      fontSize: "18px",
      fontWeight: 500,
      margin: 0,
      color: "#333",
    },

    canvasArea: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fafafa",
      cursor: "pointer",
      border: "2px dashed #ccc",
      margin: "16px",
      borderRadius: "8px",
      transition: "all 0.3s ease",
      minHeight: "200px",
    },

    canvasText: {
      fontSize: "16px",
      color: "#666",
      textAlign: "center",
      padding: "0 16px",
    },

    // Stencil Container Styles
    stencilContainer: {
      width: "280px",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },

    stencilHeader: {
      padding: "16px",
      backgroundColor: "#f5f5f5",
      borderBottom: "1px solid #e0e0e0",
    },

    stencilHeaderTitle: {
      fontSize: "18px",
      fontWeight: 500,
      margin: 0,
      color: "#333",
    },

    stencilList: {
      flex: 1,
      overflow: "auto",
    },

    stencilItem: {
      padding: "16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      transition: "background-color 0.2s ease",
      borderBottom: "1px solid #f0f0f0",
    },

    stencilIcon: {
      width: "24px",
      height: "24px",
      borderRadius: "4px",
    },

    stencilName: {
      fontSize: "14px",
      color: "#333",
      fontWeight: 400,
    },

    stencilFooter: {
      padding: "16px",
      borderTop: "1px solid #e0e0e0",
    },

    clearButton: {
      width: "100%",
      padding: "8px 16px",
      backgroundColor: "transparent",
      border: "1px solid #1976d2",
      color: "#1976d2",
      cursor: "pointer",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: 500,
      transition: "all 0.2s ease",
    },
  };

  return (
    <div style={styles.container}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <button
          style={styles.menuButton}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
          }
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          ☰
        </button>

        <h1 style={styles.title}>Design Studio</h1>

        <div style={styles.toolbarActions}>
          <button
            style={styles.iconButton}
            title="Undo"
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            ↶
          </button>
          <button
            style={styles.iconButton}
            title="Redo"
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            ↷
          </button>
          <button
            style={styles.iconButton}
            title="Zoom In"
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            🔍+
          </button>
          <button
            style={styles.iconButton}
            title="Zoom Out"
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            🔍-
          </button>
          <button
            style={styles.saveButton}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
          >
            💾 Save
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={styles.mainContent}>
        {/* Canvas Area */}
        <div style={styles.canvasContainer}>
          <div style={styles.canvasHeader}>
            <h2 style={styles.canvasHeaderTitle}>Canvas</h2>
          </div>

          <div
            style={{
              ...styles.canvasArea,
              borderColor: selectedStencil ? selectedStencil.color : "#ccc",
              backgroundColor: selectedStencil ? "#f8f9ff" : "#fafafa",
            }}
            onClick={handleCanvasClick}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = selectedStencil
                ? "#f0f4ff"
                : "#f0f0f0";
              e.target.style.borderColor = selectedStencil
                ? selectedStencil.color
                : "#1976d2";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = selectedStencil
                ? "#f8f9ff"
                : "#fafafa";
              e.target.style.borderColor = selectedStencil
                ? selectedStencil.color
                : "#ccc";
            }}
          >
            <div style={styles.canvasText}>{canvasData}</div>
          </div>
        </div>

        {/* Stencil Container */}
        <div style={styles.stencilContainer}>
          <div style={styles.stencilHeader}>
            <h2 style={styles.stencilHeaderTitle}>Stencils</h2>
          </div>

          <div style={styles.stencilList}>
            {stencilItems.map((stencil) => (
              <div
                key={stencil.id}
                style={{
                  ...styles.stencilItem,
                  backgroundColor:
                    selectedStencil?.id === stencil.id
                      ? "#e3f2fd"
                      : "transparent",
                }}
                onClick={() => handleStencilSelect(stencil)}
                onMouseEnter={(e) => {
                  if (selectedStencil?.id !== stencil.id) {
                    e.target.style.backgroundColor = "#f5f5f5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedStencil?.id !== stencil.id) {
                    e.target.style.backgroundColor = "transparent";
                  }
                }}
              >
                <div
                  style={{
                    ...styles.stencilIcon,
                    backgroundColor: stencil.color,
                    borderRadius: stencil.name === "Circle" ? "50%" : "4px",
                  }}
                />
                <div style={styles.stencilName}>{stencil.name}</div>
              </div>
            ))}
          </div>

          <div style={styles.stencilFooter}>
            <button
              style={styles.clearButton}
              onClick={() => {
                setSelectedStencil(null);
                setCanvasData("Canvas cleared - Select a stencil to start");
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e3f2fd";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolbarCanvasLayout;
