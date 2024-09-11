import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeviceModal from "./DeviceConnectionModal";
import useBLE from "./useBLE";
import { FontAwesome } from '@expo/vector-icons';

const App = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [showAlertButtons, setShowAlertButtons] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (connectedDevice && heartRate > 100) {
      setShowAlertButtons(true);
      const timer = setTimeout(() => {
        setShowAlertButtons(false);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [heartRate, connectedDevice]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <FontAwesome name="cog" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.heartRateWrapper}>
        {connectedDevice ? (
          <Text style={styles.heartRateText}>{heartRate} BPM</Text>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Por favor, se conecte a um monitor de frequência cardíaca
          </Text>
        )}
      </View>

      {!connectedDevice && (
        <TouchableOpacity
          onPress={openModal}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaButtonText}>Conectar</Text>
        </TouchableOpacity>
      )}

      {connectedDevice && (
        <>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.buttonText}>Registro Emocional</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.buttonText}>Escutar Playlist</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.imersionButton}>
            <Text style={styles.buttonText}>Imersão</Text>
          </TouchableOpacity>
        </>
      )}

      {showAlertButtons && (
        <View style={styles.alertButtonWrapper}>
          <TouchableOpacity style={styles.alertButton}>
            <Text style={styles.buttonText}>Assistir VR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.alertButton}>
            <Text style={styles.buttonText}>Escutar Música</Text>
          </TouchableOpacity>
        </View>
      )}

      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0B3FF",
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 100,
  },
  heartRateWrapper: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3E7FF",
    borderRadius: 100,
    paddingVertical: 10,
    marginBottom: 20,
    width: "90%",
    alignSelf: "center",
  },
  heartRateText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#000",
  },
  heartRateTitleText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  ctaButton: {
    backgroundColor: "#8b2fc9",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#bd68ee",
    paddingVertical: 30,
    borderRadius: 20,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  imersionButton: {
    backgroundColor: "#8b2fc9",
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
  },
  alertButtonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  alertButton: {
    backgroundColor: "#d00000",
    paddingVertical: 15,
    borderRadius: 20,
    width: "45%",
    alignItems: "center",
  },
});

export default App;
