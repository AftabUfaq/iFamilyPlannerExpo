import React, {useState} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface ICreateEventModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}



const CreateEventModal: React.FC<ICreateEventModalProps> = (props) => {
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
  const [additionalInputs, setAdditionalInputs] = useState<string[]>([]);

  const handlePlusClick = () => {
    setAdditionalInputs([...additionalInputs, '']);
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = [...additionalInputs];
    updatedInputs[index] = value;
    setAdditionalInputs(updatedInputs);
  };

  const handleProfileClick = (profileId: number) => {
    if (selectedProfiles.includes(profileId)) {
      setSelectedProfiles(selectedProfiles.filter((id) => id !== profileId));
    } else {
      setSelectedProfiles([...selectedProfiles, profileId]);
    }
  };

  const getRingColor = (profileId: number) => {
    return selectedProfiles.includes(profileId) ? styles.ringBlue : styles.ringWhite;
  };

  if (!props.isOpen) {
    return null;
  }

  return (
      <Modal
          animationType="slide"
          transparent={true}
          visible={props.isOpen}
          onRequestClose={() => {
            props.setOpen(false);
          }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* Profile images and inputs would be here */}
            {/* ... */}
            <TouchableOpacity onPress={handlePlusClick} style={styles.plusIcon}>
              <Text style={styles.plusIconText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                  // Replace console.log with your save function
                  props.setOpen(false);
                }}
                style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.setOpen(false)}
                style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // Other styles for inputs, buttons, images, etc.
  // ...
  plusIcon: {
    // Style for the plus icon button
  },
  plusIconText: {
    // Style for the text inside the plus icon button
  },
  saveButton: {
    // Style for the save button
  },
  saveButtonText: {
    // Style for the save button text
  },
  cancelButton: {
    // Style for the cancel button
  },
  cancelButtonText: {
    // Style for the cancel button text
  },
  ringBlue: {
    // Style for blue ring
  },
  ringWhite: {
    // Style for white ring
  },
});

export default CreateEventModal;
