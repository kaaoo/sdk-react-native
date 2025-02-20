import * as React from 'react';
import { useState } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  clearSession,
  ZowieAuthenticationType,
  ZowieChat,
} from 'react-native-zowiesdk';

export default function App() {
  const [showChat, setShowChat] = useState(false);

  const customColors = {
    incomingMessageBackgroundColor: '#f2f2f2',
    incomingMessagePrimaryTextColor: '#333333',
    incomingMessageSecondaryTextColor: '#666666',
    incomingMessageLinksColor: '#e61472',
    userMessagePrimaryTextColor: '#ffffff',
    userMessageBackgroundColor: '#ee403a',
    backgroundColor: '#ffffff',
    newMessageTextColor: '#333333',
    sendTextButtonColor: '#ee403a',
    sendTextButtonDisabledColor: '#999999',
    separatorColor: '#ebebeb',
    quickButtonBackgroundColor: '#fbd6b5',
    quickButtonTextColor: '#ee403a',
    zowieLogoButtonBackgroundColor: '#ffffff',
    typingAnimationColor: '#999999',
    typingAnimationBackgroundColor: '#f2f2f2',
    urlTemplateButtonBackgroundColor: '#ffffff',
    urlTemplateButtonTextColor: '#ee403a',
    actionButtonTextColor: '#ee403a',
    actionButtonBackgroundColor: '#ffffff',
    placeholderTextColor: '#999999',
    messageErrorColor: '#EB5249',
  };

  return (
    <SafeAreaView style={styles.container}>
      {showChat ? (
        <ZowieChat
          host="example.chat.getzowie.com/api/v1/core"
          config={{
            instanceId: 'your_instance_id',
            authenticationType: ZowieAuthenticationType.Anonymous,
          }}
          customColors={customColors}
        />
      ) : (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setShowChat(true);
            }}
          >
            <Text style={styles.buttonText}>Show chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => await clearSession()}
          >
            <Text style={styles.buttonText}>Clear session</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#403AEE',
  },
  box: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    gap: 16,
  },
  buttonText: {
    color: 'black',
  },
});
