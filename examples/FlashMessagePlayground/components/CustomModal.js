import React, { useEffect, useCallback, useRef } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

import FlashMessage, { FlashMessageManager, showMessage, hideMessage } from "react-native-flash-message";

import DemoButton from "./DemoButton";

export default function CustomModal({ modalVisible = false, setModalVisible }) {
  const flashRef = useRef(null);

  const captureFlashMessageRef = useCallback(ref => {
    if (ref !== null) {
      FlashMessageManager.hold(ref);
      flashRef.current = ref;
    }
  }, []);

  function unholdFlashMessage() {
    if (!!flashRef.current) {
      FlashMessageManager.unhold();
    }
  }

  function closeModal() {
    unholdFlashMessage();
    setModalVisible(false);
  }

  useEffect(() => {
    return () => unholdFlashMessage();
  }, []);

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Hello World!</Text>
        <View style={{ alignSelf: "center", width: "100%", padding: 23 }}>
          <View style={styles.group}>
            <DemoButton
              style={styles.demoButton}
              labelStyle={{ color: "#666" }}
              label="Show Message"
              onPress={() =>
                showMessage({
                  message: "This message",
                  description: "In a native modal",
                  type: "info",
                })
              }
            />
            <DemoButton
              style={styles.demoButton}
              labelStyle={{ color: "#999" }}
              label="Hide Message"
              onPress={() => hideMessage()}
            />
          </View>
          <DemoButton
            style={styles.demoButton}
            labelStyle={{ color: "#C00", fontSize: 16 }}
            label="Close this Modal"
            onPress={closeModal}
          />
        </View>
      </View>
      <FlashMessage ref={captureFlashMessageRef} position="center" />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    position: "absolute",
    top: 26,
    bottom: 26,
    left: 26,
    right: 26,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "red",
    padding: 35,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  group: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  demoButton: {
    backgroundColor: "#ddd",
    alignSelf: "auto",
    marginBottom: 9,
    marginHorizontal: 5,
  },
});
